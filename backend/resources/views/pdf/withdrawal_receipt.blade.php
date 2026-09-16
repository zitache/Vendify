<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: DejaVu Sans, sans-serif; font-size: 13px; color: #1a1a1a; background: #fff; }

    .page { padding: 40px 50px; }

    /* En-tête */
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #6ab04c; padding-bottom: 20px; margin-bottom: 30px; }
    .brand { font-size: 28px; font-weight: 900; color: #6ab04c; letter-spacing: -1px; }
    .brand span { color: #1a1a1a; }
    .doc-title { text-align: right; }
    .doc-title h1 { font-size: 18px; font-weight: 700; color: #1a1a1a; }
    .doc-title p { font-size: 11px; color: #888; margin-top: 4px; }

    /* Badge statut */
    .status-badge { display: inline-block; padding: 6px 16px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; background: #d1fae5; color: #065f46; margin-bottom: 24px; }

    /* Sections infos */
    .info-grid { display: flex; gap: 30px; margin-bottom: 28px; }
    .info-box { flex: 1; background: #f9fafb; border-radius: 10px; padding: 16px 20px; border-left: 4px solid #6ab04c; }
    .info-box h3 { font-size: 10px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
    .info-box p { font-size: 13px; color: #1a1a1a; margin-bottom: 4px; }
    .info-box p strong { font-weight: 700; }

    /* Tableau montants */
    .amount-table { width: 100%; border-collapse: collapse; margin-bottom: 28px; }
    .amount-table th { background: #f3f4f6; text-align: left; padding: 10px 14px; font-size: 11px; font-weight: 700; color: #555; text-transform: uppercase; letter-spacing: 0.5px; }
    .amount-table td { padding: 12px 14px; border-bottom: 1px solid #f0f0f0; font-size: 13px; }
    .amount-table tr:last-child td { border-bottom: none; }
    .amount-table .total-row td { font-weight: 900; font-size: 15px; background: #f0fdf4; color: #065f46; }

    /* Note */
    .note-box { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 14px 18px; margin-bottom: 28px; font-size: 12px; color: #92400e; }
    .note-box strong { font-weight: 700; }

    /* Pied de page */
    .footer { border-top: 1px solid #e5e7eb; padding-top: 18px; display: flex; justify-content: space-between; font-size: 11px; color: #aaa; }
</style>
</head>
<body>
<div class="page">

    <!-- En-tête -->
    <div class="header">
        <div>
            <div class="brand">Vendi<span>fy</span></div>
            <p style="font-size:11px;color:#888;margin-top:4px;">Plateforme agricole · Région de la Kara, Togo</p>
        </div>
        <div class="doc-title">
            <h1>Reçu de Retrait</h1>
            <p>Réf. #RET-{{ str_pad($withdrawal->id, 5, '0', STR_PAD_LEFT) }}</p>
            <p>{{ \Carbon\Carbon::parse($withdrawal->processed_at ?? $withdrawal->updated_at)->format('d/m/Y à H:i') }}</p>
        </div>
    </div>

    <div class="status-badge">✓ Retrait approuvé</div>

    <!-- Informations -->
    <div class="info-grid">
        <div class="info-box">
            <h3>Bénéficiaire</h3>
            <p><strong>{{ $user->name }}</strong></p>
            <p>{{ $user->email }}</p>
            <p>{{ $withdrawal->phone }}</p>
            @if($user->locality)
            <p>{{ $user->locality }}</p>
            @endif
        </div>
        <div class="info-box">
            <h3>Mode de paiement</h3>
            <p><strong>{{ $withdrawal->method === 'moov' ? 'Moov Africa' : 'Yas Money (T-Money)' }}</strong></p>
            <p>Numéro : {{ $withdrawal->phone }}</p>
            <p style="margin-top:8px;font-size:11px;color:#888;">Demande soumise le {{ \Carbon\Carbon::parse($withdrawal->created_at)->format('d/m/Y') }}</p>
        </div>
    </div>

    <!-- Détail des montants -->
    <table class="amount-table">
        <thead>
            <tr>
                <th>Description</th>
                <th style="text-align:right;">Montant (FCFA)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Montant demandé</td>
                <td style="text-align:right;">{{ number_format($withdrawal->amount, 0, ',', ' ') }}</td>
            </tr>
            <tr>
                <td style="color:#dc2626;">Commission plateforme (5%)</td>
                <td style="text-align:right;color:#dc2626;">− {{ number_format($withdrawal->fee, 0, ',', ' ') }}</td>
            </tr>
            <tr class="total-row">
                <td>Montant net reçu</td>
                <td style="text-align:right;">{{ number_format($withdrawal->net_amount, 0, ',', ' ') }}</td>
            </tr>
        </tbody>
    </table>

    @if($withdrawal->admin_note)
    <div class="note-box">
        <strong>Note de l'administrateur :</strong> {{ $withdrawal->admin_note }}
    </div>
    @endif

    <!-- Pied de page -->
    <div class="footer">
        <span>Vendify · vendify.tg · contact@vendify.tg</span>
        <span>Document généré automatiquement — non modifiable</span>
    </div>

</div>
</body>
</html>
