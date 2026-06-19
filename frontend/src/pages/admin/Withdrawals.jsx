import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { CheckCircle, XCircle, Clock, Wallet } from 'lucide-react';

const AdminWithdrawals = () => {
    const [withdrawals, setWithdrawals] = useState([]);
    const [filter, setFilter] = useState('pending');
    const [loading, setLoading] = useState(true);
    const [actionNote, setActionNote] = useState({});
    const fetchWithdrawals = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/admin/withdrawals?status=${filter}`);
            setWithdrawals(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchWithdrawals(); }, [filter]);

    const handleAction = async (id, action) => {
        try {
            await axios.patch(`/admin/withdrawals/${id}/${action}`, { note: actionNote[id] || '' });
            fetchWithdrawals();
        } catch (err) {
            alert(err.response?.data?.message || 'Erreur');
        }
    };

    const tabs = [
        { key: 'pending',  label: 'En attente' },
        { key: 'approved', label: 'Approuvés' },
        { key: 'rejected', label: 'Rejetés' },
        { key: 'all',      label: 'Tous' },
    ];

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-agri-green/10 rounded-2xl">
                    <Wallet className="w-7 h-7 text-agri-green" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Gestion des retraits</h1>
                    <p className="text-gray-500 font-medium">Approuvez ou rejetez les demandes des agriculteurs.</p>
                </div>
            </div>

            {/* Filtres */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {tabs.map(t => (
                    <button
                        key={t.key}
                        onClick={() => setFilter(t.key)}
                        className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                            filter === t.key
                                ? 'bg-agri-green text-white shadow-md'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1,2,3].map(i => <div key={i} className="card animate-pulse h-24 bg-gray-100 border-none" />)}
                </div>
            ) : withdrawals.length === 0 ? (
                <div className="card text-center py-16 border-dashed border-2 border-gray-200 bg-gray-50/50">
                    <Clock className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <p className="font-bold text-gray-400">Aucune demande dans cette catégorie.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {withdrawals.map(w => (
                        <div key={w.id} className="card border-none shadow-md">
                            <div className="flex items-start justify-between flex-wrap gap-4">
                                <div>
                                    <p className="font-black text-gray-900 text-lg">
                                        {w.user?.name}
                                        <span className="ml-2 text-sm font-medium text-gray-400">{w.user?.phone}</span>
                                    </p>
                                    <p className="text-sm text-gray-500 font-medium mt-1">
                                        {w.method === 'moov' ? 'Moov Africa' : 'Yas Money'} · <span className="font-bold">{w.phone}</span>
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">{new Date(w.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-gray-900">{w.amount.toLocaleString()} FCFA</p>
                                    <p className="text-sm text-red-400 font-medium">−{w.fee.toLocaleString()} commission</p>
                                    <p className="font-black text-agri-green">{w.net_amount.toLocaleString()} FCFA net</p>
                                </div>
                            </div>

                            {w.status === 'pending' && (
                                <div className="mt-4 pt-4 border-t border-gray-50 space-y-3">
                                    <input
                                        type="text"
                                        className="input text-sm"
                                        placeholder="Note optionnelle (visible par l'agriculteur)"
                                        value={actionNote[w.id] || ''}
                                        onChange={(e) => setActionNote({ ...actionNote, [w.id]: e.target.value })}
                                    />
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleAction(w.id, 'approve')}
                                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Approuver
                                        </button>
                                        <button
                                            onClick={() => handleAction(w.id, 'reject')}
                                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-50 text-red-500 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-colors"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            Rejeter
                                        </button>
                                    </div>
                                </div>
                            )}

                            {w.status !== 'pending' && (
                                <div className="mt-3 flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                        w.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                                    }`}>
                                        {w.status === 'approved' ? 'Approuvé' : 'Rejeté'}
                                    </span>
                                    {w.admin_note && <p className="text-sm text-gray-500 font-medium">"{w.admin_note}"</p>}
                                    {w.processed_at && <p className="text-xs text-gray-400 ml-auto">{new Date(w.processed_at).toLocaleDateString()}</p>}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminWithdrawals;
