import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../api/axios';
import { Package, MapPin, Tag, DollarSign, Scale, Image as ImageIcon, Save } from 'lucide-react';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
        category_id: '',
        locality: '',
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
        if (id) fetchProduct();
    }, [id]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/categories');
            setCategories(response.data);
        } catch (err) { console.error(err); }
    };

    const fetchProduct = async () => {
        try {
            const response = await axios.get(`/products/${id}`);
            const p = response.data;
            setFormData({
                name: p.name || '',
                description: p.description || '',
                price: p.price || '',
                quantity: p.quantity || '',
                category_id: p.category_id || '',
                locality: p.locality || '',
            });
            if (p.image_url) setImagePreview(p.image_url);
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (image) data.append('image', image);

        try {
            if (id) {
                await axios.post(`/products/${id}?_method=PUT`, data);
            } else {
                await axios.post('/products', data);
            }
            navigate('/farmer/products');
        } catch (err) {
            alert('Erreur lors de l\'enregistrement');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="card p-10 border-none shadow-2xl shadow-gray-200/50">
                <div className="flex items-center gap-4 mb-10 border-b border-gray-50 pb-6">
                    <div className="p-3 bg-agri-green/10 rounded-2xl">
                        <Package className="w-8 h-8 text-agri-green" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">{id ? 'Modifier le produit' : 'Nouveau produit'}</h1>
                        <p className="text-gray-500 font-medium">Renseignez les détails de votre récolte pour la mettre en vente.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest text-[10px]">Nom du produit</label>
                            <input 
                                className="input py-4 text-lg font-bold" 
                                placeholder="Ex: Igname de la Kara, Maïs Bio..." 
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest text-[10px]">Catégorie</label>
                                <div className="relative">
                                    <select 
                                        className="input appearance-none" 
                                        value={formData.category_id}
                                        onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                                        required
                                    >
                                        <option value="">Choisir une catégorie</option>
                                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                    </select>
                                    <Tag className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest text-[10px]">Localité</label>
                                <div className="relative">
                                    <input 
                                        className="input pl-10" 
                                        placeholder="Ville ou Village" 
                                        value={formData.locality}
                                        onChange={(e) => setFormData({...formData, locality: e.target.value})}
                                        required
                                    />
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-agri-red" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest text-[10px]">Prix (FCFA / kg)</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        className="input pl-10 font-black text-agri-green" 
                                        placeholder="0" 
                                        value={formData.price}
                                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                                        required
                                    />
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-agri-green" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest text-[10px]">Quantité en stock (kg)</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        className="input pl-10 font-black text-agri-brown" 
                                        placeholder="0" 
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                                        required
                                    />
                                    <Scale className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-agri-brown" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest text-[10px]">Description détaillée</label>
                            <textarea 
                                className="input min-h-[120px] py-4" 
                                placeholder="Décrivez la qualité, le mode de culture, etc." 
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest text-[10px]">Photo du produit</label>
                            <label className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer overflow-hidden group relative" style={{ minHeight: '180px' }}>
                                {imagePreview ? (
                                    <>
                                        <img src={imagePreview} alt="Aperçu" className="w-full h-48 object-cover rounded-2xl" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                                            <p className="text-white font-bold text-sm flex items-center gap-2">
                                                <ImageIcon className="w-5 h-5" /> Changer l'image
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-2 text-center py-8 px-6">
                                        <ImageIcon className="mx-auto h-12 w-12 text-gray-300 group-hover:text-agri-green transition-colors" />
                                        <p className="text-sm font-bold text-agri-green">Cliquer pour télécharger</p>
                                        <p className="text-xs text-gray-400">PNG, JPG, WebP — max 2 Mo</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    className="sr-only"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;
                                        setImage(file);
                                        setImagePreview(URL.createObjectURL(file));
                                    }}
                                />
                            </label>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn-primary w-full py-5 text-xl flex items-center justify-center gap-3 shadow-2xl shadow-agri-green/30"
                    >
                        <Save className="w-6 h-6" />
                        {loading ? 'Enregistrement en cours...' : (id ? 'Enregistrer les modifications' : 'Publier le produit')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
