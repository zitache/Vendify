<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $buyers = User::where('role', 'acheteur')->get();

        $orders = [
            [
                'status' => 'en attente de paiement',
                'total_amount' => 45.50,
                'delivery_address' => '123 Street, Casablanca',
                'payment_reference' => 'PAY-001-' . date('YmdHis'),
            ],
            [
                'status' => 'confirmée',
                'total_amount' => 75.00,
                'delivery_address' => '456 Avenue, Rabat',
                'payment_reference' => 'PAY-002-' . date('YmdHis'),
            ],
            [
                'status' => 'livrée',
                'total_amount' => 120.75,
                'delivery_address' => '789 Road, Tangier',
                'payment_reference' => 'PAY-003-' . date('YmdHis'),
            ],
            [
                'status' => 'en attente',
                'total_amount' => 60.00,
                'delivery_address' => '321 Boulevard, Marrakech',
                'payment_reference' => 'PAY-004-' . date('YmdHis'),
            ],
        ];

        $buyerIndex = 0;
        foreach ($orders as $order) {
            $buyer = $buyers[$buyerIndex % count($buyers)];

            Order::create([
                'user_id' => $buyer->id,
                'status' => $order['status'],
                'total_amount' => $order['total_amount'],
                'delivery_address' => $order['delivery_address'],
                'payment_reference' => $order['payment_reference'],
            ]);

            $buyerIndex++;
        }
    }
}
