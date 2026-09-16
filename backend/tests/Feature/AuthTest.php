<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    // ── Inscription ───────────────────────────────────────────────────────────

    public function test_user_can_register(): void
    {
        $response = $this->postJson('/api/register', [
            'name'                  => 'Koffi Agbessi',
            'email'                 => 'koffi@example.com',
            'phone'                 => '93000000',
            'locality'              => 'Kara',
            'password'              => 'Secret123!',
            'password_confirmation' => 'Secret123!',
            'role'                  => 'acheteur',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['access_token', 'token_type', 'user']);

        $this->assertDatabaseHas('users', ['email' => 'koffi@example.com']);
    }

    public function test_register_requires_unique_email(): void
    {
        User::factory()->create(['email' => 'duplicate@example.com']);

        $response = $this->postJson('/api/register', [
            'name'                  => 'Autre',
            'email'                 => 'duplicate@example.com',
            'phone'                 => '93000001',
            'locality'              => 'Lomé',
            'password'              => 'Secret123!',
            'password_confirmation' => 'Secret123!',
            'role'                  => 'acheteur',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email']);
    }

    public function test_register_validates_role(): void
    {
        $response = $this->postJson('/api/register', [
            'name'                  => 'Test',
            'email'                 => 'test@example.com',
            'phone'                 => '93000002',
            'locality'              => 'Lomé',
            'password'              => 'Secret123!',
            'password_confirmation' => 'Secret123!',
            'role'                  => 'admin', // rôle non autorisé
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['role']);
    }

    // ── Connexion ─────────────────────────────────────────────────────────────

    public function test_user_can_login(): void
    {
        $user = User::factory()->create(['password' => bcrypt('Secret123!')]);

        $response = $this->postJson('/api/login', [
            'email'    => $user->email,
            'password' => 'Secret123!',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['access_token', 'token_type', 'user']);
    }

    public function test_login_fails_with_wrong_password(): void
    {
        $user = User::factory()->create(['password' => bcrypt('CorrectPass1!')]);

        $response = $this->postJson('/api/login', [
            'email'    => $user->email,
            'password' => 'WrongPass999!',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email']);
    }

    public function test_login_fails_with_unknown_email(): void
    {
        $response = $this->postJson('/api/login', [
            'email'    => 'nobody@example.com',
            'password' => 'anything',
        ]);

        $response->assertStatus(422);
    }

    // ── Déconnexion ───────────────────────────────────────────────────────────

    public function test_authenticated_user_can_logout(): void
    {
        $user  = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeaders(['Authorization' => "Bearer {$token}"])
                         ->postJson('/api/logout');

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Déconnecté avec succès']);
    }

    public function test_unauthenticated_user_cannot_access_me(): void
    {
        $response = $this->getJson('/api/me');

        $response->assertStatus(401);
    }

    public function test_authenticated_user_can_access_me(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->getJson('/api/me');

        $response->assertStatus(200)
                 ->assertJsonFragment(['email' => $user->email]);
    }
}
