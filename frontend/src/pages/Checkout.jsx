import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import axios from '../api/axios';
import { openKkiapayWidget, addKkiapayListener, removeKkiapayListener } from 'kkiapay';
import { Truck, ShieldCheck, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';

const Checkout = () => {
    const { user } = useAuth();
    const { cart, cartTotal, clearCart } = useCart();
    const [deliveryAddress, setDeliveryAddress] = useState(user?.locality || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [confirmed, setConfirmed] = useState(false);
    const [confirmedOrder, setConfirmedOrder] = useState(null);
    const navigate = useNavigate();

    // Référence vers la commande créée (accessible dans les callbacks KiKiaPay)
    const orderRef = useRef(null);

    // ─── Listener KiKiaPay : succès de paiement ──────────────────────────────
    useEffect(() => {
        const onSuccess = async ({ transactionId }) => {
            const order = orderRef.current;
            if (!order) return;
            setLoading(true);
            setError('');
            try {
                const res = await axios.post('/payments/verify', {
                    order_id:       order.id,
                    transaction_id: transactionId,
                });
                clearCart();
                setConfirmedOrder(res.data.order);
                setConfirmed(true);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    'Le paiement a été reçu mais la vérification a échoué. Contactez le support.'
                );
            } finally {
                setLoading(false);
            }
        };

        const onFailed = () => {
            setError('Le paiement a échoué ou a été annulé. Veuillez réessayer.');
            setLoading(false);
        };

        addKkiapayListener('success', onSuccess);
        addKkiapayListener('failed',  onFailed);

        return () => {
            removeKkiapayListener('success', onSuccess);
            removeKkiapayListener('failed',  onFailed);
        };
    }, []);

    // ─── Étape 1 : créer la commande, puis ouvrir le widget ──────────────────
    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (cart.length === 0) return;
        setError('');
        setLoading(true);

        try {
            const res = await axios.post('/orders', {
                delivery_address: deliveryAddress,
                items: cart.map(item => ({
                    product_id: item.id,
                    quantity:   item.quantity,
                })),
            });

            const order = res.data;
            orderRef.current = order;

            // Ouvrir le widget KiKiaPay
            openKkiapayWidget({
                amount:  order.total_amount,
                api_key: import.meta.env.VITE_KKIAPAY_PUBLIC_KEY,
                sandbox: import.meta.env.VITE_KKIAPAY_SANDBOX === 'true',
                name:    'AgriKara – Vendify',
                theme:   '#6ab04c',
                data:    JSON.stringify({ order_id: order.id }),
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la création de la commande.');
        } finally {
            setLoading(false);
        }
    };

    // ─── Écran de confirmation ────────────────────────────────────────────────
    if (confirmed) {
        return (
            <div className="max-w-xl mx-auto py-20 px-4 text-center">
                <div className="card border-none shadow-2xl p-12 rounded-3xl">
                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                        <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
                        Commande Confirmée !
                    </h2>
                    <p className="text-gray-500 mb-8 text-lg">
                        Merci pour votre achat. Votre commande{' '}
                        <span className="font-bold text-gray-900">#{confirmedOrder?.id}</span>{' '}
                        est en cours de préparation.
                    </p>
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-10 text-left space-y-1">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                            Détails de livraison
                        </p>
                        <p className="font-bold text-gray-900">{user?.name}</p>
                        <p className="text-gray-600">{deliveryAddress}</p>
                        <p className="text-gray-600">{phone}</p>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="btn-primary w-full py-4 text-lg"
                    >
                        Suivre ma commande
                    </button>
                </div>
            </div>
        );
    }

    // ─── Formulaire de commande ───────────────────────────────────────────────
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-10 tracking-tight">
                Finaliser ma commande
            </h1>

            {error && (
                <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 rounded-2xl px-5 py-4 font-medium">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Formulaire livraison */}
                <div className="space-y-8">
                    <div className="card">
                        <div className="flex items-center gap-3 mb-8 text-xl font-bold text-gray-900 border-b border-gray-50 pb-4">
                            <Truck className="w-6 h-6 text-agri-green" />
                            <h2>Informations de livraison</h2>
                        </div>
                        <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Adresse complète / Localité
                                </label>
                                <textarea
                                    className="input min-h-[100px]"
                                    placeholder="Ex: Quartier Tomdè, Rue de la poste, Kara"
                                    value={deliveryAddress}
                                    onChange={(e) => setDeliveryAddress(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Téléphone</label>
                                    <input
                                        className="input"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Destinataire</label>
                                    <input className="input" defaultValue={user?.name} readOnly />
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="card bg-amber-50 border-amber-200">
                        <div className="flex gap-4">
                            <ShieldCheck className="w-10 h-10 text-amber-500 flex-shrink-0" />
                            <div>
                                <h3 className="font-bold text-gray-900">Avertissement Important</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Veuillez bien discuter avec l'agriculteur avant de passer commande.
                                    La plateforme Vendify n'est pas responsable en cas de litige.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Badge KiKiaPay */}
                    <div className="flex items-center justify-center gap-3 text-gray-400 text-xs font-bold uppercase tracking-widest">
                        <ShieldCheck className="w-4 h-4 text-agri-green" />
                        Paiement sécurisé par KiKiaPay
                    </div>
                </div>

                {/* Récapitulatif commande */}
                <div className="card h-fit sticky top-24">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-50 pb-4">
                        Résumé de la commande
                    </h2>

                    <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2">
                        {cart.map(item => (
                            <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white rounded-lg border border-gray-100 flex items-center justify-center overflow-hidden">
                                        {item.image_url
                                            ? <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                                            : <span className="text-[10px] font-bold text-gray-300">BIO</span>
                                        }
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-900">{item.name}</p>
                                        <p className="text-xs text-gray-500">{item.quantity} kg × {item.price} FCFA</p>
                                    </div>
                                </div>
                                <p className="font-bold text-gray-900 text-sm">{item.quantity * item.price} FCFA</p>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-100 pt-6 space-y-4">
                        <div className="flex justify-between text-gray-600">
                            <span className="font-medium">Sous-total</span>
                            <span className="font-bold">{cartTotal} FCFA</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span className="font-medium">Frais de livraison</span>
                            <span className="text-agri-red text-sm font-bold">À la charge de l'acheteur</span>
                        </div>
                        <div className="flex justify-between text-gray-900 pt-4 border-t border-dashed border-gray-200">
                            <span className="text-xl font-bold">Total à payer</span>
                            <span className="text-3xl font-black text-agri-green tracking-tighter">{cartTotal} FCFA</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        form="checkout-form"
                        disabled={loading || cart.length === 0}
                        className="btn-primary w-full py-5 mt-8 text-lg flex items-center justify-center gap-3 shadow-xl shadow-agri-green/20 group disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            'Traitement...'
                        ) : (
                            <>
                                Payer avec KiKiaPay
                                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>

                    <p className="text-[10px] text-center text-gray-400 uppercase tracking-tight font-bold mt-4">
                        Moov Africa · Yas (T-Money) · Carte bancaire
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
