import { Link } from 'react-router-dom';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer
} from 'recharts';
import {
    Users, Package, ShoppingCart, TrendingUp,
    ChevronRight, Wallet, ArrowRight, Clock, BadgePercent
} from 'lucide-react';

const COLORS_ROLE   = ['#16a34a', '#f59e0b', '#3b82f6'];
const COLORS_STATUS = ['#f59e0b', '#16a34a', '#3b82f6', '#ef4444'];

const fmt = (n) => Number(n || 0).toLocaleString('fr-FR');

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-gray-900 text-white px-4 py-3 rounded-xl shadow-2xl text-sm min-w-[160px]">
            <p className="font-semibold mb-2 text-gray-400 text-xs uppercase tracking-wider">{label}</p>
            {payload.map((p, i) => (
                <div key={i} className="flex items-center justify-between gap-4">
                    <span style={{ color: p.color }} className="font-medium">{p.name}</span>
                    <span className="font-bold text-white">{fmt(p.value)}</span>
                </div>
            ))}
        </div>
    );
};

const EmptyChart = ({ h = 200 }) => (
    <div className={`flex flex-col items-center justify-center text-gray-300`} style={{ height: h }}>
        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5 text-gray-200" />
        </div>
        <p className="text-sm font-medium">Pas encore de données</p>
    </div>
);

const AdminDashboard = ({ stats }) => {
    const noData = (arr) => !arr || arr.length === 0;
    const pendingCount = stats.pending_withdrawals ?? 0;

    const today = new Date().toLocaleDateString('fr-FR', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });

    return (
        <div className="space-y-6">

            {/* ── En-tête ─────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                    <p className="text-sm text-gray-400 font-medium capitalize">{today}</p>
                    <h1 className="text-2xl font-black text-gray-900 mt-0.5">Vue d'ensemble</h1>
                </div>
                {pendingCount > 0 && (
                    <Link
                        to="/admin/withdrawals"
                        className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
                    >
                        <Clock className="w-4 h-4" />
                        {pendingCount} retrait{pendingCount > 1 ? 's' : ''} en attente
                        <ArrowRight className="w-3 h-3" />
                    </Link>
                )}
            </div>

            {/* ── KPI ─────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    {
                        icon: TrendingUp,
                        label: 'Revenus totaux',
                        value: fmt(stats.total_revenue) + ' FCFA',
                        sub: 'Commandes confirmées',
                        accent: 'text-emerald-600',
                        bg: 'bg-emerald-50',
                        border: 'border-emerald-100',
                    },
                    {
                        icon: ShoppingCart,
                        label: 'Commandes',
                        value: fmt(stats.orders_count),
                        sub: 'Total cumulé',
                        accent: 'text-amber-600',
                        bg: 'bg-amber-50',
                        border: 'border-amber-100',
                    },
                    {
                        icon: Users,
                        label: 'Utilisateurs',
                        value: fmt(stats.users_count),
                        sub: 'Inscrits sur la plateforme',
                        accent: 'text-blue-600',
                        bg: 'bg-blue-50',
                        border: 'border-blue-100',
                    },
                    {
                        icon: Package,
                        label: 'Produits',
                        value: fmt(stats.products_count),
                        sub: 'Publiés par les agriculteurs',
                        accent: 'text-green-700',
                        bg: 'bg-green-50',
                        border: 'border-green-100',
                    },
                ].map(({ icon: Icon, label, value, sub, accent, bg, border }) => (
                    <div key={label} className={`bg-white border ${border} rounded-2xl p-5`}>
                        <div className={`inline-flex p-2 rounded-xl ${bg} mb-4`}>
                            <Icon className={`w-4 h-4 ${accent}`} />
                        </div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                        <p className={`text-2xl font-black ${accent}`}>{value}</p>
                        <p className="text-xs text-gray-400 mt-1">{sub}</p>
                    </div>
                ))}
            </div>

            {/* ── Profits plateforme ──────────────────────────────────── */}
            <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/5 rounded-full" />
                <div className="absolute -right-2 -bottom-2 w-24 h-24 bg-white/5 rounded-full" />
                <BadgePercent className="absolute right-6 top-6 w-14 h-14 opacity-10" />

                <p className="text-xs font-bold uppercase tracking-widest text-purple-200 mb-1">Profits plateforme</p>
                <p className="text-xs text-purple-300 mb-4">Commission 5% sur les retraits approuvés</p>

                <div className="flex flex-col sm:flex-row sm:items-end gap-6">
                    <div>
                        <p className="text-4xl font-black tracking-tighter">
                            {fmt(stats.fees_collected)}
                            <span className="text-xl ml-2 font-bold opacity-80">FCFA</span>
                        </p>
                        <p className="text-purple-300 text-sm font-medium mt-1">Commissions perçues (retraits approuvés)</p>
                    </div>
                    {(stats.fees_pending || 0) > 0 && (
                        <div className="bg-white/10 rounded-xl px-4 py-3 border border-white/20">
                            <p className="text-xs font-bold text-purple-200 uppercase tracking-widest mb-0.5">En attente</p>
                            <p className="text-xl font-black">{fmt(stats.fees_pending)} FCFA</p>
                            <p className="text-[10px] text-purple-300 mt-0.5">Retraits encore à traiter</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Graphique principal ──────────────────────────────────── */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-base font-bold text-gray-900">Activité des 12 derniers mois</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Revenus et nombre de commandes par mois</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-semibold text-gray-400">
                        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-green-600 inline-block rounded" /> Revenus</span>
                        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-amber-400 inline-block rounded" /> Commandes</span>
                    </div>
                </div>
                {noData(stats.sales_by_month) ? (
                    <EmptyChart h={260} />
                ) : (
                    <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={stats.sales_by_month} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                            <defs>
                                <linearGradient id="gRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%"  stopColor="#16a34a" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gOrders" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={50} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="revenue" name="Revenus (FCFA)" stroke="#16a34a" strokeWidth={2} fill="url(#gRevenue)" dot={false} activeDot={{ r: 5, fill: '#16a34a' }} />
                            <Area type="monotone" dataKey="orders"  name="Commandes"      stroke="#f59e0b" strokeWidth={2} fill="url(#gOrders)"  dot={false} activeDot={{ r: 5, fill: '#f59e0b' }} />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* ── Ligne basse ─────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Top produits */}
                <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6">
                    <h2 className="text-base font-bold text-gray-900 mb-1">Top produits</h2>
                    <p className="text-xs text-gray-400 mb-6">Classés par chiffre d'affaires (FCFA)</p>
                    {noData(stats.top_products) ? (
                        <EmptyChart h={200} />
                    ) : (
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={stats.top_products} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                                <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11, fill: '#374151', fontWeight: 600 }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="revenue" name="Revenus" fill="#16a34a" radius={[0, 6, 6, 0]} maxBarSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Répartition + Accès rapides */}
                <div className="space-y-4">
                    {/* Donut utilisateurs */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-6">
                        <h2 className="text-base font-bold text-gray-900 mb-4">Utilisateurs</h2>
                        {noData(stats.users_by_role) ? (
                            <EmptyChart h={120} />
                        ) : (
                            <div className="flex items-center gap-4">
                                <ResponsiveContainer width={90} height={90}>
                                    <PieChart>
                                        <Pie data={stats.users_by_role} cx="50%" cy="50%" innerRadius={28} outerRadius={42} paddingAngle={3} dataKey="value" startAngle={90} endAngle={-270}>
                                            {stats.users_by_role.map((_, i) => (
                                                <Cell key={i} fill={COLORS_ROLE[i % COLORS_ROLE.length]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="space-y-2 flex-1">
                                    {stats.users_by_role.map((r, i) => (
                                        <div key={i} className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS_ROLE[i % COLORS_ROLE.length] }} />
                                                <span className="text-gray-500 font-medium">{r.name}</span>
                                            </div>
                                            <span className="font-bold text-gray-800">{r.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Accès rapides */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-2">
                        <Link to="/admin/users" className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
                            <div className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                                <div className="p-1.5 bg-blue-50 rounded-lg"><Users className="w-3.5 h-3.5 text-blue-600" /></div>
                                Gérer les utilisateurs
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                        </Link>
                        <Link to="/admin/withdrawals" className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-amber-50 transition-colors group">
                            <div className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                                <div className="p-1.5 bg-amber-50 rounded-lg"><Wallet className="w-3.5 h-3.5 text-amber-600" /></div>
                                <span>Retraits</span>
                                {pendingCount > 0 && (
                                    <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-1.5 py-0.5 rounded-full">{pendingCount}</span>
                                )}
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                        </Link>
                        <Link to="/messages" className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
                            <div className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                                <div className="p-1.5 bg-green-50 rounded-lg"><ShoppingCart className="w-3.5 h-3.5 text-green-600" /></div>
                                Messages
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
