<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\WithdrawalController;

// Routes publiques
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);

// Routes protégées
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Profil
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/profile/photo', [ProfileController::class, 'updatePhoto']);
    Route::put('/profile/password', [ProfileController::class, 'updatePassword']);

    // Produits (Agriculteurs)
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);

    // Commandes
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus']);

    // Paiement KiKiaPay
    Route::post('/payments/verify', [PaymentController::class, 'verify']);

    // Retraits (agriculteurs)
    Route::get('/withdrawals', [WithdrawalController::class, 'index']);
    Route::post('/withdrawals', [WithdrawalController::class, 'store']);

    // Dashboards
    Route::get('/dashboard/farmer', [DashboardController::class, 'farmerStats']);
    Route::get('/dashboard/buyer', [DashboardController::class, 'buyerStats']);
    Route::get('/dashboard/admin', [DashboardController::class, 'adminStats'])->middleware('admin');

    // Messagerie
    Route::get('/messages', [MessageController::class, 'index']);
    Route::post('/messages', [MessageController::class, 'store']);
    Route::patch('/messages/{message}/read', [MessageController::class, 'markAsRead']);

    // Admin Categories
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

    // Admin Global
    Route::middleware('admin')->group(function () {
        Route::get('/admin/users', [AdminController::class, 'users']);
        Route::delete('/admin/users/{user}', [AdminController::class, 'deleteUser']);
        Route::get('/admin/products', [AdminController::class, 'products']);
        Route::get('/admin/orders', [AdminController::class, 'orders']);

        // Gestion des retraits
        Route::get('/admin/withdrawals', [WithdrawalController::class, 'adminIndex']);
        Route::patch('/admin/withdrawals/{withdrawal}/approve', [WithdrawalController::class, 'approve']);
        Route::patch('/admin/withdrawals/{withdrawal}/reject', [WithdrawalController::class, 'reject']);
    });
});
