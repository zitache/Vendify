<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class PaymentController extends Controller
{
    /**
     * Vérifie une transaction KiKiaPay et confirme la commande.
     */
    public function verify(Request $request)
    {
        $request->validate([
            'order_id'       => 'required|exists:orders,id',
            'transaction_id' => 'required|string',
        ]);

        $order = Order::findOrFail($request->order_id);

        if ($order->status === 'confirmée') {
            return response()->json(['message' => 'Commande déjà confirmée.', 'order' => $order]);
        }

        // ── Vérification auprès de l'API KiKiaPay ────────────────────────────
        $apiBase = config('services.kkiapay.api_base');
        $privateKey = config('services.kkiapay.private_key');

        $kkResponse = Http::withHeaders([
            'x-secret-key' => $privateKey,
        ])->post("{$apiBase}/api/v1/transactions/status", [
            'transactionId' => $request->transaction_id,
        ]);

        if (!$kkResponse->ok()) {
            return response()->json([
                'message' => 'Impossible de contacter KiKiaPay. Réessayez ou contactez le support.',
            ], 502);
        }

        $txData = $kkResponse->json();

        // KiKiaPay renvoie status: "SUCCESS" si le paiement est validé
        if (($txData['status'] ?? '') !== 'SUCCESS') {
            return response()->json([
                'message' => 'Transaction non validée par KiKiaPay (statut : ' . ($txData['status'] ?? 'inconnu') . ').',
            ], 400);
        }

        // ── Confirmer la commande et créditer les agriculteurs ────────────────
        DB::transaction(function () use ($order, $request) {
            $order->update([
                'status'            => 'confirmée',
                'payment_reference' => $request->transaction_id,
            ]);

            $order->load('items.product');
            $earnings = [];

            foreach ($order->items as $item) {
                $farmerId = $item->product->user_id ?? null;
                if (!$farmerId) continue;
                $subtotal = $item->quantity * $item->unit_price;
                $earnings[$farmerId] = ($earnings[$farmerId] ?? 0) + $subtotal;
            }

            foreach ($earnings as $farmerId => $amount) {
                User::where('id', $farmerId)
                    ->where('role', 'agriculteur')
                    ->increment('balance', $amount);
            }
        });

        return response()->json([
            'message' => 'Paiement vérifié. Commande confirmée avec succès.',
            'order'   => $order->fresh(),
        ]);
    }
}
