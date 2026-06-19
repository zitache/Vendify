<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function users()
    {
        return response()->json(User::latest()->get());
    }

    public function deleteUser(User $user)
    {
        if ($user->role === 'admin') {
            return response()->json(['message' => 'Impossible de supprimer un administrateur'], 403);
        }
        $user->delete();
        return response()->json(['message' => 'Utilisateur supprimé avec succès']);
    }

    public function products()
    {
        return response()->json(Product::with(['user', 'category'])->latest()->get());
    }

    public function orders()
    {
        return response()->json(Order::with(['user', 'items.product'])->latest()->get());
    }
}
