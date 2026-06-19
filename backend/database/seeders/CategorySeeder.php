<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Fruits', 'description' => 'Fresh and delicious fruits'],
            ['name' => 'Vegetables', 'description' => 'Organic vegetables'],
            ['name' => 'Grains', 'description' => 'Quality grains and cereals'],
            ['name' => 'Dairy', 'description' => 'Fresh dairy products'],
            ['name' => 'Meat & Fish', 'description' => 'Quality meat and fish'],
            ['name' => 'Honey & Spices', 'description' => 'Natural honey and spices'],
        ];

        foreach ($categories as $category) {
            Category::create([
                'name' => $category['name'],
                'slug' => Str::slug($category['name']),
                'description' => $category['description']
            ]);
        }
    }
}
