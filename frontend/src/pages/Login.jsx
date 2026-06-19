import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const loggedUser = await login(email, password);
            if (email === 'admin@agrikara.com' || (loggedUser && (loggedUser.role === 'admin' || loggedUser.role === 'agriculteur'))) {
                navigate('/dashboard');
            } else {
                navigate('/catalog');
            }
        } catch (err) {
            setError("Email ou mot de passe incorrect.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center">
                    <div className="flex justify-center">
                        <div className="p-3 bg-agri-green/10 rounded-full">
                            <Leaf className="h-10 w-10 text-agri-green" />
                        </div>
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        Bienvenue
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">Connectez-vous à votre compte Vendify</p>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm text-center font-medium">
                            {error}
                        </div>
                    )}
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="jean@example.com"
                                className="input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="flex justify-between items-center text-sm font-semibold text-gray-700 mb-1">
                                <span>Mot de passe</span>
                                <Link to="/forgot-password" className="text-xs font-normal text-agri-green hover:underline">Mot de passe oublié ?</Link>
                            </label>
                            <input
                                name="password"
                                type="password"
                                required
                                placeholder="••••••••"
                                className="input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary w-full py-3 shadow-md">
                        Se connecter
                    </button>
                </form>

                <div className="text-center pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                        Pas encore de compte ?{' '}
                        <Link to="/register" className="font-bold text-agri-green hover:text-emerald-700">
                            S'inscrire gratuitement
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
