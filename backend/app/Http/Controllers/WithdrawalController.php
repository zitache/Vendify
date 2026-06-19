<?php

namespace App\Http\Controllers;

use App\Models\Withdrawal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WithdrawalController extends Controller
{
    const FEE_RATE = 0.05; // 5% commission plateforme

    // Agriculteur : liste de ses propres retraits
    public function index(Request $request)
    {
        $withdrawals = Withdrawal::where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json($withdrawals);
    }

    // Agriculteur : demande de retrait
    public function store(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:500',
            'method' => 'required|in:moov,yas',
            'phone'  => 'required|string|max:20',
        ]);

        $user   = $request->user();
        $amount = (float) $request->amount;

        if ($user->role !== 'agriculteur') {
            return response()->json(['message' => 'Réservé aux agriculteurs.'], 403);
        }

        if ($user->balance < $amount) {
            return response()->json(['message' => 'Solde insuffisant.'], 422);
        }

        $fee       = round($amount * self::FEE_RATE, 2);
        $netAmount = round($amount - $fee, 2);

        DB::transaction(function () use ($user, $amount, $fee, $netAmount, $request) {
            // Déduire du solde immédiatement
            $user->decrement('balance', $amount);

            Withdrawal::create([
                'user_id'    => $user->id,
                'amount'     => $amount,
                'fee'        => $fee,
                'net_amount' => $netAmount,
                'method'     => $request->method,
                'phone'      => $request->phone,
                'status'     => 'pending',
            ]);
        });

        return response()->json([
            'message'    => 'Demande de retrait soumise avec succès.',
            'amount'     => $amount,
            'fee'        => $fee,
            'net_amount' => $netAmount,
            'balance'    => $user->fresh()->balance,
        ], 201);
    }

    // Admin : liste tous les retraits
    public function adminIndex(Request $request)
    {
        $status = $request->query('status', 'pending');

        $withdrawals = Withdrawal::with('user:id,name,phone')
            ->when($status !== 'all', fn($q) => $q->where('status', $status))
            ->latest()
            ->get();

        return response()->json($withdrawals);
    }

    // Admin : approuver un retrait
    public function approve(Request $request, Withdrawal $withdrawal)
    {
        if ($withdrawal->status !== 'pending') {
            return response()->json(['message' => 'Ce retrait est déjà traité.'], 400);
        }

        $withdrawal->update([
            'status'       => 'approved',
            'admin_note'   => $request->input('note'),
            'processed_at' => now(),
        ]);

        return response()->json(['message' => 'Retrait approuvé.', 'withdrawal' => $withdrawal]);
    }

    // Admin : rejeter un retrait (rembourse le solde)
    public function reject(Request $request, Withdrawal $withdrawal)
    {
        if ($withdrawal->status !== 'pending') {
            return response()->json(['message' => 'Ce retrait est déjà traité.'], 400);
        }

        DB::transaction(function () use ($withdrawal, $request) {
            // Rembourser le montant initial au solde de l'agriculteur
            $withdrawal->user->increment('balance', $withdrawal->amount);

            $withdrawal->update([
                'status'       => 'rejected',
                'admin_note'   => $request->input('note'),
                'processed_at' => now(),
            ]);
        });

        return response()->json(['message' => 'Retrait rejeté et solde remboursé.', 'withdrawal' => $withdrawal]);
    }
}
