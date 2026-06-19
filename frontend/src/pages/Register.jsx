import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        locality: '',
        password: '',
        password_confirmation: '',
        role: 'acheteur',
        cooperative_name: '',
        cooperative_email: ''
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(formData);
            navigate('/catalog');
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de l'inscription. Vérifiez vos informations.");
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
                        Créer un compte
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">Rejoignez la communauté Vendify</p>
                </div>
                
                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm text-center font-medium">
                            {error}
                        </div>
                    )}
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Nom complet</label>
                            <input
                                name="name"
                                type="text"
                                required
                                placeholder="Jean Dupont"
                                className="input"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="jean@example.com"
                                    className="input"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Téléphone</label>
                                <input
                                    name="phone"
                                    type="text"
                                    required
                                    placeholder="+228 90 00 00 00"
                                    className="input"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Localité (Ville/Village)</label>
                            <input
                                name="locality"
                                type="text"
                                required
                                placeholder="Kara, Togo"
                                className="input"
                                value={formData.locality}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Mot de passe</label>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="input"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Confirmation</label>
                                <input
                                    name="password_confirmation"
                                    type="password"
                                    required
                                    className="input"
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Type de compte</label>
                            <select
                                name="role"
                                className="input"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="acheteur">Acheteur (Je veux acheter)</option>
                                <option value="agriculteur">Agriculteur (Je veux vendre)</option>
                            </select>
                        </div>

                        {formData.role === 'agriculteur' && (
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-4">
                                <h4 className="text-sm font-bold text-gray-900 mb-2">Informations de Coopérative (Optionnel)</h4>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nom de la coopérative</label>
                                    <input
                                        name="cooperative_name"
                                        type="text"
                                        placeholder="Ex: Coopérative Les Paysans"
                                        className="input"
                                        value={formData.cooperative_name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email de la coopérative</label>
                                    <input
                                        name="cooperative_email"
                                        type="email"
                                        placeholder="contact@cooperative.com"
                                        className="input"
                                        value={formData.cooperative_email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <button type="submit" className="btn-primary w-full py-3 shadow-md">
                        S'inscrire
                    </button>
                </form>

                <div className="text-center pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                        Déjà inscrit ?{' '}
                        <Link to="/login" className="font-bold text-agri-green hover:text-emerald-700">
                            Se connecter
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
