import { Outlet, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import DashboardLayout from './components/layout/DashboardLayout';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';

import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import MyProducts from './pages/farmer/MyProducts';
import ProductForm from './components/products/ProductForm';
import Withdrawals from './pages/farmer/Withdrawals';
import AdminUsers from './pages/admin/Users';
import AdminWithdrawals from './pages/admin/Withdrawals';

// Layout pages publiques (avec Navbar)
const PublicLayout = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
            <Outlet />
        </main>
    </div>
);

function App() {
    return (
        <Routes>
            {/* Page de succès paiement — standalone, sans spinner auth */}
            <Route path="/payment-success" element={<PaymentSuccess />} />

            {/* Pages publiques — avec Navbar */}
            <Route element={<PublicLayout />}>
                <Route path="/"          element={<Home />} />
                <Route path="/login"     element={<Login />} />
                <Route path="/register"  element={<Register />} />
                <Route path="/catalog"   element={<Catalog />} />
                <Route path="/cart"      element={<Cart />} />
                <Route path="/checkout"  element={<Checkout />} />
            </Route>

            {/* Pages dashboard — avec Sidebar */}
            <Route element={<DashboardLayout />}>
                <Route path="/dashboard"                    element={<Dashboard />} />
                <Route path="/profile"                      element={<Profile />} />
                <Route path="/messages"                     element={<Messages />} />
                <Route path="/farmer/products"              element={<MyProducts />} />
                <Route path="/farmer/products/new"          element={<ProductForm />} />
                <Route path="/farmer/products/:id/edit"     element={<ProductForm />} />
                <Route path="/farmer/withdrawals"           element={<Withdrawals />} />
                <Route path="/admin/users"                  element={<AdminUsers />} />
                <Route path="/admin/withdrawals"            element={<AdminWithdrawals />} />
            </Route>
        </Routes>
    );
}

export default App;
