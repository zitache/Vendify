import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBasket, ArrowRight, ArrowLeft } from 'lucide-react';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

    if (cart.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 max-w-lg mx-auto">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBasket className="w-12 h-12 text-gray-300" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Votre panier est vide</h2>
                    <p className="text-gray-500 mb-8 text-lg">Il semble que vous n'ayez pas encore ajouté de produits agricoles à votre panier.</p>
                    <Link to="/catalog" className="btn-primary inline-flex items-center gap-2 py-4 px-8 shadow-xl shadow-agri-green/20">
                        <ArrowLeft className="w-5 h-5" />
                        Découvrir les produits
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-10 tracking-tight">Mon Panier <span className="text-agri-green text-2xl font-bold ml-2">({cartCount} articles)</span></h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.map((item) => (
                        <div key={item.id} className="card group flex flex-col sm:flex-row items-center gap-6 p-4 hover:border-agri-green/30 transition-colors">
                            <div className="w-32 h-32 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100">
                                {item.image_url ? (
                                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <ShoppingBasket className="w-10 h-10" />
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex-1 text-center sm:text-left">
                                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-agri-green transition-colors">{item.name}</h3>
                                <p className="text-sm text-gray-500 mb-2 font-medium">Vendu par : {item.user?.name || 'Agriculteur local'}</p>
                                <div className="text-agri-green font-extrabold text-lg">{item.price} FCFA <span className="text-xs text-gray-400 font-medium">/ kg</span></div>
                            </div>

                            <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl">
                                <button 
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="p-2 hover:bg-white rounded-lg transition-colors text-gray-500 disabled:opacity-30 shadow-sm"
                                    disabled={item.quantity <= 1}
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-8 text-center font-bold text-gray-900">{item.quantity}</span>
                                <button 
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="p-2 hover:bg-white rounded-lg transition-colors text-gray-500 shadow-sm"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="text-right sm:min-w-[120px]">
                                <p className="text-sm text-gray-400 uppercase tracking-widest font-bold mb-1">Total</p>
                                <p className="text-xl font-black text-gray-900 tracking-tight">{item.price * item.quantity} <span className="text-xs">FCFA</span></p>
                            </div>

                            <button 
                                onClick={() => removeFromCart(item.id)}
                                className="p-3 text-gray-300 hover:text-agri-red hover:bg-red-50 rounded-xl transition-all"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end lg:col-span-2">
                    <button 
                        onClick={(e) => {
                            const btn = e.currentTarget;
                            const originalText = btn.innerHTML;
                            btn.innerHTML = '<span class="flex items-center gap-2"><svg class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Mise à jour...</span>';
                            setTimeout(() => {
                                btn.innerHTML = 'Panier mis à jour !';
                                btn.classList.add('bg-emerald-500', 'text-white');
                                btn.classList.remove('bg-gray-100', 'text-gray-700');
                                setTimeout(() => {
                                    btn.innerHTML = originalText;
                                    btn.classList.remove('bg-emerald-500', 'text-white');
                                    btn.classList.add('bg-gray-100', 'text-gray-700');
                                }, 2000);
                            }, 600);
                        }}
                        className="bg-gray-100 text-gray-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2"
                    >
                        Mettre à jour le panier
                    </button>
                </div>

                {/* Summary */}
                <div className="space-y-6">
                    <div className="card shadow-xl shadow-gray-200/50 border-none p-8 sticky top-24">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-50 pb-4">Récapitulatif</h2>
                        
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-gray-600 font-medium text-lg">
                                <span>Sous-total</span>
                                <span>{cartTotal} FCFA</span>
                            </div>
                            <div className="flex justify-between text-gray-600 font-medium text-lg">
                                <span>Livraison</span>
                                <span className="text-agri-red text-sm font-bold mt-1 text-right max-w-[150px]">À la charge de l'acheteur</span>
                            </div>
                            <div className="border-t border-gray-100 pt-6 mt-6">
                                <div className="flex justify-between text-gray-900">
                                    <span className="text-xl font-bold">Total</span>
                                    <span className="text-3xl font-black text-agri-green tracking-tighter">{cartTotal} FCFA</span>
                                </div>
                            </div>
                        </div>

                        <Link to="/checkout" className="btn-primary w-full py-5 text-lg shadow-xl shadow-agri-green/30 flex items-center justify-center gap-3 group">
                            Valider la commande
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        
                        <p className="mt-6 text-center text-xs text-gray-400 font-bold uppercase tracking-widest">
                            Paiement sécurisé via Yas & Moov
                        </p>
                    </div>

                    <Link to="/catalog" className="flex items-center justify-center gap-2 text-gray-500 font-bold hover:text-agri-green transition-colors py-2 text-sm uppercase tracking-widest">
                        <ArrowLeft className="w-4 h-4" />
                        Continuer mes achats
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Cart;
