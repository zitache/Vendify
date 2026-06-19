<?php

namespace Database\Seeders;

use App\Models\Message;
use App\Models\User;
use App\Models\Product;
use Illuminate\Database\Seeder;

class MessageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $products = Product::all();
        $farmers = User::where('role', 'agriculteur')->get();
        $buyers = User::where('role', 'acheteur')->get();

        $messageContents = [
            'Is this product still available?',
            'What is the best time to pick up?',
            'Can you deliver to my location?',
            'What are the prices for bulk orders?',
            'Are these products organic?',
            'Can I negotiate the price?',
            'Do you have any discounts?',
            'How long is the shelf life?',
            'Can I reserve some for next week?',
            'What payment methods do you accept?',
        ];

        // Create messages between buyers and farmers about products
        for ($i = 0; $i < 10; $i++) {
            $buyer = $buyers->random();
            $product = $products->random();
            $farmer = $product->user;

            Message::create([
                'sender_id' => $buyer->id,
                'receiver_id' => $farmer->id,
                'product_id' => $product->id,
                'content' => $messageContents[array_rand($messageContents)],
                'is_read' => rand(0, 1),
            ]);
        }

        // Create responses from farmers
        for ($i = 0; $i < 8; $i++) {
            $responses = [
                'Yes, we have plenty in stock!',
                'You can pick up anytime during business hours.',
                'Yes, we offer delivery in your area.',
                'Special prices available for bulk orders!',
                'Yes, all our products are 100% organic.',
                'I can offer you a 10% discount.',
                'We have seasonal discounts available.',
                'Fresh products last about 1-2 weeks.',
                'Sure, I can reserve some for you.',
                'We accept cash, card, and online transfers.',
            ];

            $farmer = $farmers->random();
            $buyer = $buyers->random();
            $product = Product::where('user_id', $farmer->id)->first() ?? $products->first();

            Message::create([
                'sender_id' => $farmer->id,
                'receiver_id' => $buyer->id,
                'product_id' => $product->id,
                'content' => $responses[array_rand($responses)],
                'is_read' => 1,
            ]);
        }
    }
}
