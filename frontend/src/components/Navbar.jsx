import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, ShoppingCart, User, LogOut, LayoutDashboard, MessageSquare } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-3">
                            <div className="bg-agri-green/10 p-2 rounded-xl">
                                <Leaf className="h-7 w-7 text-agri-green" />
                            </div>
                            <span className="font-extrabold text-2xl text-gray-900 tracking-tighter">Vendify</span>
                        </Link>
                        <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
                            <Link to="/" className="inline-flex items-center px-1 pt-1 text-sm font-bold text-gray-700 hover:text-agri-green transition-colors">Accueil</Link>
                            <Link to="/catalog" className="inline-flex items-center px-1 pt-1 text-sm font-bold text-gray-500 hover:text-agri-green transition-colors">Catalogue</Link>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 md:gap-6">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link to="/messages" className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-all">
                                    <MessageSquare className="h-5 w-5" />
                                </Link>
                                {user.role !== 'admin' && (
                                    <Link to="/cart" className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-all relative">
                                        <ShoppingCart className="h-5 w-5" />
                                        <span className="absolute top-1 right-1 w-2 h-2 bg-agri-red rounded-full"></span>
                                    </Link>
                                )}
                                
                                <div className="h-8 w-px bg-gray-200 mx-2 hidden md:block"></div>
                                
                                <div className="flex items-center gap-3">
                                    <Link to="/profile" className="flex items-center gap-2 group">
                                        <div className="w-9 h-9 rounded-full bg-agri-green/10 flex items-center justify-center text-agri-green group-hover:bg-agri-green group-hover:text-white transition-all overflow-hidden border border-gray-100">
                                            {user.photo ? <img src={user.photo} alt="" className="w-full h-full object-cover" /> : <User className="h-5 w-5" />}
                                        </div>
                                        <div className="hidden md:block">
                                            <p className="text-xs font-bold text-gray-900 leading-tight">{user.name}</p>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-tighter font-semibold">Profil</p>
                                        </div>
                                    </Link>
                                    
                                    <Link to="/dashboard" className="p-2 text-gray-500 hover:text-agri-green transition-colors" title="Tableau de bord">
                                        <LayoutDashboard className="h-5 w-5" />
                                    </Link>
                                    
                                    <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-agri-red transition-colors" title="Déconnexion">
                                        <LogOut className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-sm font-bold text-gray-700 hover:text-agri-green transition-colors px-4 py-2">Se connecter</Link>
                                <Link to="/register" className="btn-primary shadow-lg shadow-agri-green/20">
                                    S'inscrire
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
