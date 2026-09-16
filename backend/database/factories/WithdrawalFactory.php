<?php

namespace Database\Factories;

use App\Models\Withdrawal;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Withdrawal>
 */
class WithdrawalFactory extends Factory
{
    protected $model = Withdrawal::class;

    public function definition(): array
    {
        $amount = fake()->randomFloat(2, 500, 20000);
        $fee    = round($amount * 0.05, 2);

        return [
            'user_id'    => User::factory()->farmer(),
            'amount'     => $amount,
            'fee'        => $fee,
            'net_amount' => round($amount - $fee, 2),
            'method'     => fake()->randomElement(['moov', 'yas']),
            'phone'      => fake()->numerify('9########'),
            'status'     => 'pending',
        ];
    }

    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status'       => 'approved',
            'processed_at' => now(),
        ]);
    }
}
