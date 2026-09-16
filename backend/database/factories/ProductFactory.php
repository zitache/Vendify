<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        return [
            'user_id'     => User::factory()->farmer(),
            'name'        => fake()->words(3, true),
            'description' => fake()->sentence(),
            'price'       => fake()->randomFloat(2, 500, 50000),
            'quantity'    => fake()->numberBetween(10, 200),
            'locality'    => fake()->city(),
            'category_id' => null,
            'image_url'   => null,
        ];
    }
}
