<?php

namespace Database\Seeders;

use App\Models\OrderItem;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Database\Seeder;

class OrderItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $orders = Order::all();
        $products = Product::all();

        $orderItems = [
            ['quantity' => 5, 'unit_price' => 15.50],
            ['quantity' => 3, 'unit_price' => 8.75],
            ['quantity' => 2, 'unit_price' => 25.00],
            ['quantity' => 10, 'unit_price' => 12.00],
            ['quantity' => 4, 'unit_price' => 20.00],
            ['quantity' => 1, 'unit_price' => 35.00],
        ];

        $itemIndex = 0;
        foreach ($orders as $order) {
            // Add 2-3 random products per order
            $numItems = rand(2, 3);

            for ($i = 0; $i < $numItems; $i++) {
                $item = $orderItems[$itemIndex % count($orderItems)];
                $product = $products->random();

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                ]);

                $itemIndex++;
            }
        }
    }
}
