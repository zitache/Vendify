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
            ['name' => 'Céréales',           'description' => 'Maïs, sorgho, mil, riz et autres céréales'],
            ['name' => 'Tubercules',          'description' => 'Igname, manioc, patate douce, taro'],
            ['name' => 'Légumineuses',        'description' => 'Arachides, haricots, soja, niébé'],
            ['name' => 'Légumes',             'description' => 'Tomates, oignons, piments, gombo et autres légumes frais'],
            ['name' => 'Fruits',              'description' => 'Mangues, oranges, papayes, bananes et autres fruits'],
            ['name' => 'Épices & Condiments', 'description' => 'Gingembre, ail, poivre, soumbala et autres épices'],
            ['name' => 'Produits laitiers',   'description' => 'Lait frais, fromage wagasi, beurre de karité'],
            ['name' => 'Viande & Poisson',    'description' => 'Viande de brousse, volaille, poisson frais ou fumé'],
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
