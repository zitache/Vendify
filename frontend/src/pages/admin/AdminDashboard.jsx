import { Link } from 'react-router-dom';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, ResponsiveContainer
} from 'recharts';
import {
    Users, Package, ShoppingCart, TrendingUp,
    ChevronRight, Wallet, AlertCircle
} from 'lucide-react';

// ─── Couleurs ────────────────────────────────────────────────────────────────
const COLORS_ROLE   = ['#6ab04c', '#f59e0b', '#3b82f6'];
const COLORS_STATUS = ['#f59e0b', '#6ab04c', '#3b82f6', '#ef4444'];

// ─── Tooltip personnalisé ─────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, suffix = 'FCFA' }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-gray-900 text-white px-4 py-3 rounded-xl shadow-2xl text-sm">
            <p className="font-bold mb-1 text-gray-300">{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ color: p.color }} className="font-black">
                    {p.name} : {Number(p.value).toLocaleString()} {suffix}
                </p>
            ))}
        </div>
    );
};

// ─── Carte KPI ───────────────────────────────────────────────────────────────
const KpiCard = ({ icon: Icon, label, value, sub, color, badge }) => (
    <div className="card border-none shadow-xl shadow-gray-100/50 relative overflow-hidden group">
        <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-5 group-hover:scale-150 transition-transform duration-700 ${color}`} />
        <div className="flex items-start justify-between">
            <div className={`p-3 rounded-2xl ${color} bg-opacity-10`}>
                <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
            </div>
            {badge != null && badge > 0 && (
                <span className="bg-red-100 text-red-600 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wide">
                    {badge} en attente
                </span>
            )}
        </div>
        <div className="mt-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
            <p className="text-3xl font-black text-gray-900 mt-1">{value}</p>
            {sub && <p className="text-xs text-gray-400 font-medium mt-1">{sub}</p>}
        </div>
    </div>
);

// ─── Composant principal ──────────────────────────────────────────────────────
const AdminDashboard = ({ stats }) => {
    const noData = (arr) => !arr || arr.length === 0;

    return (
        <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <KpiCard icon={Users}       label="Utilisateurs"  value={stats.users_count}    color="bg-blue-500"    />
                <KpiCard icon={Package}     label="Produits"      value={stats.products_count} color="bg-agri-green"  />
                <KpiCard icon={ShoppingCart} label="Commandes"    value={stats.orders_count}   color="bg-amber-500"   />
                <KpiCard
                    icon={TrendingUp}
                    label="Revenus (FCFA)"
                    value={Number(stats.total_revenue).toLocaleString()}
                    color="bg-emerald-500"
                    sub="Commandes confirmées"
                />
                <KpiCard
                    icon={Wallet}
                    label="Retraits"
                    value={stats.pending_withdrawals ?? 0}
                    color="bg-purple-500"
                    badge={stats.pending_withdrawals}
                    sub="demande(s) en attente"
                />
            </div>

            {/* Ligne 1 : Revenus mensuels + Répartition utilisateurs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenus & commandes mensuels (AreaChart) */}
                <div className="lg:col-span-2 card border-none shadow-xl shadow-gray-100/50">
                    <h3 className="text-lg font-black text-gray-900 mb-6">Ventes des 12 derniers mois</h3>
                    {noData(stats.sales_by_month) ? (
                        <EmptyChart />
                    ) : (
                        <ResponsiveContainer width="100%" height={260}>
                            <AreaChart data={stats.sales_by_month} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%"  stopColor="#6ab04c" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6ab04c" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="gradOrders" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 700 }} />
                                <YAxis tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 700 }} />
                                <Tooltip content={<CustomTooltip suffix="" />} />
                                <Legend wrapperStyle={{ fontSize: 12, fontWeight: 700 }} />
                                <Area type="monotone" dataKey="revenue" name="Revenus (FCFA)" stroke="#6ab04c" strokeWidth={2.5} fill="url(#gradRevenue)" dot={{ r: 4, fill: '#6ab04c' }} />
                                <Area type="monotone" dataKey="orders"  name="Commandes"      stroke="#f59e0b" strokeWidth={2.5} fill="url(#gradOrders)"  dot={{ r: 4, fill: '#f59e0b' }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Utilisateurs par rôle (PieChart donut) */}
                <div className="card border-none shadow-xl shadow-gray-100/50">
                    <h3 className="text-lg font-black text-gray-900 mb-6">Répartition des utilisateurs</h3>
                    {noData(stats.users_by_role) ? (
                        <EmptyChart />
                    ) : (
                        <>
                            <ResponsiveContainer width="100%" height={180}>
                                <PieChart>
                                    <Pie
                                        data={stats.users_by_role}
                                        cx="50%" cy="50%"
                                        innerRadius={50} outerRadius={80}
                                        paddingAngle={4}
                                        dataKey="value"
                                    >
                                        {stats.users_by_role.map((_, i) => (
                                            <Cell key={i} fill={COLORS_ROLE[i % COLORS_ROLE.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(v) => [v, 'utilisateurs']} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="space-y-2 mt-2">
                                {stats.users_by_role.map((r, i) => (
                                    <div key={i} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS_ROLE[i % COLORS_ROLE.length] }} />
                                            <span className="font-medium text-gray-600">{r.name}</span>
                                        </div>
                                        <span className="font-black text-gray-900">{r.value}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Ligne 2 : Top produits + Statut commandes */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top 5 produits (BarChart horizontal) */}
                <div className="lg:col-span-2 card border-none shadow-xl shadow-gray-100/50">
                    <h3 className="text-lg font-black text-gray-900 mb-6">Top 5 produits (chiffre d'affaires)</h3>
                    {noData(stats.top_products) ? (
                        <EmptyChart />
                    ) : (
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart
                                data={stats.top_products}
                                layout="vertical"
                                margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                                <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 700 }} />
                                <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11, fill: '#374151', fontWeight: 700 }} />
                                <Tooltip content={<CustomTooltip suffix="FCFA" />} />
                                <Bar dataKey="revenue" name="Revenus" fill="#6ab04c" radius={[0, 6, 6, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Statut des commandes (PieChart) */}
                <div className="card border-none shadow-xl shadow-gray-100/50">
                    <h3 className="text-lg font-black text-gray-900 mb-6">Statut des commandes</h3>
                    {noData(stats.orders_by_status) ? (
                        <EmptyChart />
                    ) : (
                        <>
                            <ResponsiveContainer width="100%" height={180}>
                                <PieChart>
                                    <Pie
                                        data={stats.orders_by_status}
                                        cx="50%" cy="50%"
                                        outerRadius={80}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {stats.orders_by_status.map((_, i) => (
                                            <Cell key={i} fill={COLORS_STATUS[i % COLORS_STATUS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(v) => [v, 'commandes']} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="space-y-2 mt-2">
                                {stats.orders_by_status.map((s, i) => (
                                    <div key={i} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS_STATUS[i % COLORS_STATUS.length] }} />
                                            <span className="font-medium text-gray-600">{s.name}</span>
                                        </div>
                                        <span className="font-black text-gray-900">{s.value}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Ligne 3 : Nouveaux utilisateurs + Accès rapides */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Nouveaux utilisateurs (LineChart) */}
                <div className="lg:col-span-2 card border-none shadow-xl shadow-gray-100/50">
                    <h3 className="text-lg font-black text-gray-900 mb-6">Nouveaux utilisateurs (6 derniers mois)</h3>
                    {noData(stats.new_users_by_month) ? (
                        <EmptyChart />
                    ) : (
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={stats.new_users_by_month} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 700 }} />
                                <YAxis tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 700 }} allowDecimals={false} />
                                <Tooltip content={<CustomTooltip suffix="utilisateurs" />} />
                                <Line
                                    type="monotone" dataKey="users" name="Nouveaux inscrits"
                                    stroke="#3b82f6" strokeWidth={2.5}
                                    dot={{ r: 5, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 7 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Accès rapides */}
                <div className="card border-none shadow-xl shadow-gray-100/50">
                    <h3 className="text-lg font-black text-gray-900 mb-6">Accès rapides</h3>
                    <div className="space-y-3">
                        <Link to="/admin/users" className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl font-bold text-gray-700 hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-3"><Users className="w-4 h-4 text-blue-500" /> Utilisateurs</div>
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                        <Link to="/admin/withdrawals" className="flex items-center justify-between p-4 rounded-2xl font-bold transition-colors
                            bg-emerald-50 text-agri-green hover:bg-emerald-100 relative">
                            <div className="flex items-center gap-3"><Wallet className="w-4 h-4" /> Retraits</div>
                            <div className="flex items-center gap-2">
                                {(stats.pending_withdrawals ?? 0) > 0 && (
                                    <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                                        {stats.pending_withdrawals}
                                    </span>
                                )}
                                <ChevronRight className="w-4 h-4" />
                            </div>
                        </Link>
                        <Link to="/messages" className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl font-bold text-gray-700 hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-3"><AlertCircle className="w-4 h-4 text-amber-500" /> Messages</div>
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

const EmptyChart = () => (
    <div className="flex items-center justify-center h-40 text-gray-300 text-sm font-bold">
        Pas encore de données
    </div>
);

export default AdminDashboard;
