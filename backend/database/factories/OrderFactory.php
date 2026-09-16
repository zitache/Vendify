<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        return [
            'user_id'          => User::factory(),
            'status'           => 'en attente',
            'total_amount'     => fake()->randomFloat(2, 1000, 100000),
            'delivery_address' => fake()->address(),
        ];
    }

    public function confirmed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status'            => 'confirmée',
            'payment_reference' => 'sandbox_' . fake()->uuid(),
        ]);
    }
}
