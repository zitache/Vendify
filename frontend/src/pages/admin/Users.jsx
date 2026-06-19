import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Users, Trash2, Shield, User, Search, MapPin, Mail, Phone } from 'lucide-react';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/admin/users');
            setUsers(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Supprimer cet utilisateur ?')) return;
        try {
            await axios.delete(`/admin/users/${id}`);
            setUsers(users.filter(u => u.id !== id));
        } catch (err) {
            alert(err.response?.data?.message || 'Erreur lors de la suppression');
        }
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(search.toLowerCase()) || 
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <Users className="w-8 h-8 text-agri-green" />
                        Gestion des utilisateurs
                    </h1>
                    <p className="text-gray-500 font-medium">Modérez et gérez tous les comptes de la plateforme.</p>
                </div>
                
                <div className="relative w-full md:w-80">
                    <input 
                        className="input pl-10" 
                        placeholder="Rechercher par nom ou email..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 font-bold text-gray-400">Chargement des utilisateurs...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUsers.map(user => (
                        <div key={user.id} className="card relative group border-none shadow-xl shadow-gray-100 hover:shadow-2xl transition-all duration-300">
                            <div className={`absolute top-4 right-4 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight ${
                                user.role === 'admin' ? 'bg-agri-red text-white' : 
                                user.role === 'agriculteur' ? 'bg-agri-green text-white' : 'bg-agri-brown text-white'
                            }`}>
                                {user.role}
                            </div>
                            
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 overflow-hidden shadow-sm">
                                    {user.photo ? <img src={user.photo} className="w-full h-full object-cover" /> : <User className="w-8 h-8 text-gray-300" />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 leading-tight">{user.name}</h3>
                                    <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                                        <Mail className="w-3 h-3" />
                                        {user.email}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-gray-50">
                                <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                    <Phone className="w-4 h-4 text-gray-300" />
                                    {user.phone || 'Non renseigné'}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                    <MapPin className="w-4 h-4 text-gray-300" />
                                    {user.locality || 'Non renseignée'}
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-50 flex justify-end">
                                {user.role !== 'admin' && (
                                    <button 
                                        onClick={() => handleDelete(user.id)}
                                        className="p-3 text-gray-300 hover:text-agri-red hover:bg-red-50 rounded-xl transition-all"
                                        title="Supprimer le compte"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                )}
                                <button className="p-3 text-gray-300 hover:text-agri-green hover:bg-emerald-50 rounded-xl transition-all" title="Détails">
                                    <Shield className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
