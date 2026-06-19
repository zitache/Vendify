import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu, Bell } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

const pageTitles = {
    '/dashboard':             'Tableau de bord',
    '/profile':               'Mon profil',
    '/messages':              'Messages',
    '/farmer/products':       'Mes produits',
    '/farmer/products/new':   'Nouveau produit',
    '/farmer/withdrawals':    'Solde & Retraits',
    '/admin/users':           'Gestion des utilisateurs',
    '/admin/withdrawals':     'Gestion des retraits',
};

const DashboardLayout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user } = useAuth();
    const location = useLocation();

    // Titre dynamique : cherche la correspondance la plus longue d'abord
    const title = Object.keys(pageTitles)
        .filter(k => location.pathname === k || location.pathname.startsWith(k + '/'))
        .sort((a, b) => b.length - a.length)[0];

    const pageTitle = pageTitles[title] || 'Tableau de bord';

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

            {/* Zone principale (décalée à droite sur desktop) */}
            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                {/* Barre du haut (mobile + desktop) */}
                <header className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
                    <div className="flex items-center justify-between px-4 sm:px-6 h-16">
                        <div className="flex items-center gap-4">
                            {/* Hamburger mobile */}
                            <button
                                onClick={() => setMobileOpen(true)}
                                className="lg:hidden p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="font-black text-gray-900 text-lg leading-tight">{pageTitle}</h1>
                                <p className="text-xs text-gray-400 font-medium hidden sm:block">
                                    Bienvenue, {user?.name}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                                <Bell className="w-5 h-5" />
                            </button>
                            <div className="w-9 h-9 rounded-full bg-agri-green/10 flex items-center justify-center overflow-hidden border-2 border-gray-100 shadow-sm">
                                {user?.photo
                                    ? <img src={user.photo} alt="" className="w-full h-full object-cover" />
                                    : <span className="text-sm font-black text-agri-green">{user?.name?.charAt(0)}</span>
                                }
                            </div>
                        </div>
                    </div>
                </header>

                {/* Contenu de la page */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
