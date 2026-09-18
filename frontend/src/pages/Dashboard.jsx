import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import {
    Package, ShoppingCart, Clock, DollarSign, Plus, ChevronRight,
    Wallet, ArrowDownToLine, X, Phone, CheckCircle, AlertCircle, TrendingUp, Download
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminDashboard from './admin/AdminDashboard';

// ─── Modal de retrait ────────────────────────────────────────────────────────
const WithdrawalModal = ({ balance, onClose, onSuccess }) => {
    const [form, setForm] = useState({ amount: '', method: 'moov', phone: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fee = form.amount ? Math.round(parseFloat(form.amount) * 0.05 * 100) / 100 : 0;
    const net = form.amount ? Math.round((parseFloat(form.amount) - fee) * 100) / 100 : 0;
    const valid = form.amount && parseFloat(form.amount) >= 500 && parseFloat(form.amount) <= balance && form.phone;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await axios.post('/withdrawals', form);
            onSuccess(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la demande.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-agri-green/10 rounded-2xl">
                        <ArrowDownToLine className="w-6 h-6 text-agri-green" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-gray-900">Demande de retrait</h2>
                        <p className="text-sm text-gray-500">Solde disponible : <span className="font-bold text-agri-green">{balance.toLocaleString()} FCFA</span></p>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 flex items-center gap-2 bg-red-50 text-red-600 border border-red-100 rounded-xl px-4 py-3 text-sm font-medium">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Réseau */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Réseau Mobile Money</label>
                        <div className="grid grid-cols-2 gap-3">
                            {['moov', 'yas'].map(m => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => setForm({ ...form, method: m })}
                                    className={`py-3 rounded-2xl font-black text-sm uppercase tracking-widest border-2 transition-all ${
                                        form.method === m
                                            ? 'border-agri-green bg-agri-green/10 text-agri-green'
                                            : 'border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-300'
                                    }`}
                                >
                                    {m === 'moov' ? 'Moov Africa' : 'Yas Money'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Numéro */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Numéro de téléphone</label>
                        <div className="relative">
                            <input
                                type="tel"
                                className="input pl-10"
                                placeholder="Ex: 90 00 00 00"
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                required
                            />
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                    </div>

                    {/* Montant */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Montant à retirer (FCFA)</label>
                        <input
                            type="number"
                            className="input font-black text-lg"
                            placeholder="Minimum 500 FCFA"
                            min="500"
                            max={balance}
                            value={form.amount}
                            onChange={(e) => setForm({ ...form, amount: e.target.value })}
                            required
                        />
                    </div>

                    {/* Récapitulatif des frais */}
                    {form.amount && parseFloat(form.amount) > 0 && (
                        <div className="bg-gray-50 rounded-2xl p-4 space-y-2 border border-gray-100">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 font-medium">Montant demandé</span>
                                <span className="font-bold text-gray-900">{parseFloat(form.amount).toLocaleString()} FCFA</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-red-400 font-medium">Commission plateforme (5%)</span>
                                <span className="font-bold text-red-400">− {fee.toLocaleString()} FCFA</span>
                            </div>
                            <div className="border-t border-gray-200 pt-2 flex justify-between">
                                <span className="font-black text-gray-700">Vous recevez</span>
                                <span className="font-black text-agri-green text-lg">{net.toLocaleString()} FCFA</span>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={!valid || loading}
                        className="btn-primary w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ArrowDownToLine className="w-5 h-5" />
                        {loading ? 'Traitement...' : 'Confirmer le retrait'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// ─── Dashboard Agriculteur ───────────────────────────────────────────────────
const FarmerDashboard = ({ stats, onUpdateOrderStatus, onBalanceChange }) => {
    const [showModal, setShowModal] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const handleSuccess = (data) => {
        setShowModal(false);
        setSuccessMsg(`Demande soumise ! Vous recevrez ${data.net_amount?.toLocaleString()} FCFA via ${data.method === 'moov' ? 'Moov Africa' : 'Yas Money'}.`);
        onBalanceChange(data.balance);
        setTimeout(() => setSuccessMsg(''), 6000);
    };

    return (
        <div className="space-y-8">
            {showModal && (
                <WithdrawalModal
                    balance={stats?.balance || 0}
                    onClose={() => setShowModal(false)}
                    onSuccess={handleSuccess}
                />
            )}

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Espace Agriculteur</h1>
                    <p className="text-gray-500 font-medium">Gérez vos récoltes et suivez vos ventes en direct.</p>
                </div>
                <Link to="/farmer/products/new" className="btn-primary flex items-center gap-2 shadow-lg shadow-agri-green/20">
                    <Plus className="w-5 h-5" />
                    Ajouter un produit
                </Link>
            </div>

            {successMsg && (
                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl px-5 py-4 font-medium">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    {successMsg}
                </div>
            )}

            {/* Solde — carte principale */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-agri-green to-emerald-700 text-white p-8 shadow-2xl shadow-agri-green/30">
                <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/5 rounded-full" />
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/5 rounded-full" />
                <Wallet className="absolute right-8 top-8 w-16 h-16 opacity-10" />

                <p className="text-emerald-100 font-bold uppercase tracking-widest text-xs mb-1">Mon Solde Disponible</p>
                <p className="text-5xl font-black tracking-tighter mb-1">
                    {(stats?.balance || 0).toLocaleString()}
                    <span className="text-2xl ml-2 font-bold opacity-80">FCFA</span>
                </p>
                <p className="text-emerald-200 text-sm font-medium mb-6">Après commission de 5% lors du retrait</p>

                <div className="flex gap-3">
                    <button
                        onClick={() => setShowModal(true)}
                        disabled={!stats?.balance || stats.balance < 500}
                        className="flex items-center gap-2 bg-white text-agri-green px-5 py-3 rounded-xl font-black text-sm hover:bg-emerald-50 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ArrowDownToLine className="w-4 h-4" />
                        Retirer
                    </button>
                    <Link to="/farmer/withdrawals" className="flex items-center gap-2 bg-white/20 text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-white/30 transition-colors">
                        Historique
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card border-none shadow-xl shadow-emerald-100/50 bg-white relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-agri-green/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-agri-green/10 rounded-2xl">
                            <Package className="w-6 h-6 text-agri-green" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Produits</p>
                            <p className="text-3xl font-black text-gray-900">{stats?.products_count || 0}</p>
                        </div>
                    </div>
                </div>
                <div className="card border-none shadow-xl shadow-amber-100/50 bg-white relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-agri-brown/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-agri-brown/10 rounded-2xl">
                            <ShoppingCart className="w-6 h-6 text-agri-brown" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Commandes</p>
                            <p className="text-3xl font-black text-gray-900">{stats?.orders_count || 0}</p>
                        </div>
                    </div>
                </div>
                <div className="card border-none shadow-xl shadow-emerald-100/50 bg-white relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-agri-green/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-emerald-50 rounded-2xl">
                            <TrendingUp className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Revenus (FCFA)</p>
                            <p className="text-3xl font-black text-gray-900">{(stats?.revenue || 0).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Commandes récentes */}
            <div className="card border-none shadow-xl shadow-gray-100/50">
                <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-agri-brown" />
                    Commandes récentes
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-50">
                                <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Commande</th>
                                <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Acheteur</th>
                                <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Total</th>
                                <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Statut</th>
                                <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {stats?.latest_orders?.map(order => (
                                <tr key={order.id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4">
                                        <p className="font-bold text-gray-900">#{order.id}</p>
                                        <p className="text-xs text-gray-400 font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                                                {order.user?.name?.charAt(0) || '?'}
                                            </div>
                                            <p className="text-sm font-bold text-gray-700">{order.user?.name || 'Inconnu'}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 text-sm font-black text-agri-green">{order.total_amount} FCFA</td>
                                    <td className="py-4">
                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tight ${
                                            order.status === 'confirmée' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="py-4 text-right">
                                        {order.status === 'en attente' && (
                                            <button
                                                onClick={() => onUpdateOrderStatus(order.id, 'confirmée')}
                                                className="text-xs font-bold bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg hover:bg-emerald-600 hover:text-white transition-colors mr-2"
                                            >
                                                Valider
                                            </button>
                                        )}
                                        <button className="text-xs font-bold text-agri-green hover:underline">Détails</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// ─── Dashboard Acheteur ──────────────────────────────────────────────────────
const downloadOrderReceipt = async (orderId) => {
    try {
        const { default: axios } = await import('../api/axios');
        const res = await axios.get(`/orders/${orderId}/receipt`, { responseType: 'blob' });
        const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
        const a = document.createElement('a');
        a.href = url;
        a.download = `facture_commande_${String(orderId).padStart(5, '0')}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    } catch {
        alert('Facture disponible uniquement après confirmation du paiement.');
    }
};

const BuyerDashboard = ({ stats, user }) => (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Bonjour, {user?.name}</h1>
            <p className="text-gray-500 font-medium">Suivez vos commandes et découvrez les nouveautés.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card bg-gradient-to-br from-agri-green to-emerald-700 text-white border-none shadow-xl shadow-emerald-200/50 relative overflow-hidden p-8">
                <ShoppingCart className="absolute -right-8 -bottom-8 w-48 h-48 opacity-10 rotate-12" />
                <p className="text-emerald-100 font-bold uppercase tracking-widest text-xs mb-1">Commandes passées</p>
                <p className="text-5xl font-black mb-6">{stats?.orders_count || 0}</p>
                <Link to="/catalog" className="inline-flex items-center gap-2 bg-white text-agri-green px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-50 transition-colors shadow-lg">
                    Faire un achat
                    <Plus className="w-4 h-4" />
                </Link>
            </div>
            <div className="card bg-white border-none shadow-xl shadow-gray-100 relative overflow-hidden p-8 flex flex-col justify-center">
                <DollarSign className="absolute -right-8 -bottom-8 w-48 h-48 text-gray-50" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-1">Total dépensé</p>
                <p className="text-5xl font-black text-gray-900 tracking-tighter">{stats?.total_spent || 0} <span className="text-xl">FCFA</span></p>
            </div>
        </div>

        <div className="card border-none shadow-xl shadow-gray-100/50">
            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-agri-green" />
                Mes dernières commandes
            </h3>
            <div className="space-y-4">
                {stats?.latest_orders?.map(order => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-50 hover:border-agri-green/30 transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-agri-green font-black">#{order.id}</div>
                            <div>
                                <p className="font-black text-gray-900 leading-tight">Commande du {new Date(order.created_at).toLocaleDateString()}</p>
                                <p className="text-xs text-gray-500 font-medium">{order.items?.length || 0} articles • {order.total_amount} FCFA</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${
                                order.status === 'confirmée' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                                {order.status}
                            </span>
                            {order.status === 'confirmée' && (
                                <button
                                    onClick={() => downloadOrderReceipt(order.id)}
                                    title="Télécharger la facture PDF"
                                    className="flex items-center gap-1 px-3 py-1.5 bg-agri-green/10 text-agri-green rounded-lg text-xs font-bold hover:bg-agri-green hover:text-white transition-all"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    Facture
                                </button>
                            )}
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-agri-green transition-colors" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// ─── Composant principal ─────────────────────────────────────────────────────
const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [paymentData] = useState(() =>
        JSON.parse(sessionStorage.getItem('paymentSuccess') || 'null')
    );
    const paymentSuccess = !!paymentData;
    const paidOrderId   = paymentData?.orderId;

    useEffect(() => {
        if (paymentData) sessionStorage.removeItem('paymentSuccess');
    }, []);

    useEffect(() => {
        fetchStats();
    }, [user?.id]);

    const fetchStats = async () => {
        if (!user) return;
        setLoading(true);
        setError(false);
        try {
            let endpoint = '/dashboard/buyer';
            if (user.role === 'agriculteur') endpoint = '/dashboard/farmer';
            if (user.role === 'admin') endpoint = '/dashboard/admin';

            const response = await axios.get(endpoint);
            setStats(response.data);
        } catch (err) {
            console.error('Dashboard error:', err?.response?.status, err?.response?.data || err?.message);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateOrderStatus = async (orderId, status) => {
        try {
            await axios.patch(`/orders/${orderId}/status`, { status });
            fetchStats();
        } catch (err) {
            console.error(err);
            alert('Erreur lors de la mise à jour de la commande');
        }
    };

    // Mise à jour locale du solde après retrait (sans recharger toute la page)
    const handleBalanceChange = (newBalance) => {
        setStats(prev => prev ? { ...prev, balance: newBalance } : prev);
    };

    if (!user) return <div className="max-w-7xl mx-auto p-10 text-center font-bold text-gray-400">Veuillez vous connecter pour voir votre tableau de bord.</div>;
    if (loading) return <div className="max-w-7xl mx-auto p-10 animate-pulse text-center font-bold text-gray-400">Chargement de votre espace...</div>;
    if (error || !stats) return (
        <div className="max-w-7xl mx-auto p-10 text-center">
            <p className="font-bold text-red-400 mb-4">Impossible de charger le tableau de bord.</p>
            <button onClick={fetchStats} className="btn-primary">Réessayer</button>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto">
            {paymentSuccess && (
                <div className="mx-4 mt-6 flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl px-5 py-4 font-medium shadow-sm">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-500" />
                    Paiement confirmé ! Votre commande <strong className="mx-1">#{paidOrderId}</strong> est en cours de préparation.
                </div>
            )}
            {user.role === 'agriculteur' && (
                <FarmerDashboard
                    stats={stats}
                    onUpdateOrderStatus={handleUpdateOrderStatus}
                    onBalanceChange={handleBalanceChange}
                />
            )}
            {user.role === 'acheteur' && <BuyerDashboard stats={stats} user={user} />}
            {user.role === 'admin' && <AdminDashboard stats={stats} />}
        </div>
    );
};

export default Dashboard;
