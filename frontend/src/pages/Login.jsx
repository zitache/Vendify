import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, Eye, EyeOff } from 'lucide-react';

const BG = 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&q=90';

const glassInput = "w-full bg-white/15 border border-white/25 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-agri-green/60 placeholder-white/30";

const Login = () => {
    const [email,        setEmail]        = useState('');
    const [password,     setPassword]     = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error,        setError]        = useState('');

    const { login } = useAuth();
    const navigate  = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const loggedUser = await login(email, password);
            if (loggedUser?.role === 'admin' || loggedUser?.role === 'agriculteur') {
                navigate('/dashboard');
            } else {
                navigate('/catalog');
            }
        } catch {
            setError('Email ou mot de passe incorrect.');
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center py-6 px-4 overflow-hidden">

            {/* Fond flouté */}
            <img
                src={BG} alt=""
                className="absolute inset-0 w-full h-full object-cover scale-110 blur-sm"
            />
            <div className="absolute inset-0 bg-black/50" />

            {/* Carte verre */}
            <div className="relative z-10 w-full max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">

                <div className="text-center mb-7">
                    <div className="inline-flex p-3 bg-white/15 rounded-2xl mb-3">
                        <Leaf className="h-8 w-8 text-agri-green" />
                    </div>
                    <h1 className="text-2xl font-black text-white">Bienvenue</h1>
                    <p className="text-sm text-white/50 mt-1">Connectez-vous à votre compte</p>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-400/40 text-red-200 p-3 rounded-xl text-sm text-center font-medium mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-white/80 mb-1.5">Email</label>
                        <input
                            type="email"
                            required
                            className={glassInput}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="flex justify-between items-center text-sm font-semibold text-white/80 mb-1.5">
                            <span>Mot de passe</span>
                            <Link to="/forgot-password" className="text-xs font-normal text-agri-green hover:text-emerald-400">
                                Mot de passe oublié ?
                            </Link>
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                className={`${glassInput} pr-10`}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80"
                                onClick={() => setShowPassword((v) => !v)}
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary w-full py-3 mt-1 shadow-lg shadow-agri-green/30">
                        Se connecter
                    </button>
                </form>

                <p className="text-center text-sm text-white/40 mt-6 pt-5 border-t border-white/10">
                    Pas encore de compte ?{' '}
                    <Link to="/register" className="font-bold text-agri-green hover:text-emerald-400">
                        S'inscrire gratuitement
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
