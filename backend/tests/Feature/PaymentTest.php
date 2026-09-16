<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentTest extends TestCase
{
    use RefreshDatabase;

    private function createOrderWithFarmer(): array
    {
        $farmer  = User::factory()->farmer()->withBalance(0)->create();
        $buyer   = User::factory()->create(['role' => 'acheteur']);
        $product = Product::factory()->create([
            'user_id'  => $farmer->id,
            'price'    => 5000,
            'quantity' => 10,
        ]);

        $order = Order::factory()->create([
            'user_id'      => $buyer->id,
            'status'       => 'en attente',
            'total_amount' => 10000,
        ]);

        OrderItem::create([
            'order_id'   => $order->id,
            'product_id' => $product->id,
            'quantity'   => 2,
            'unit_price' => 5000,
        ]);

        return compact('farmer', 'buyer', 'order');
    }

    // ── Mode sandbox ──────────────────────────────────────────────────────────

    public function test_payment_verify_confirms_order_in_sandbox_mode(): void
    {
        // phpunit.xml ne définit pas kkiapay.sandbox ; on force sandbox=true
        config(['services.kkiapay.sandbox' => true]);

        ['buyer' => $buyer, 'order' => $order] = $this->createOrderWithFarmer();

        $response = $this->actingAs($buyer)->postJson('/api/payments/verify', [
            'order_id'       => $order->id,
            'transaction_id' => 'sandbox_test_001',
        ]);

        $response->assertStatus(200)
                 ->assertJsonFragment(['message' => 'Paiement vérifié. Commande confirmée avec succès.']);

        $this->assertDatabaseHas('orders', [
            'id'                => $order->id,
            'status'            => 'confirmée',
            'payment_reference' => 'sandbox_test_001',
        ]);
    }

    public function test_payment_verify_credits_farmer_balance(): void
    {
        config(['services.kkiapay.sandbox' => true]);

        ['farmer' => $farmer, 'buyer' => $buyer, 'order' => $order] = $this->createOrderWithFarmer();

        $this->actingAs($buyer)->postJson('/api/payments/verify', [
            'order_id'       => $order->id,
            'transaction_id' => 'sandbox_balance_test',
        ]);

        // L'agriculteur doit avoir reçu 2 × 5000 = 10 000 FCFA
        $this->assertDatabaseHas('users', [
            'id'      => $farmer->id,
            'balance' => 10000,
        ]);
    }

    public function test_payment_verify_is_idempotent_for_confirmed_order(): void
    {
        config(['services.kkiapay.sandbox' => true]);

        ['buyer' => $buyer, 'order' => $order] = $this->createOrderWithFarmer();

        $order->update(['status' => 'confirmée']);

        $response = $this->actingAs($buyer)->postJson('/api/payments/verify', [
            'order_id'       => $order->id,
            'transaction_id' => 'sandbox_duplicate',
        ]);

        // Ne doit pas crasher ni recréditer le solde
        $response->assertStatus(200)
                 ->assertJsonFragment(['message' => 'Commande déjà confirmée.']);
    }

    public function test_payment_verify_requires_authentication(): void
    {
        $order = Order::factory()->create();

        $response = $this->postJson('/api/payments/verify', [
            'order_id'       => $order->id,
            'transaction_id' => 'sandbox_xyz',
        ]);

        $response->assertStatus(401);
    }

    public function test_payment_verify_requires_valid_order_id(): void
    {
        config(['services.kkiapay.sandbox' => true]);

        $buyer = User::factory()->create(['role' => 'acheteur']);

        $response = $this->actingAs($buyer)->postJson('/api/payments/verify', [
            'order_id'       => 99999, // n'existe pas
            'transaction_id' => 'sandbox_xyz',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['order_id']);
    }
}
