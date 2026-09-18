<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    /**
     * Vérifie une transaction KiKiaPay et confirme la commande.
     * En mode sandbox, la vérification externe est contournée (transactions simulées).
     */
    public function verify(Request $request)
    {
        $request->validate([
            'order_id'       => 'required|exists:orders,id',
            'transaction_id' => 'required|string',
        ]);

        $order = Order::findOrFail($request->order_id);

        Log::info('PAYMENT_VERIFY', [
            'order_id'       => $request->order_id,
            'transaction_id' => $request->transaction_id,
            'order_status'   => $order->status,
        ]);

        if ($order->status === 'confirmée') {
            return response()->json(['message' => 'Commande déjà confirmée.', 'order' => $order]);
        }

        $isSandbox = config('services.kkiapay.sandbox');
        Log::info('PAYMENT_SANDBOX_MODE', ['sandbox' => $isSandbox]);

        // En production uniquement : vérification auprès de l'API KiKiaPay
        if (!$isSandbox) {
            $apiBase    = config('services.kkiapay.api_base');
            $privateKey = config('services.kkiapay.private_key');

            try {
                $kkResponse = Http::timeout(10)->withHeaders([
                    'x-secret-key' => $privateKey,
                ])->post("{$apiBase}/api/v1/transactions/status", [
                    'transactionId' => $request->transaction_id,
                ]);
            } catch (\Exception $e) {
                Log::error('KKIAPAY_TIMEOUT', ['error' => $e->getMessage()]);
                return response()->json([
                    'message' => 'KiKiaPay ne répond pas (timeout). Réessayez dans quelques secondes.',
                ], 504);
            }

            if (!$kkResponse->ok()) {
                Log::error('KKIAPAY_ERROR', ['status' => $kkResponse->status(), 'body' => $kkResponse->body()]);
                return response()->json([
                    'message' => 'Impossible de contacter KiKiaPay. Réessayez ou contactez le support.',
                ], 502);
            }

            $txData = $kkResponse->json();

            if (($txData['status'] ?? '') !== 'SUCCESS') {
                return response()->json([
                    'message' => 'Transaction non validée par KiKiaPay (statut : ' . ($txData['status'] ?? 'inconnu') . ').',
                ], 400);
            }
        }

        // ── Confirmer la commande et créditer les agriculteurs ────────────────
        try {
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

                Log::info('PAYMENT_EARNINGS', ['earnings' => $earnings]);

                foreach ($earnings as $farmerId => $amount) {
                    User::where('id', $farmerId)
                        ->where('role', 'agriculteur')
                        ->increment('balance', $amount);
                }
            });
        } catch (\Exception $e) {
            Log::error('PAYMENT_TRANSACTION_FAILED', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Erreur lors de la confirmation : ' . $e->getMessage()], 500);
        }

        Log::info('PAYMENT_SUCCESS', ['order_id' => $order->id]);

        return response()->json([
            'message' => 'Paiement vérifié. Commande confirmée avec succès.',
            'order'   => $order->fresh(),
        ]);
    }
}
