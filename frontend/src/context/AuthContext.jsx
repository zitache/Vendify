import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.get('/me')
                .then(res => setUser(res.data))
                .catch(() => localStorage.removeItem('token'))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/login', { email, password });
        localStorage.setItem('token', res.data.access_token);
        setUser(res.data.user);
        return res.data.user;
    };

    const register = async (formData) => {
        const res = await api.post('/register', formData);
        localStorage.setItem('token', res.data.access_token);
        setUser(res.data.user);
        return res.data.user;
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (_) {}
        localStorage.removeItem('token');
        localStorage.removeItem('vendify_cart');
        window.location.href = '/login';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-agri-green border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
