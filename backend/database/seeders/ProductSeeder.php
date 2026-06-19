<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $farmers = User::where('role', 'agriculteur')->get();
        $categories = Category::all();

        $products = [
            [
                'name' => 'Fresh Tomatoes',
                'description' => 'Organic tomatoes freshly picked from the farm',
                'price' => 15.50,
                'quantity' => 100,
                'category_id' => Category::where('slug', 'vegetables')->first()->id ?? 1,
                'locality' => 'Fes',
                'image_url' => 'https://via.placeholder.com/300x300?text=Tomatoes',
            ],
            [
                'name' => 'Orange Juice Fruits',
                'description' => 'Fresh organic oranges, perfect for juice',
                'price' => 8.75,
                'quantity' => 150,
                'category_id' => Category::where('slug', 'fruits')->first()->id ?? 1,
                'locality' => 'Marrakech',
                'image_url' => 'https://via.placeholder.com/300x300?text=Oranges',
            ],
            [
                'name' => 'Local Honey',
                'description' => 'Pure natural honey from local beehives',
                'price' => 25.00,
                'quantity' => 50,
                'category_id' => Category::where('slug', 'honey-spices')->first()->id ?? 1,
                'locality' => 'Fes',
                'image_url' => 'https://via.placeholder.com/300x300?text=Honey',
            ],
            [
                'name' => 'Fresh Carrots',
                'description' => 'Sweet and crunchy carrots',
                'price' => 12.00,
                'quantity' => 200,
                'category_id' => Category::where('slug', 'vegetables')->first()->id ?? 1,
                'locality' => 'Marrakech',
                'image_url' => 'https://via.placeholder.com/300x300?text=Carrots',
            ],
            [
                'name' => 'Strawberries',
                'description' => 'Juicy strawberries ready to pick',
                'price' => 20.00,
                'quantity' => 75,
                'category_id' => Category::where('slug', 'fruits')->first()->id ?? 1,
                'locality' => 'Fes',
                'image_url' => 'https://via.placeholder.com/300x300?text=Strawberries',
            ],
            [
                'name' => 'Olive Oil',
                'description' => 'Extra virgin olive oil produced locally',
                'price' => 35.00,
                'quantity' => 60,
                'category_id' => Category::where('slug', 'honey-spices')->first()->id ?? 1,
                'locality' => 'Marrakech',
                'image_url' => 'https://via.placeholder.com/300x300?text=Olive+Oil',
            ],
        ];

        $farmerIndex = 0;
        foreach ($products as $product) {
            $farmer = $farmers[$farmerIndex % count($farmers)];

            Product::create([
                'user_id' => $farmer->id,
                'name' => $product['name'],
                'description' => $product['description'],
                'price' => $product['price'],
                'quantity' => $product['quantity'],
                'category_id' => $product['category_id'],
                'locality' => $product['locality'],
                'image_url' => $product['image_url'],
            ]);

            $farmerIndex++;
        }
    }
}
