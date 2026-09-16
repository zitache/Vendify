import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, Eye, EyeOff, Check, X } from 'lucide-react';

const BG       = 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&q=90';
const LOCALITES = ['Kozah', 'Assoli', 'Binah'];

const gi = "w-full bg-white/15 border border-white/25 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-agri-green/60";
const gl = "block text-sm font-semibold text-white/80 mb-1.5";

const pwdRules = (pwd) => ({
    length: pwd.length >= 8,
    number: /\d/.test(pwd),
    symbol: /[^a-zA-Z0-9]/.test(pwd),
});

const Register = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', locality: '',
        password: '', password_confirmation: '',
        role: 'acheteur', cooperative_name: '', cooperative_email: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm,  setShowConfirm]  = useState(false);
    const [fieldErrors,  setFieldErrors]  = useState({});
    const [error,        setError]        = useState('');
    const [pwdFocused,   setPwdFocused]   = useState(false);

    const { register } = useAuth();
    const navigate     = useNavigate();
    const rules        = pwdRules(formData.password);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFieldErrors((p) => ({ ...p, [name]: '' }));
        setFormData((p) => ({ ...p, [name]: value }));
    };

    const handleName = (e) => {
        const clean = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s\-]/g, '');
        setFieldErrors((p) => ({ ...p, name: '' }));
        setFormData((p) => ({ ...p, name: clean }));
    };

    const handlePhone = (e) => {
        const clean = e.target.value.replace(/\D/g, '').slice(0, 8);
        setFieldErrors((p) => ({ ...p, phone: '' }));
        setFormData((p) => ({ ...p, phone: clean }));
    };

    const validate = () => {
        const errs = {};
        if (!formData.name.trim())   errs.name  = 'Le nom est requis.';
        if (formData.phone.length !== 8) errs.phone = 'Exactement 8 chiffres requis.';
        if (!rules.length || !rules.number || !rules.symbol)
            errs.password = 'Le mot de passe ne respecte pas les critères.';
        if (formData.password !== formData.password_confirmation)
            errs.password_confirmation = 'Les mots de passe ne correspondent pas.';
        if (!formData.locality) errs.locality = 'Choisissez une localité.';
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const errs = validate();
        if (Object.keys(errs).length) { setFieldErrors(errs); return; }
        try {
            await register(formData);
            navigate('/catalog');
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de l'inscription.");
        }
    };

    const errClass = (field) => fieldErrors[field] ? 'border-red-400/70' : '';

    return (
        <div className="relative min-h-screen flex items-center justify-center py-6 px-4 overflow-hidden">

            {/* Fond flouté */}
            <img src={BG} alt="" className="absolute inset-0 w-full h-full object-cover scale-110 blur-sm" />
            <div className="absolute inset-0 bg-black/50" />

            {/* Carte verre */}
            <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">

                {/* Logo */}
                <div className="text-center mb-6">
                    <div className="inline-flex p-3 bg-white/15 rounded-2xl mb-3">
                        <Leaf className="h-8 w-8 text-agri-green" />
                    </div>
                    <h2 className="text-2xl font-black text-white">Créer un compte</h2>
                    <p className="text-sm text-white/50 mt-1">Rejoignez la communauté Vendify</p>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-400/40 text-red-200 p-3 rounded-xl text-sm text-center font-medium mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Nom */}
                    <div>
                        <label className={gl}>Nom complet</label>
                        <input
                            name="name" type="text" required
                            className={`${gi} ${errClass('name')}`}
                            value={formData.name} onChange={handleName}
                        />
                        {fieldErrors.name
                            ? <p className="text-red-300 text-xs mt-1">{fieldErrors.name}</p>
                            : <p className="text-white/30 text-xs mt-1">Lettres uniquement</p>}
                    </div>

                    {/* Email + Téléphone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={gl}>Email</label>
                            <input
                                name="email" type="email" required
                                className={gi}
                                value={formData.email} onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className={gl}>Téléphone</label>
                            <div className="flex">
                                <span className="flex items-center px-3 bg-white/10 border border-r-0 border-white/25 rounded-l-xl text-sm font-bold text-white/60">
                                    +228
                                </span>
                                <input
                                    name="phone" type="tel" required maxLength={8}
                                    className={`${gi} rounded-l-none flex-1 ${errClass('phone')}`}
                                    value={formData.phone} onChange={handlePhone}
                                />
                            </div>
                            {fieldErrors.phone
                                ? <p className="text-red-300 text-xs mt-1">{fieldErrors.phone}</p>
                                : <p className="text-white/30 text-xs mt-1">{formData.phone.length}/8 chiffres</p>}
                        </div>
                    </div>

                    {/* Localité */}
                    <div>
                        <label className={gl}>Localité</label>
                        <select
                            name="locality" required
                            className={`${gi} ${errClass('locality')}`}
                            value={formData.locality} onChange={handleChange}
                            style={{ colorScheme: 'dark' }}
                        >
                            <option value="" className="bg-gray-800">Choisir une localité…</option>
                            {LOCALITES.map((l) => (
                                <option key={l} value={l} className="bg-gray-800">{l}</option>
                            ))}
                        </select>
                        {fieldErrors.locality && (
                            <p className="text-red-300 text-xs mt-1">{fieldErrors.locality}</p>
                        )}
                    </div>

                    {/* Mot de passe */}
                    <div>
                        <label className={gl}>Mot de passe</label>
                        <div className="relative">
                            <input
                                name="password"
                                type={showPassword ? 'text' : 'password'} required
                                className={`${gi} pr-10 ${errClass('password')}`}
                                value={formData.password} onChange={handleChange}
                                onFocus={() => setPwdFocused(true)}
                                onBlur={() => setPwdFocused(false)}
                            />
                            <button type="button" tabIndex={-1}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80"
                                onClick={() => setShowPassword((v) => !v)}
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        {(pwdFocused || formData.password) && (
                            <div className="mt-2 space-y-1 p-3 bg-white/5 rounded-xl border border-white/10">
                                {[
                                    { ok: rules.length, label: '8 caractères minimum' },
                                    { ok: rules.number, label: 'Au moins un chiffre' },
                                    { ok: rules.symbol, label: 'Au moins un symbole' },
                                ].map(({ ok, label }) => (
                                    <div key={label} className="flex items-center gap-2 text-xs">
                                        {ok
                                            ? <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                                            : <X    className="w-3.5 h-3.5 text-white/25 flex-shrink-0" />}
                                        <span className={ok ? 'text-emerald-400' : 'text-white/40'}>{label}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        {fieldErrors.password && (
                            <p className="text-red-300 text-xs mt-1">{fieldErrors.password}</p>
                        )}
                    </div>

                    {/* Confirmation */}
                    <div>
                        <label className={gl}>Confirmation du mot de passe</label>
                        <div className="relative">
                            <input
                                name="password_confirmation"
                                type={showConfirm ? 'text' : 'password'} required
                                className={`${gi} pr-10 ${errClass('password_confirmation')}`}
                                value={formData.password_confirmation} onChange={handleChange}
                            />
                            <button type="button" tabIndex={-1}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80"
                                onClick={() => setShowConfirm((v) => !v)}
                            >
                                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {fieldErrors.password_confirmation && (
                            <p className="text-red-300 text-xs mt-1">{fieldErrors.password_confirmation}</p>
                        )}
                    </div>

                    {/* Rôle */}
                    <div>
                        <label className={gl}>Type de compte</label>
                        <select
                            name="role" className={gi}
                            value={formData.role} onChange={handleChange}
                            style={{ colorScheme: 'dark' }}
                        >
                            <option value="acheteur"    className="bg-gray-800">Acheteur</option>
                            <option value="agriculteur" className="bg-gray-800">Agriculteur</option>
                        </select>
                    </div>

                    {/* Coopérative */}
                    {formData.role === 'agriculteur' && (
                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                            <h4 className="text-sm font-bold text-white/70">
                                Coopérative <span className="font-normal text-white/30">(optionnel)</span>
                            </h4>
                            <div>
                                <label className={gl}>Nom de la coopérative</label>
                                <input
                                    name="cooperative_name" type="text"
                                    className={gi}
                                    value={formData.cooperative_name} onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className={gl}>Email de la coopérative</label>
                                <input
                                    name="cooperative_email" type="email"
                                    className={gi}
                                    value={formData.cooperative_email} onChange={handleChange}
                                />
                            </div>
                        </div>
                    )}

                    <button type="submit" className="btn-primary w-full py-3 shadow-lg shadow-agri-green/30">
                        S'inscrire
                    </button>
                </form>

                <p className="text-center text-sm text-white/40 mt-5 pt-5 border-t border-white/10">
                    Déjà inscrit ?{' '}
                    <Link to="/login" className="font-bold text-agri-green hover:text-emerald-400">
                        Se connecter
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
