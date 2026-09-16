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

    /* Tableau produits */
    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .items-table th { background: #f3f4f6; text-align: left; padding: 10px 14px; font-size: 11px; font-weight: 700; color: #555; text-transform: uppercase; letter-spacing: 0.5px; }
    .items-table th:last-child, .items-table td:last-child { text-align: right; }
    .items-table td { padding: 12px 14px; border-bottom: 1px solid #f0f0f0; font-size: 13px; }
    .items-table tr:last-child td { border-bottom: none; }

    /* Totaux */
    .totals { width: 280px; margin-left: auto; margin-bottom: 28px; }
    .totals-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-size: 13px; }
    .totals-row:last-child { border-bottom: none; border-top: 2px solid #1a1a1a; margin-top: 4px; padding-top: 12px; font-weight: 900; font-size: 16px; color: #6ab04c; }

    /* Pied de page */
    .footer { border-top: 1px solid #e5e7eb; padding-top: 18px; display: flex; justify-content: space-between; font-size: 11px; color: #aaa; }

    .thank-you { text-align: center; margin-bottom: 24px; font-size: 13px; color: #555; }
    .thank-you strong { color: #6ab04c; font-size: 15px; font-weight: 900; }
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
            <h1>Facture</h1>
            <p>Commande #{{ str_pad($order->id, 5, '0', STR_PAD_LEFT) }}</p>
            <p>{{ \Carbon\Carbon::parse($order->updated_at)->format('d/m/Y à H:i') }}</p>
            @if($order->payment_reference)
            <p style="margin-top:4px;">Réf. paiement : {{ $order->payment_reference }}</p>
            @endif
        </div>
    </div>

    <div class="status-badge">✓ Paiement confirmé</div>

    <!-- Informations client & livraison -->
    <div class="info-grid">
        <div class="info-box">
            <h3>Client</h3>
            <p><strong>{{ $order->user->name }}</strong></p>
            <p>{{ $order->user->email }}</p>
            @if($order->user->phone)
            <p>+228 {{ $order->user->phone }}</p>
            @endif
        </div>
        <div class="info-box">
            <h3>Adresse de livraison</h3>
            <p>{{ $order->delivery_address }}</p>
            <p style="margin-top:8px;font-size:11px;color:#888;">Commande passée le {{ \Carbon\Carbon::parse($order->created_at)->format('d/m/Y') }}</p>
        </div>
    </div>

    <!-- Tableau des articles -->
    <table class="items-table">
        <thead>
            <tr>
                <th>Produit</th>
                <th style="text-align:center;">Qté</th>
                <th style="text-align:right;">Prix unitaire</th>
                <th>Sous-total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $item)
            <tr>
                <td>{{ $item->product->name ?? 'Produit supprimé' }}</td>
                <td style="text-align:center;">{{ $item->quantity }}</td>
                <td style="text-align:right;">{{ number_format($item->unit_price, 0, ',', ' ') }} FCFA</td>
                <td style="text-align:right;">{{ number_format($item->quantity * $item->unit_price, 0, ',', ' ') }} FCFA</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <!-- Totaux -->
    <div class="totals">
        <div class="totals-row">
            <span>Sous-total</span>
            <span>{{ number_format($order->total_amount, 0, ',', ' ') }} FCFA</span>
        </div>
        <div class="totals-row">
            <span>Frais de livraison</span>
            <span>À la charge de l'acheteur</span>
        </div>
        <div class="totals-row">
            <span>Total payé</span>
            <span>{{ number_format($order->total_amount, 0, ',', ' ') }} FCFA</span>
        </div>
    </div>

    <div class="thank-you">
        <strong>Merci pour votre confiance !</strong><br>
        Ce document tient lieu de facture pour votre commande.
    </div>

    <!-- Pied de page -->
    <div class="footer">
        <span>Vendify · vendify.tg · contact@vendify.tg</span>
        <span>Document généré automatiquement — non modifiable</span>
    </div>

</div>
</body>
</html>
