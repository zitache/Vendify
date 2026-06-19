<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Admin User',
                'email' => 'admin@agrikara.com',
                'password' => 'password123',
                'phone' => '+212 6 12 34 56 78',
                'locality' => 'Casablanca',
                'role' => 'admin',
                'photo' => null,
            ],
            [
                'name' => 'Ahmed Farmer',
                'email' => 'ahmed@agrikara.com',
                'password' => 'password123',
                'phone' => '+212 6 87 65 43 21',
                'locality' => 'Fes',
                'role' => 'agriculteur',
                'photo' => null,
            ],
            [
                'name' => 'Fatima merchant',
                'email' => 'fatima@agrikara.com',
                'password' => 'password123',
                'phone' => '+212 6 11 22 33 44',
                'locality' => 'Marrakech',
                'role' => 'agriculteur',
                'photo' => null,
            ],
            [
                'name' => 'Hassan Buyer',
                'email' => 'hassan@agrikara.com',
                'password' => 'password123',
                'phone' => '+212 6 55 66 77 88',
                'locality' => 'Rabat',
                'role' => 'acheteur',
                'photo' => null,
            ],
            [
                'name' => 'Layla Customer',
                'email' => 'layla@agrikara.com',
                'password' => 'password123',
                'phone' => '+212 6 99 88 77 66',
                'locality' => 'Tangier',
                'role' => 'acheteur',
                'photo' => null,
            ],
        ];

        foreach ($users as $user) {
            User::create([
                'name' => $user['name'],
                'email' => $user['email'],
                'password' => Hash::make($user['password']),
                'phone' => $user['phone'],
                'locality' => $user['locality'],
                'role' => $user['role'],
                'photo' => $user['photo'],
            ]);
        }
    }
}
