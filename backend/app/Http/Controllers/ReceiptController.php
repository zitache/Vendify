<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Withdrawal;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class ReceiptController extends Controller
{
    // Reçu de retrait (agriculteur)
    public function withdrawal(Request $request, Withdrawal $withdrawal)
    {
        $user = $request->user();

        // L'agriculteur ne peut télécharger que ses propres reçus
        if ($user->role !== 'admin' && $withdrawal->user_id !== $user->id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        if ($withdrawal->status !== 'approved') {
            return response()->json(['message' => 'Reçu disponible uniquement après approbation.'], 400);
        }

        $withdrawal->load('user');

        $pdf = Pdf::loadView('pdf.withdrawal_receipt', [
            'withdrawal' => $withdrawal,
            'user'       => $withdrawal->user,
        ])->setPaper('a4', 'portrait');

        $filename = 'recu_retrait_' . str_pad($withdrawal->id, 5, '0', STR_PAD_LEFT) . '.pdf';

        return $pdf->download($filename);
    }

    // Facture commande (acheteur)
    public function order(Request $request, Order $order)
    {
        $user = $request->user();

        // L'acheteur ne peut télécharger que ses propres factures
        if ($user->role !== 'admin' && $order->user_id !== $user->id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        if ($order->status !== 'confirmée') {
            return response()->json(['message' => 'Facture disponible uniquement après confirmation du paiement.'], 400);
        }

        $order->load(['user', 'items.product']);

        $pdf = Pdf::loadView('pdf.order_receipt', [
            'order' => $order,
        ])->setPaper('a4', 'portrait');

        $filename = 'facture_commande_' . str_pad($order->id, 5, '0', STR_PAD_LEFT) . '.pdf';

        return $pdf->download($filename);
    }
}
