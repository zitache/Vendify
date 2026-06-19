import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Camera, Lock, Save } from 'lucide-react';
import axios from '../api/axios';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        locality: user?.locality || '',
    });
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        password: '',
        password_confirmation: '',
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(user?.photo || null);
    const [photoLoading, setPhotoLoading] = useState(false);

    const handleInfoChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Aperçu immédiat
        setPhotoPreview(URL.createObjectURL(file));

        // Upload
        setPhotoLoading(true);
        try {
            const data = new FormData();
            data.append('photo', file);
            const response = await axios.post('/profile/photo', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setUser(response.data.user);
            setStatus({ type: 'success', message: 'Photo mise à jour avec succès' });
        } catch (err) {
            setStatus({ type: 'error', message: 'Erreur lors du téléchargement de la photo' });
            setPhotoPreview(user?.photo || null);
        } finally {
            setPhotoLoading(false);
        }
    };

    const handleUpdateInfo = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.put('/profile', formData);
            setUser(response.data.user);
            setStatus({ type: 'success', message: 'Profil mis à jour avec succès' });
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.message || 'Erreur lors de la mise à jour' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put('/profile/password', passwordData);
            setStatus({ type: 'success', message: 'Mot de passe mis à jour avec succès' });
            setPasswordData({ current_password: '', password: '', password_confirmation: '' });
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.message || 'Erreur lors de la mise à jour du mot de passe' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon Profil</h1>

            {status.message && (
                <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    <div className={`w-2 h-2 rounded-full ${status.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <p className="font-medium">{status.message}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Avatar Section */}
                <div className="card text-center space-y-4">
                    <div className="relative inline-block mx-auto">
                        <div className="w-32 h-32 rounded-full bg-agri-green/10 flex items-center justify-center border-4 border-white shadow-md overflow-hidden">
                            {photoPreview ? (
                                <img src={photoPreview} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-16 h-16 text-agri-green" />
                            )}
                        </div>
                        <label className={`absolute bottom-1 right-1 p-2 bg-agri-green text-white rounded-full shadow-lg cursor-pointer hover:bg-[#559140] transition-colors ${photoLoading ? 'opacity-60 cursor-wait' : ''}`}>
                            <Camera className="w-4 h-4" />
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                disabled={photoLoading}
                            />
                        </label>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                        <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mt-1">
                            {user?.role === 'agriculteur' ? 'Producteur Agricole' : 'Acheteur'}
                        </p>
                        {photoLoading && <p className="text-xs text-agri-green mt-2 font-medium">Téléchargement...</p>}
                    </div>
                </div>

                {/* Info Section */}
                <div className="md:col-span-2 space-y-8">
                    <div className="card">
                        <div className="flex items-center gap-2 mb-6 text-gray-900 font-bold text-lg">
                            <User className="w-5 h-5 text-agri-green" />
                            <h3>Informations Personnelles</h3>
                        </div>
                        <form onSubmit={handleUpdateInfo} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                                    <input name="name" className="input" value={formData.name} onChange={handleInfoChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input name="email" type="email" className="input" value={formData.email} onChange={handleInfoChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                                    <input name="phone" className="input" value={formData.phone} onChange={handleInfoChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Localité</label>
                                    <input name="locality" className="input" value={formData.locality} onChange={handleInfoChange} />
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end">
                                <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                                    <Save className="w-4 h-4" />
                                    {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="card">
                        <div className="flex items-center gap-2 mb-6 text-gray-900 font-bold text-lg">
                            <Lock className="w-5 h-5 text-agri-red" />
                            <h3>Sécurité</h3>
                        </div>
                        <form onSubmit={handleUpdatePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
                                <input name="current_password" type="password" className="input" value={passwordData.current_password} onChange={handlePasswordChange} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                                    <input name="password" type="password" className="input" value={passwordData.password} onChange={handlePasswordChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
                                    <input name="password_confirmation" type="password" className="input" value={passwordData.password_confirmation} onChange={handlePasswordChange} />
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end">
                                <button type="submit" disabled={loading} className="btn-secondary flex items-center gap-2 shadow-sm">
                                    <Lock className="w-4 h-4" />
                                    {loading ? 'Traitement...' : 'Mettre à jour le mot de passe'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
