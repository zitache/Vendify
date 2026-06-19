import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Package, Plus, Edit2, Trash2, MapPin, Tag, ShoppingBag, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchMyProducts();
    }, [user]);

    const fetchMyProducts = async () => {
        if (!user) return;
        try {
            const response = await axios.get('/products?include_unavailable=1');
            setProducts(response.data.filter(p => p.user_id === user.id));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Voulez-vous vraiment supprimer ce produit ?')) return;
        try {
            await axios.delete(`/products/${id}`);
            setProducts(products.filter(p => p.id !== id));
        } catch (err) {
            alert('Erreur lors de la suppression');
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Mon Catalogue</h1>
                    <p className="text-gray-500 font-medium">Gérez vos produits mis en vente sur la plateforme.</p>
                </div>
                <Link to="/farmer/products/new" className="btn-primary flex items-center gap-2 shadow-xl shadow-agri-green/20">
                    <Plus className="w-5 h-5" />
                    Nouveau produit
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-20 font-bold text-gray-400">Chargement de vos produits...</div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map(product => (
                        <div key={product.id} className="card p-0 overflow-hidden border-none shadow-xl shadow-gray-100 group">
                            <div className="relative h-48 bg-gray-100">
                                {product.image_url ? (
                                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <Package className="w-12 h-12" />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-agri-green shadow-sm">
                                    {product.category?.name || 'Général'}
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">{product.name}</h3>
                                        <div className="flex items-center gap-1 text-xs text-gray-400 font-bold uppercase tracking-tighter">
                                            <MapPin className="w-3 h-3 text-agri-red" />
                                            {product.locality}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-black text-agri-green leading-none">{product.price}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">FCFA / kg</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-4 mb-6 flex justify-between items-center border border-gray-50">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stock Disponible</p>
                                        <p className={`text-lg font-black ${product.quantity > 0 ? 'text-gray-900' : 'text-agri-red'}`}>
                                            {product.quantity} kg
                                        </p>
                                    </div>
                                    <div className={`w-3 h-3 rounded-full ${product.quantity > 0 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`}></div>
                                </div>

                                <div className="flex gap-2">
                                    <Link to={`/farmer/products/${product.id}/edit`} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
                                        <Edit2 className="w-4 h-4" />
                                        Modifier
                                    </Link>
                                    <button 
                                        onClick={() => handleDelete(product.id)}
                                        className="bg-red-50 text-agri-red p-3 rounded-xl hover:bg-agri-red hover:text-white transition-all shadow-sm"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card text-center py-24 bg-gray-50/50 border-dashed border-2 border-gray-200">
                    <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="w-10 h-10 text-gray-200" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">Aucun produit en vente</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mb-8 font-medium">Commencez par ajouter votre premier produit pour qu'il apparaisse dans le catalogue public.</p>
                    <Link to="/farmer/products/new" className="btn-primary inline-flex items-center gap-2 px-8">
                        <Plus className="w-5 h-5" />
                        Publier mon premier produit
                    </Link>
                </div>
            )}
        </div>
    );
};

export default MyProducts;
