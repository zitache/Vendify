<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        if ($user->role === 'agriculteur') {
            // Agriculteur voit les commandes contenant ses produits
            $orders = Order::whereHas('items.product', function($q) use ($user) {
                $q->where('user_id', $user->id);
            })->with(['items.product', 'user'])->latest()->get();
            return response()->json($orders);
        }

        // Acheteur voit ses propres commandes
        $orders = Order::where('user_id', $user->id)->with(['items.product'])->latest()->get();
        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $request->validate([
            'delivery_address' => 'required|string',
            'payment_reference' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        try {
            DB::beginTransaction();

            $total = 0;
            $orderItems = [];

            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                
                if ($product->quantity < $item['quantity']) {
                    return response()->json(['message' => "Stock insuffisant pour le produit {$product->name}"], 400);
                }

                $subtotal = $product->price * $item['quantity'];
                $total += $subtotal;

                // Mettre à jour le stock
                $product->quantity -= $item['quantity'];
                $product->save();

                $orderItems[] = new OrderItem([
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->price
                ]);
            }

            $order = Order::create([
                'user_id' => $request->user()->id,
                'status' => 'en attente',
                'total_amount' => $total,
                'delivery_address' => $request->delivery_address,
                'payment_reference' => $request->payment_reference,
            ]);

            $order->items()->saveMany($orderItems);

            DB::commit();

            return response()->json($order->load('items.product'), 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erreur lors de la création de la commande'], 500);
        }
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:en attente,confirmée,en transit,livrée'
        ]);

        // Vérifier les droits
        $user = $request->user();
        if ($user->role !== 'agriculteur' && $user->role !== 'admin') {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $order->update(['status' => $request->status]);
        return response()->json($order);
    }
}
