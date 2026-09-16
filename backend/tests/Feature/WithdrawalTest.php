<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Withdrawal;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WithdrawalTest extends TestCase
{
    use RefreshDatabase;

    // ── Création de demande de retrait ────────────────────────────────────────

    public function test_farmer_can_request_withdrawal(): void
    {
        $farmer = User::factory()->farmer()->withBalance(10000)->create();

        $response = $this->actingAs($farmer)->postJson('/api/withdrawals', [
            'amount' => 5000,
            'method' => 'moov',
            'phone'  => '93000000',
        ]);

        $response->assertStatus(201)
                 ->assertJsonFragment([
                     'amount'     => 5000,
                     'fee'        => 250,     // 5 % de 5000
                     'net_amount' => 4750,
                 ]);

        $this->assertDatabaseHas('withdrawals', [
            'user_id' => $farmer->id,
            'amount'  => 5000,
            'status'  => 'pending',
        ]);
    }

    public function test_withdrawal_deducts_farmer_balance_immediately(): void
    {
        $farmer = User::factory()->farmer()->withBalance(10000)->create();

        $this->actingAs($farmer)->postJson('/api/withdrawals', [
            'amount' => 3000,
            'method' => 'yas',
            'phone'  => '93000001',
        ]);

        $this->assertDatabaseHas('users', [
            'id'      => $farmer->id,
            'balance' => 7000, // 10000 - 3000
        ]);
    }

    public function test_withdrawal_calculates_5_percent_fee(): void
    {
        $farmer = User::factory()->farmer()->withBalance(20000)->create();

        $response = $this->actingAs($farmer)->postJson('/api/withdrawals', [
            'amount' => 10000,
            'method' => 'moov',
            'phone'  => '93000002',
        ]);

        $response->assertStatus(201)
                 ->assertJsonFragment([
                     'fee'        => 500,    // 5 % de 10 000
                     'net_amount' => 9500,
                 ]);
    }

    public function test_withdrawal_fails_when_balance_is_insufficient(): void
    {
        $farmer = User::factory()->farmer()->withBalance(1000)->create();

        $response = $this->actingAs($farmer)->postJson('/api/withdrawals', [
            'amount' => 5000,
            'method' => 'moov',
            'phone'  => '93000003',
        ]);

        $response->assertStatus(422)
                 ->assertJsonFragment(['message' => 'Solde insuffisant.']);

        // Le solde ne doit pas avoir changé
        $this->assertDatabaseHas('users', ['id' => $farmer->id, 'balance' => 1000]);
    }

    public function test_buyer_cannot_request_withdrawal(): void
    {
        $buyer = User::factory()->withBalance(50000)->create(['role' => 'acheteur']);

        $response = $this->actingAs($buyer)->postJson('/api/withdrawals', [
            'amount' => 5000,
            'method' => 'moov',
            'phone'  => '93000004',
        ]);

        $response->assertStatus(403)
                 ->assertJsonFragment(['message' => 'Réservé aux agriculteurs.']);
    }

    public function test_withdrawal_minimum_amount_is_500(): void
    {
        $farmer = User::factory()->farmer()->withBalance(10000)->create();

        $response = $this->actingAs($farmer)->postJson('/api/withdrawals', [
            'amount' => 400, // inférieur à 500
            'method' => 'moov',
            'phone'  => '93000005',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['amount']);
    }

    public function test_farmer_can_list_their_withdrawals(): void
    {
        $farmer = User::factory()->farmer()->create();
        Withdrawal::factory()->count(3)->create(['user_id' => $farmer->id]);

        $otherFarmer = User::factory()->farmer()->create();
        Withdrawal::factory()->count(2)->create(['user_id' => $otherFarmer->id]);

        $response = $this->actingAs($farmer)->getJson('/api/withdrawals');

        $response->assertStatus(200);
        $this->assertCount(3, $response->json());
    }

    // ── Approbation / Rejet par l'admin ───────────────────────────────────────

    public function test_admin_can_approve_withdrawal(): void
    {
        $admin      = User::factory()->admin()->create();
        $withdrawal = Withdrawal::factory()->create(['status' => 'pending']);

        $response = $this->actingAs($admin)
            ->patchJson("/api/admin/withdrawals/{$withdrawal->id}/approve", [
                'note' => 'Virement effectué',
            ]);

        $response->assertStatus(200)
                 ->assertJsonFragment(['message' => 'Retrait approuvé.']);

        $this->assertDatabaseHas('withdrawals', [
            'id'         => $withdrawal->id,
            'status'     => 'approved',
            'admin_note' => 'Virement effectué',
        ]);
    }

    public function test_admin_can_reject_withdrawal_and_refund_balance(): void
    {
        $admin  = User::factory()->admin()->create();
        $farmer = User::factory()->farmer()->withBalance(5000)->create();

        // Le retrait de 3000 a déjà déduit le solde → solde actuel = 5000
        // (la factory crée directement le retrait sans déduire le solde)
        $withdrawal = Withdrawal::factory()->create([
            'user_id' => $farmer->id,
            'amount'  => 3000,
            'status'  => 'pending',
        ]);

        $response = $this->actingAs($admin)
            ->patchJson("/api/admin/withdrawals/{$withdrawal->id}/reject", [
                'note' => 'Informations incorrectes',
            ]);

        $response->assertStatus(200)
                 ->assertJsonFragment(['message' => 'Retrait rejeté et solde remboursé.']);

        $this->assertDatabaseHas('withdrawals', ['id' => $withdrawal->id, 'status' => 'rejected']);

        // Le solde doit avoir été remboursé de 3000
        $this->assertDatabaseHas('users', [
            'id'      => $farmer->id,
            'balance' => 8000, // 5000 + 3000 remboursé
        ]);
    }

    public function test_cannot_approve_already_processed_withdrawal(): void
    {
        $admin      = User::factory()->admin()->create();
        $withdrawal = Withdrawal::factory()->approved()->create();

        $response = $this->actingAs($admin)
            ->patchJson("/api/admin/withdrawals/{$withdrawal->id}/approve");

        $response->assertStatus(400)
                 ->assertJsonFragment(['message' => 'Ce retrait est déjà traité.']);
    }

    public function test_non_admin_cannot_approve_withdrawal(): void
    {
        $farmer     = User::factory()->farmer()->create();
        $withdrawal = Withdrawal::factory()->create(['status' => 'pending']);

        $response = $this->actingAs($farmer)
            ->patchJson("/api/admin/withdrawals/{$withdrawal->id}/approve");

        $response->assertStatus(403);
    }
}
