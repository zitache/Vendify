import { Link } from 'react-router-dom';
import {
    ArrowRight, ShieldCheck, MapPin, Users,
    Smartphone, Leaf, Star, Truck, ChevronRight, Sprout
} from 'lucide-react';
import Footer from '../components/Footer';

/* ── images ─────────────────────────────────────────────────────────────── */
const HERO_IMG   = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=90';
const SPLIT_IMG  = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=900&q=80';

/* ── données ─────────────────────────────────────────────────────────────── */
const STATS = [
    { value: '500+', label: 'Agriculteurs', icon: Leaf },
    { value: '2 000+', label: 'Commandes', icon: Truck },
    { value: '98 %', label: 'Satisfaction', icon: Star },
    { value: '12', label: 'Districts couverts', icon: MapPin },
];

const STEPS = [
    {
        n: '01', icon: Sprout, color: 'bg-agri-green',
        title: 'Inscrivez-vous',
        desc: 'Créez votre compte en 2 minutes — agriculteur ou acheteur.',
    },
    {
        n: '02', icon: ShieldCheck, color: 'bg-amber-500',
        title: 'Choisissez vos produits',
        desc: 'Des centaines de produits frais directement depuis les fermes de la Kara.',
    },
    {
        n: '03', icon: Smartphone, color: 'bg-blue-500',
        title: 'Payez via mobile',
        desc: 'Réglez via Moov Africa ou Yas (T-Money). Aucune carte bancaire requise.',
    },
];

const CATEGORIES = [
    { name: 'Légumes frais',    emoji: '🥬', count: '120+ produits', ring: 'ring-emerald-200',  bg: 'bg-emerald-50',  text: 'text-emerald-700' },
    { name: 'Céréales & Grains', emoji: '🌾', count: '85+ produits', ring: 'ring-amber-200',    bg: 'bg-amber-50',    text: 'text-amber-700' },
    { name: 'Fruits tropicaux', emoji: '🍍', count: '60+ produits', ring: 'ring-orange-200',   bg: 'bg-orange-50',   text: 'text-orange-700' },
    { name: 'Tubercules',       emoji: '🍠', count: '40+ produits', ring: 'ring-rose-200',     bg: 'bg-rose-50',     text: 'text-rose-700' },
    { name: 'Épices & Herbes',  emoji: '🌿', count: '30+ produits', ring: 'ring-teal-200',     bg: 'bg-teal-50',     text: 'text-teal-700' },
    { name: 'Légumineuses',     emoji: '🫘', count: '25+ produits', ring: 'ring-lime-200',     bg: 'bg-lime-50',     text: 'text-lime-700' },
];

/* ════════════════════════════════════════════════════════════════════════════ */
const Home = () => (
    <div className="bg-white overflow-x-hidden">

        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
            {/* photo de fond */}
            <img
                src={HERO_IMG}
                alt="Champs agricoles de la Kara"
                className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {/* overlay dégradé */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />

            {/* bulles décoratives */}
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-agri-green/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
                <div className="max-w-2xl">
                    {/* badge lieu */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white text-xs font-bold uppercase tracking-widest mb-8">
                        <MapPin className="w-3.5 h-3.5 text-agri-green" />
                        Région de la Kara, Togo
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tighter mb-6">
                        Du champ à{' '}
                        <span className="text-agri-green">votre table</span>
                        <br />en un clic.
                    </h1>

                    <p className="text-lg sm:text-xl text-white/75 font-medium leading-relaxed mb-10 max-w-xl">
                        Vendify connecte directement les petits producteurs de la Kara aux acheteurs — des prix justes, des produits frais, zéro intermédiaire.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            to="/catalog"
                            className="inline-flex items-center justify-center gap-2 bg-agri-green text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-[#559140] transition-all shadow-2xl shadow-agri-green/40 group"
                        >
                            Acheter maintenant
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/register"
                            className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-white/20 transition-all border border-white/20"
                        >
                            Vendre ma récolte
                        </Link>
                    </div>

                    {/* mini-stats */}
                    <div className="mt-14 flex flex-wrap gap-6">
                        {STATS.map(({ value, label, icon: Icon }) => (
                            <div key={label} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/10">
                                <Icon className="w-4 h-4 text-agri-green" />
                                <div>
                                    <p className="text-white font-black text-lg leading-none">{value}</p>
                                    <p className="text-white/50 text-[10px] font-bold uppercase tracking-wider">{label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* vague de transition */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 80L1440 80L1440 40C1200 0 960 80 720 40C480 0 240 80 0 40L0 80Z" fill="white" />
                </svg>
            </div>
        </section>

        {/* ── BANDE DE CONFIANCE ────────────────────────────────────────────── */}
        <section className="py-8 bg-gray-50 border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-bold text-gray-400 uppercase tracking-widest">
                    {['Produits 100% locaux', 'Paiement sécurisé', 'Moov Africa & Yas', 'Livraison rapide', 'Agriculteurs vérifiés'].map(t => (
                        <span key={t} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-agri-green" />
                            {t}
                        </span>
                    ))}
                </div>
            </div>
        </section>

        {/* ── CATÉGORIES ────────────────────────────────────────────────────── */}
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-14">
                    <div>
                        <p className="text-agri-green font-black uppercase tracking-[0.3em] text-xs mb-3">Catalogue</p>
                        <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                            Explorez nos<br />catégories
                        </h2>
                    </div>
                    <Link
                        to="/catalog"
                        className="inline-flex items-center gap-2 text-agri-green font-bold hover:underline text-sm group"
                    >
                        Voir tout le catalogue
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {CATEGORIES.map(({ name, emoji, count, ring, bg, text }) => (
                        <Link
                            key={name}
                            to="/catalog"
                            className={`${bg} ${ring} ring-1 rounded-3xl p-5 flex flex-col items-center text-center gap-3 hover:scale-105 hover:shadow-lg transition-all duration-300 group`}
                        >
                            <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{emoji}</span>
                            <div>
                                <p className={`font-black text-sm ${text} leading-tight`}>{name}</p>
                                <p className="text-gray-400 text-[10px] font-semibold mt-1">{count}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>

        {/* ── COMMENT ÇA MARCHE ─────────────────────────────────────────────── */}
        <section className="py-24 bg-gray-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <p className="text-agri-green font-black uppercase tracking-[0.3em] text-xs mb-3">Simple & Rapide</p>
                    <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                        Comment ça marche ?
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {STEPS.map(({ n, icon: Icon, color, title, desc }) => (
                        <div key={n} className="relative bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all group">
                            <span className="absolute top-6 right-6 text-6xl font-black text-white/5 select-none">{n}</span>
                            <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <Icon className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-black text-white mb-3">{title}</h3>
                            <p className="text-white/50 font-medium leading-relaxed text-sm">{desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* ── SPLIT — POURQUOI VENDIFY ──────────────────────────────────────── */}
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* image */}
                    <div className="relative order-last lg:order-first">
                        <div className="rounded-[3rem] overflow-hidden aspect-[4/3] shadow-2xl shadow-gray-200">
                            <img src={SPLIT_IMG} alt="Agriculteur Kara" className="w-full h-full object-cover" />
                        </div>
                        {/* badge flottant */}
                        <div className="absolute -bottom-6 -right-4 sm:-right-8 bg-white rounded-2xl shadow-xl px-6 py-4 flex items-center gap-4 border border-gray-100">
                            <div className="w-12 h-12 bg-agri-green/10 rounded-xl flex items-center justify-center">
                                <Users className="w-6 h-6 text-agri-green" />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-gray-900 leading-none">500+</p>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wide mt-0.5">Agriculteurs actifs</p>
                            </div>
                        </div>
                    </div>

                    {/* texte */}
                    <div>
                        <p className="text-agri-green font-black uppercase tracking-[0.3em] text-xs mb-4">Notre mission</p>
                        <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-6">
                            Pourquoi choisir{' '}
                            <span className="text-agri-green">Vendify</span> ?
                        </h2>

                        <div className="space-y-6 mb-10">
                            {[
                                {
                                    icon: ShieldCheck, color: 'bg-emerald-50 text-agri-green',
                                    title: 'Qualité certifiée',
                                    desc: 'Chaque produit est rigoureusement sélectionné. Traçabilité totale du champ à votre assiette.',
                                },
                                {
                                    icon: Users, color: 'bg-amber-50 text-amber-600',
                                    title: 'Soutien direct aux paysans',
                                    desc: 'Zéro intermédiaire. Les agriculteurs touchent la valeur réelle de leur récolte.',
                                },
                                {
                                    icon: Smartphone, color: 'bg-blue-50 text-blue-600',
                                    title: 'Paiement 100% mobile',
                                    desc: 'Moov Africa ou Yas (T-Money) — payez en quelques secondes sans carte bancaire.',
                                },
                            ].map(({ icon: Icon, color, title, desc }) => (
                                <div key={title} className="flex gap-4">
                                    <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-gray-900 mb-1">{title}</h4>
                                        <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Link
                            to="/register"
                            className="inline-flex items-center gap-2 bg-agri-green text-white px-8 py-4 rounded-2xl font-black hover:bg-[#559140] transition-all shadow-xl shadow-agri-green/30 group"
                        >
                            Rejoindre la plateforme
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>

        {/* ── CTA FINAL ─────────────────────────────────────────────────────── */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="relative bg-agri-green rounded-[3rem] overflow-hidden">
                    {/* décos */}
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-black/10 rounded-full blur-3xl" />

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 px-10 sm:px-16 py-16">
                        <div className="text-center lg:text-left">
                            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tighter leading-tight mb-3">
                                Prêt à consommer<br />
                                <span className="text-white/80">frais et local ?</span>
                            </h2>
                            <p className="text-white/70 text-lg font-medium">
                                Rejoignez des milliers d'acheteurs satisfaits sur Vendify.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
                            <Link
                                to="/catalog"
                                className="inline-flex items-center justify-center gap-2 bg-white text-agri-green px-8 py-4 rounded-2xl font-black text-lg hover:bg-gray-50 transition-all shadow-2xl group"
                            >
                                Voir le catalogue
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center bg-white/15 backdrop-blur text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-white/25 transition-all border border-white/20"
                            >
                                Mon compte
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <Footer />
    </div>
);

export default Home;
