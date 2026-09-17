<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function farmerStats(Request $request)
    {
        $userId = $request->user()->id;

        // Récupère les IDs produits et commandes une seule fois
        $productIds = Product::where('user_id', $userId)->pluck('id');
        $productsCount = $productIds->count();

        $orderIds = DB::table('order_items')
            ->whereIn('product_id', $productIds)
            ->distinct()
            ->pluck('order_id');

        $ordersCount = Order::whereIn('id', $orderIds)->count();
        $revenue = Order::whereIn('id', $orderIds)
            ->where('status', 'confirmée')
            ->sum('total_amount');

        $latestOrders = Order::whereIn('id', $orderIds)
            ->with(['user:id,name', 'items:id,order_id,product_id,quantity,unit_price'])
            ->latest()
            ->limit(5)
            ->get();

        return response()->json([
            'products_count' => $productsCount,
            'orders_count'   => $ordersCount,
            'revenue'        => $revenue,
            'balance'        => (float) $request->user()->balance,
            'latest_orders'  => $latestOrders,
        ]);
    }

    public function buyerStats(Request $request)
    {
        $userId = $request->user()->id;

        $ordersCount = Order::where('user_id', $userId)->count();
        $totalSpent = Order::where('user_id', $userId)
            ->where('status', 'confirmée')
            ->sum('total_amount');

        $latestOrders = Order::where('user_id', $userId)
            ->with(['items:id,order_id,product_id,quantity,unit_price'])
            ->latest()
            ->limit(5)
            ->get();

        return response()->json([
            'orders_count' => $ordersCount,
            'total_spent' => $totalSpent,
            'latest_orders' => $latestOrders,
        ]);
    }

    public function adminStats()
    {
        $usersCount    = User::count();
        $productsCount = Product::count();
        $ordersCount   = Order::count();
        $totalRevenue  = Order::where('status', 'confirmée')->sum('total_amount');

        $isPgsql = DB::getDriverName() === 'pgsql';

        // Format SQL selon le driver
        $monthFormat    = $isPgsql ? "TO_CHAR(created_at, 'Mon YYYY')" : "DATE_FORMAT(created_at, '%b %Y')";
        $sortKeyFormat  = $isPgsql ? "TO_CHAR(created_at, 'YYYYMM')"  : "DATE_FORMAT(created_at, '%Y%m')";

        // Ventes et commandes par mois (12 derniers mois)
        $salesByMonth = Order::select(
            DB::raw("{$monthFormat} as month"),
            DB::raw("{$sortKeyFormat} as sort_key"),
            DB::raw('SUM(total_amount) as revenue'),
            DB::raw('COUNT(*) as orders')
        )
        ->where('created_at', '>=', now()->subMonths(12))
        ->groupBy(DB::raw($monthFormat), DB::raw($sortKeyFormat))
        ->orderBy(DB::raw($sortKeyFormat))
        ->get()
        ->map(fn($r) => [
            'month'   => $r->month,
            'revenue' => (float) $r->revenue,
            'orders'  => (int) $r->orders,
        ]);

        // Répartition des utilisateurs par rôle
        $usersByRole = User::select('role', DB::raw('count(*) as total'))
            ->groupBy('role')
            ->get()
            ->map(fn($r) => [
                'name'  => match($r->role) {
                    'agriculteur' => 'Agriculteurs',
                    'acheteur'    => 'Acheteurs',
                    'admin'       => 'Admins',
                    default       => ucfirst($r->role),
                },
                'value' => (int) $r->total,
            ]);

        // Répartition des commandes par statut
        $ordersByStatus = Order::select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->get()
            ->map(fn($r) => [
                'name'  => ucfirst($r->status),
                'value' => (int) $r->total,
            ]);

        // Top 5 produits par chiffre d'affaires
        $topProducts = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->select(
                'products.name',
                DB::raw('SUM(order_items.quantity * order_items.unit_price) as revenue'),
                DB::raw('SUM(order_items.quantity) as qty')
            )
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('revenue')
            ->limit(5)
            ->get()
            ->map(fn($r) => [
                'name'    => $r->name,
                'revenue' => (float) $r->revenue,
                'qty'     => (int) $r->qty,
            ]);

        // Nouveaux utilisateurs par mois (6 derniers mois)
        $newUsersByMonth = User::select(
            DB::raw("{$monthFormat} as month"),
            DB::raw("{$sortKeyFormat} as sort_key"),
            DB::raw('count(*) as total')
        )
        ->where('created_at', '>=', now()->subMonths(6))
        ->groupBy(DB::raw($monthFormat), DB::raw($sortKeyFormat))
        ->orderBy(DB::raw($sortKeyFormat))
        ->get()
        ->map(fn($r) => ['month' => $r->month, 'users' => (int) $r->total]);

        // Retraits en attente
        $pendingWithdrawals = DB::table('withdrawals')
            ->where('status', 'pending')
            ->count();

        return response()->json([
            'users_count'         => $usersCount,
            'products_count'      => $productsCount,
            'orders_count'        => $ordersCount,
            'total_revenue'       => (float) $totalRevenue,
            'pending_withdrawals' => $pendingWithdrawals,
            'sales_by_month'      => $salesByMonth,
            'users_by_role'       => $usersByRole,
            'orders_by_status'    => $ordersByStatus,
            'top_products'        => $topProducts,
            'new_users_by_month'  => $newUsersByMonth,
        ]);
    }
}
