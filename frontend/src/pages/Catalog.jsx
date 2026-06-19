import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, MapPin, ShoppingBag, SlidersHorizontal, ChevronRight, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const Catalog = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        category_id: '',
        locality: '',
        min_price: '',
        max_price: ''
    });
    const { addToCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/categories');
            setCategories(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            Object.keys(filters).forEach(key => {
                if (filters[key]) params.append(key, filters[key]);
            });
            const response = await axios.get(`/products?${params.toString()}`);
            setProducts(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error(err);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const applyFilters = (e) => {
        e.preventDefault();
        fetchProducts();
    };

    return (
        <>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Filters Sidebar */}
                <aside className="w-full md:w-64 space-y-8">
                    <div className="card">
                        <div className="flex items-center gap-2 mb-6 font-bold text-gray-900 border-b border-gray-100 pb-4">
                            <SlidersHorizontal className="w-4 h-4 text-agri-green" />
                            <h3>Filtres</h3>
                        </div>
                        
                        <form onSubmit={applyFilters} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Recherche</label>
                                <div className="relative">
                                    <input 
                                        name="search"
                                        className="input pl-10 text-sm" 
                                        placeholder="Nom du produit..." 
                                        value={filters.search}
                                        onChange={handleFilterChange}
                                    />
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Catégorie</label>
                                <select 
                                    name="category_id"
                                    className="input text-sm"
                                    value={filters.category_id}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Toutes les catégories</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Localité</label>
                                <div className="relative">
                                    <input 
                                        name="locality"
                                        className="input pl-10 text-sm" 
                                        placeholder="Ex: Kara, Pagouda" 
                                        value={filters.locality}
                                        onChange={handleFilterChange}
                                    />
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Prix (FCFA)</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <input 
                                        name="min_price"
                                        type="number" 
                                        className="input text-sm" 
                                        placeholder="Min" 
                                        value={filters.min_price}
                                        onChange={handleFilterChange}
                                    />
                                    <input 
                                        name="max_price"
                                        type="number" 
                                        className="input text-sm" 
                                        placeholder="Max" 
                                        value={filters.max_price}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn-primary w-full shadow-md">
                                Appliquer
                            </button>
                        </form>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Catalogue des produits</h1>
                            <p className="text-gray-500 mt-1">Découvrez les récoltes fraîches de nos agriculteurs locaux</p>
                        </div>
                        <div className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {products.length} produits trouvés
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1,2,3,4,5,6].map(i => (
                                <div key={i} className="card animate-pulse h-80 bg-gray-100 border-none"></div>
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map(product => (
                                <div key={product.id} className="card group hover:shadow-xl transition-all duration-300 overflow-hidden border-none shadow-md flex flex-col p-0">
                                    <div className="relative h-48 bg-gray-200">
                                        {product.image_url ? (
                                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <ShoppingBag className="w-12 h-12" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-sm">
                                            <span className="text-agri-green font-bold text-sm">{product.price} FCFA</span>
                                        </div>
                                        <div className="absolute top-3 left-3 bg-agri-brown/90 backdrop-blur px-2 py-1 rounded-lg shadow-sm text-[10px] uppercase font-bold text-white tracking-widest">
                                            {product.category?.name || 'Général'}
                                        </div>
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-gray-900 text-lg group-hover:text-agri-green transition-colors">{product.name}</h3>
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-500 text-xs mb-4 font-medium">
                                            <MapPin className="w-3 h-3 text-agri-red" />
                                            <span>{product.locality}</span>
                                            <span className="mx-1">•</span>
                                            <span>Par {product.user?.name}</span>
                                            {user && user.id !== product.user?.id && (
                                                <button 
                                                    onClick={() => navigate('/messages', { state: { targetUser: product.user, product_id: product.id } })}
                                                    className="ml-auto flex items-center gap-1 text-agri-green bg-agri-green/10 px-2 py-1 rounded-full hover:bg-agri-green hover:text-white transition-colors"
                                                    title="Discuter avec l'agriculteur"
                                                >
                                                    <MessageCircle className="w-3 h-3" />
                                                    <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider">Discuter</span>
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">{product.description}</p>
                                        
                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                            <div className="text-xs font-bold">
                                                <span className="text-gray-400">Stock: </span>
                                                <span className={product.quantity > 5 ? 'text-emerald-600' : 'text-orange-500'}>{product.quantity} kg</span>
                                            </div>
                                            <button 
                                                onClick={() => addToCart(product)}
                                                className="bg-agri-green text-white p-2 rounded-lg hover:bg-emerald-600 shadow-md shadow-agri-green/20 transition-all hover:-translate-y-1"
                                            >
                                                <ShoppingBag className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="card text-center py-20 bg-white/50">
                            <div className="p-4 bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                                <Search className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Aucun produit trouvé</h3>
                            <p className="text-gray-500 max-w-xs mx-auto mt-2">Essayez d'ajuster vos filtres ou de faire une autre recherche.</p>
                            <button onClick={() => setFilters({search:'', category_id:'', locality:'', min_price:'', max_price:''})} className="mt-6 text-agri-green font-bold flex items-center gap-2 mx-auto hover:underline">
                                Réinitialiser les filtres <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
        <Footer />
        </>
    );
};

export default Catalog;
