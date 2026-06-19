<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['user', 'category']);

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        if ($request->has('locality')) {
            $query->where('locality', 'like', '%' . $request->locality . '%');
        }
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }
        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Seuls les produits disponibles par défaut dans le catalogue
        if (!$request->has('include_unavailable')) {
            $query->where('quantity', '>', 0);
        }

        return response()->json($query->latest()->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:1',
            'category_id' => 'required|exists:categories,id',
            'locality' => 'required|string',
            'image' => 'nullable|image|max:2048'
        ]);

        $data = $request->except('image');
        $data['user_id'] = $request->user()->id;

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $data['image_url'] = Storage::url($path);
        }

        $product = Product::create($data);
        return response()->json($product, 201);
    }

    public function show(Product $product)
    {
        return response()->json($product->load(['user', 'category']));
    }

    public function update(Request $request, Product $product)
    {
        if ($request->user()->id !== $product->user_id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'price' => 'sometimes|required|numeric|min:0',
            'quantity' => 'sometimes|required|integer|min:0',
            'category_id' => 'sometimes|required|exists:categories,id',
            'locality' => 'sometimes|required|string',
            'image' => 'nullable|image|max:2048'
        ]);

        $data = $request->except('image');

        if ($request->hasFile('image')) {
            if ($product->image_url) {
                $oldPath = str_replace('/storage/', '', $product->image_url);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('products', 'public');
            $data['image_url'] = Storage::url($path);
        }

        $product->update($data);
        return response()->json($product);
    }

    public function destroy(Request $request, Product $product)
    {
        if ($request->user()->id !== $product->user_id && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        if ($product->image_url) {
            $path = str_replace('/storage/', '', $product->image_url);
            Storage::disk('public')->delete($path);
        }
        
        $product->delete();
        return response()->json(['message' => 'Produit supprimé avec succès']);
    }
}
