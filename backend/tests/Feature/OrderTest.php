<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    // ── Création de commande ──────────────────────────────────────────────────

    public function test_buyer_can_create_order(): void
    {
        $buyer   = User::factory()->create(['role' => 'acheteur']);
        $product = Product::factory()->create(['price' => 2000, 'quantity' => 50]);

        $response = $this->actingAs($buyer)->postJson('/api/orders', [
            'delivery_address' => 'Quartier centre, Kara',
            'items' => [
                ['product_id' => $product->id, 'quantity' => 3],
            ],
        ]);

        $response->assertStatus(201)
                 ->assertJsonFragment(['total_amount' => 6000]);

        $this->assertDatabaseHas('orders', [
            'user_id'      => $buyer->id,
            'total_amount' => 6000,
            'status'       => 'en attente',
        ]);
    }

    public function test_create_order_deducts_product_stock(): void
    {
        $buyer   = User::factory()->create(['role' => 'acheteur']);
        $product = Product::factory()->create(['price' => 1000, 'quantity' => 20]);

        $this->actingAs($buyer)->postJson('/api/orders', [
            'delivery_address' => 'Adresse test',
            'items' => [
                ['product_id' => $product->id, 'quantity' => 5],
            ],
        ]);

        $this->assertDatabaseHas('products', [
            'id'       => $product->id,
            'quantity' => 15, // 20 - 5
        ]);
    }

    public function test_create_order_fails_when_stock_is_insufficient(): void
    {
        $buyer   = User::factory()->create(['role' => 'acheteur']);
        $product = Product::factory()->create(['price' => 1000, 'quantity' => 2]);

        $response = $this->actingAs($buyer)->postJson('/api/orders', [
            'delivery_address' => 'Adresse test',
            'items' => [
                ['product_id' => $product->id, 'quantity' => 10],
            ],
        ]);

        $response->assertStatus(400)
                 ->assertJsonFragment(['message' => "Stock insuffisant pour le produit {$product->name}"]);
    }

    public function test_unauthenticated_user_cannot_create_order(): void
    {
        $product = Product::factory()->create(['quantity' => 10]);

        $response = $this->postJson('/api/orders', [
            'delivery_address' => 'Adresse test',
            'items' => [['product_id' => $product->id, 'quantity' => 1]],
        ]);

        $response->assertStatus(401);
    }

    // ── Consultation des commandes ────────────────────────────────────────────

    public function test_buyer_sees_only_their_own_orders(): void
    {
        $buyer1 = User::factory()->create(['role' => 'acheteur']);
        $buyer2 = User::factory()->create(['role' => 'acheteur']);

        Order::factory()->create(['user_id' => $buyer1->id]);
        Order::factory()->create(['user_id' => $buyer1->id]);
        Order::factory()->create(['user_id' => $buyer2->id]);

        $response = $this->actingAs($buyer1)->getJson('/api/orders');

        $response->assertStatus(200);
        $orders = $response->json();
        $this->assertCount(2, $orders);
    }

    public function test_farmer_sees_orders_containing_their_products(): void
    {
        $farmer = User::factory()->farmer()->create();
        $buyer  = User::factory()->create(['role' => 'acheteur']);
        $product = Product::factory()->create(['user_id' => $farmer->id, 'price' => 1000, 'quantity' => 50]);

        // Créer une commande contenant le produit de l'agriculteur
        $this->actingAs($buyer)->postJson('/api/orders', [
            'delivery_address' => 'Adresse test',
            'items' => [['product_id' => $product->id, 'quantity' => 2]],
        ]);

        $response = $this->actingAs($farmer)->getJson('/api/orders');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json());
    }

    // ── Mise à jour du statut ─────────────────────────────────────────────────

    public function test_farmer_can_update_order_status(): void
    {
        $farmer = User::factory()->farmer()->create();
        $order  = Order::factory()->create(['status' => 'en attente']);

        $response = $this->actingAs($farmer)->patchJson("/api/orders/{$order->id}/status", [
            'status' => 'en transit',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('orders', ['id' => $order->id, 'status' => 'en transit']);
    }

    public function test_buyer_cannot_update_order_status(): void
    {
        $buyer = User::factory()->create(['role' => 'acheteur']);
        $order = Order::factory()->create(['user_id' => $buyer->id]);

        $response = $this->actingAs($buyer)->patchJson("/api/orders/{$order->id}/status", [
            'status' => 'livrée',
        ]);

        $response->assertStatus(403);
    }
}
