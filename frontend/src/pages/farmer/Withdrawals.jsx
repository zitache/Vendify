import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { ArrowDownToLine, Clock, CheckCircle, XCircle, Wallet, Download } from 'lucide-react';

const statusConfig = {
    pending:  { label: 'En attente',  color: 'bg-amber-50 text-amber-600',   icon: Clock },
    approved: { label: 'Approuvé',    color: 'bg-emerald-50 text-emerald-600', icon: CheckCircle },
    rejected: { label: 'Rejeté',      color: 'bg-red-50 text-red-500',       icon: XCircle },
};

const Withdrawals = () => {
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(null);

    useEffect(() => {
        axios.get('/withdrawals')
            .then(res => setWithdrawals(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const downloadReceipt = async (id) => {
        setDownloading(id);
        try {
            const res = await axios.get(`/withdrawals/${id}/receipt`, { responseType: 'blob' });
            const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
            const a = document.createElement('a');
            a.href = url;
            a.download = `recu_retrait_${String(id).padStart(5, '0')}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch {
            alert('Impossible de générer le reçu.');
        } finally {
            setDownloading(null);
        }
    };

    const totalPending  = withdrawals.filter(w => w.status === 'pending').reduce((s, w) => s + Number(w.amount), 0);
    const totalApproved = withdrawals.filter(w => w.status === 'approved').reduce((s, w) => s + Number(w.net_amount), 0);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-agri-green/10 rounded-2xl">
                    <Wallet className="w-7 h-7 text-agri-green" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Mes retraits</h1>
                    <p className="text-gray-500 font-medium">Historique de vos demandes de retrait.</p>
                </div>
            </div>

            {/* Résumé */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="card border-none shadow-lg bg-amber-50">
                    <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">En attente</p>
                    <p className="text-3xl font-black text-amber-700">{totalPending.toLocaleString()} <span className="text-base font-bold">FCFA</span></p>
                </div>
                <div className="card border-none shadow-lg bg-emerald-50">
                    <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-1">Total reçu (net)</p>
                    <p className="text-3xl font-black text-emerald-700">{totalApproved.toLocaleString()} <span className="text-base font-bold">FCFA</span></p>
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1,2,3].map(i => <div key={i} className="card animate-pulse h-20 bg-gray-100 border-none" />)}
                </div>
            ) : withdrawals.length === 0 ? (
                <div className="card text-center py-20 border-dashed border-2 border-gray-200 bg-gray-50/50">
                    <ArrowDownToLine className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-xl font-black text-gray-900 mb-2">Aucun retrait effectué</h3>
                    <p className="text-gray-500">Vos demandes de retrait apparaîtront ici.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {withdrawals.map(w => {
                        const cfg = statusConfig[w.status] || statusConfig.pending;
                        const Icon = cfg.icon;
                        return (
                            <div key={w.id} className="card border-none shadow-md hover:shadow-lg transition-shadow">
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-2xl ${cfg.color.split(' ')[0]}`}>
                                            <Icon className={`w-5 h-5 ${cfg.color.split(' ')[1]}`} />
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900">
                                                {w.amount.toLocaleString()} FCFA
                                                <span className="ml-2 text-sm font-medium text-gray-400">via {w.method === 'moov' ? 'Moov Africa' : 'Mixx by yas'}</span>
                                            </p>
                                            <p className="text-xs text-gray-400 font-medium">{w.phone} · {new Date(w.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-xs text-red-400 font-medium">Commission −{w.fee.toLocaleString()} FCFA</p>
                                            <p className="font-black text-agri-green">{w.net_amount.toLocaleString()} FCFA net</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${cfg.color}`}>
                                            {cfg.label}
                                        </span>
                                        {w.status === 'approved' && (
                                            <button
                                                onClick={() => downloadReceipt(w.id)}
                                                disabled={downloading === w.id}
                                                title="Télécharger le reçu PDF"
                                                className="flex items-center gap-1.5 px-3 py-2 bg-agri-green/10 text-agri-green rounded-xl text-xs font-bold hover:bg-agri-green hover:text-white transition-all disabled:opacity-50"
                                            >
                                                <Download className="w-3.5 h-3.5" />
                                                {downloading === w.id ? '...' : 'Reçu'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {w.admin_note && (
                                    <p className="mt-3 text-sm text-gray-500 bg-gray-50 rounded-xl px-4 py-2 font-medium">
                                        Note admin : {w.admin_note}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Withdrawals;
