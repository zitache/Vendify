import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Leaf, LayoutDashboard, Package, Plus, Wallet,
    MessageSquare, User, ShoppingBag, ShoppingCart,
    Users, LogOut, Menu, X, ChevronRight, Shield
} from 'lucide-react';

const farmerLinks = [
    { to: '/dashboard',            icon: LayoutDashboard, label: 'Tableau de bord' },
    { to: '/farmer/products',      icon: Package,         label: 'Mes produits' },
    { to: '/farmer/products/new',  icon: Plus,            label: 'Ajouter un produit' },
    { to: '/farmer/withdrawals',   icon: Wallet,          label: 'Mon solde & retraits' },
    { to: '/messages',             icon: MessageSquare,   label: 'Messages' },
    { to: '/profile',              icon: User,            label: 'Mon profil' },
];

const buyerLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Mon espace' },
    { to: '/catalog',   icon: ShoppingBag,     label: 'Catalogue' },
    { to: '/cart',      icon: ShoppingCart,    label: 'Mon panier' },
    { to: '/messages',  icon: MessageSquare,   label: 'Messages' },
    { to: '/profile',   icon: User,            label: 'Mon profil' },
];

const adminLinks = [
    { to: '/dashboard',          icon: LayoutDashboard, label: 'Tableau de bord' },
    { to: '/admin/users',        icon: Users,           label: 'Utilisateurs' },
    { to: '/admin/withdrawals',  icon: Wallet,          label: 'Retraits agriculteurs' },
    { to: '/messages',           icon: MessageSquare,   label: 'Messages' },
    { to: '/profile',            icon: User,            label: 'Mon profil' },
];

const roleLabels = {
    agriculteur: 'Producteur Agricole',
    acheteur: 'Acheteur',
    admin: 'Administrateur',
};

// ─── Contenu interne de la sidebar ──────────────────────────────────────────
const SidebarContent = ({ onClose }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const links = user?.role === 'agriculteur' ? farmerLinks
                : user?.role === 'admin'       ? adminLinks
                : buyerLinks;

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const isActive = (to) => {
        if (to === '/dashboard') return location.pathname === '/dashboard';
        return location.pathname.startsWith(to);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <Link to="/" className="flex items-center gap-3" onClick={onClose}>
                    <div className="bg-agri-green/10 p-2 rounded-xl">
                        <Leaf className="h-6 w-6 text-agri-green" />
                    </div>
                    <span className="font-extrabold text-xl text-gray-900 tracking-tighter">Vendify</span>
                </Link>
                {/* Bouton fermer sur mobile */}
                {onClose && (
                    <button onClick={onClose} className="lg:hidden p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Rôle badge */}
            <div className="px-6 py-4">
                <div className="flex items-center gap-2 bg-agri-green/8 rounded-xl px-3 py-2">
                    {user?.role === 'admin'
                        ? <Shield className="w-4 h-4 text-agri-green flex-shrink-0" />
                        : <div className="w-4 h-4 rounded-full bg-agri-green flex-shrink-0" />
                    }
                    <span className="text-xs font-black text-agri-green uppercase tracking-widest">
                        {roleLabels[user?.role] || 'Utilisateur'}
                    </span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 pb-4 space-y-1 overflow-y-auto">
                {links.map(({ to, icon: Icon, label }) => (
                    <Link
                        key={to}
                        to={to}
                        onClick={onClose}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all group ${
                            isActive(to)
                                ? 'bg-agri-green text-white shadow-lg shadow-agri-green/25'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                        <Icon className={`w-5 h-5 flex-shrink-0 ${isActive(to) ? 'text-white' : 'text-gray-400 group-hover:text-agri-green'}`} />
                        <span className="flex-1">{label}</span>
                        {isActive(to) && <ChevronRight className="w-4 h-4 opacity-60" />}
                    </Link>
                ))}
            </nav>

            {/* Séparateur */}
            <div className="mx-6 border-t border-gray-100" />

            {/* Profil utilisateur */}
            <div className="p-4">
                <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-agri-green/10 flex items-center justify-center overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
                        {user?.photo
                            ? <img src={user.photo} alt="" className="w-full h-full object-cover" />
                            : <User className="w-5 h-5 text-agri-green" />
                        }
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-400 font-medium truncate">{user?.email}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        title="Se déconnecter"
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Sidebar principale ──────────────────────────────────────────────────────
const Sidebar = ({ mobileOpen, onClose }) => (
    <>
        {/* Desktop : fixe */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 fixed left-0 top-0 h-full z-30 shadow-xl shadow-gray-100/50">
            <SidebarContent />
        </aside>

        {/* Mobile : overlay */}
        {mobileOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
                <aside className="relative flex flex-col w-72 bg-white h-full shadow-2xl z-10">
                    <SidebarContent onClose={onClose} />
                </aside>
            </div>
        )}
    </>
);

export { Sidebar };
export default Sidebar;
