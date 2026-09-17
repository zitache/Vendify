<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ProductionSeeder extends Seeder
{
    public function run(): void
    {
        // ── Catégories ────────────────────────────────────────────────────────
        $categories = [
            ['name' => 'Céréales',           'description' => 'Maïs, sorgho, mil, riz et autres céréales'],
            ['name' => 'Tubercules',          'description' => 'Igname, manioc, patate douce, taro'],
            ['name' => 'Légumineuses',        'description' => 'Arachides, haricots, soja, niébé'],
            ['name' => 'Légumes',             'description' => 'Tomates, oignons, piments, gombo et autres légumes frais'],
            ['name' => 'Fruits',              'description' => 'Mangues, oranges, papayes, bananes et autres fruits'],
            ['name' => 'Épices & Condiments', 'description' => 'Gingembre, ail, poivre, soumbala et autres épices'],
            ['name' => 'Produits laitiers',   'description' => 'Lait frais, fromage wagasi, beurre de karité'],
            ['name' => 'Viande & Poisson',    'description' => 'Viande de brousse, volaille, poisson frais ou fumé'],
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate(
                ['slug' => Str::slug($cat['name'])],
                ['name' => $cat['name'], 'description' => $cat['description']]
            );
        }

        $this->command->info('✅ Catégories insérées.');

        // ── Compte Admin ──────────────────────────────────────────────────────
        User::firstOrCreate(
            ['email' => 'admin@vendify.tg'],
            [
                'name'     => 'Administrateur Vendify',
                'password' => Hash::make('Admin@2026'),
                'phone'    => '90000000',
                'locality' => 'Lomé',
                'role'     => 'admin',
            ]
        );

        $this->command->info('✅ Compte admin créé : admin@vendify.tg / Admin@2026');

        // ── Compte Agriculteur démo ───────────────────────────────────────────
        User::firstOrCreate(
            ['email' => 'agriculteur@vendify.tg'],
            [
                'name'     => 'Koffi Agbessi',
                'password' => Hash::make('Agri@2026'),
                'phone'    => '91000000',
                'locality' => 'Kara',
                'role'     => 'agriculteur',
                'balance'  => 0,
            ]
        );

        $this->command->info('✅ Compte agriculteur créé : agriculteur@vendify.tg / Agri@2026');

        // ── Compte Acheteur démo ─────────────────────────────────────────────
        User::firstOrCreate(
            ['email' => 'acheteur@vendify.tg'],
            [
                'name'     => 'Ama Sedzro',
                'password' => Hash::make('Achet@2026'),
                'phone'    => '92000000',
                'locality' => 'Lomé',
                'role'     => 'acheteur',
            ]
        );

        $this->command->info('✅ Compte acheteur créé : acheteur@vendify.tg / Achet@2026');
    }
}
