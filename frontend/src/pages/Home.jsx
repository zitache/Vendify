import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, TrendingUp, MapPin, Users, ShoppingBag } from 'lucide-react';
import Footer from '../components/Footer';

const heroImage = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&q=90';

const Home = () => {
    return (
        <div className="bg-white overflow-x-hidden">
            {/* Hero Section */}
            <div className="relative bg-agri-green py-12 lg:py-20 overflow-hidden">
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-agri-brown/10 rounded-full blur-3xl"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
                        <div className="text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-widest mb-6 border border-white/30 animate-bounce">
                                <MapPin className="w-3 h-3" />
                                Région de la Kara, Togo
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tighter mb-8">
                                Du champ à <span className="text-agri-brown">votre table</span> en un clic.
                            </h1>
                            <p className="text-xl text-emerald-50 sm:max-w-xl sm:mx-auto lg:mx-0 mb-10 font-medium leading-relaxed">
                                Vendify révolutionne la vente agricole au Togo. Nous connectons directement les petits producteurs aux acheteurs pour des prix justes et des produits frais.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link to="/catalog" className="bg-white text-agri-green px-10 py-5 rounded-2xl font-black text-lg hover:bg-emerald-50 transition-all shadow-2xl shadow-emerald-900/20 flex items-center justify-center gap-2 group">
                                    Acheter maintenant
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link to="/register" className="bg-agri-brown text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-amber-900 transition-all border border-white/10 flex items-center justify-center gap-2">
                                    Vendre ma récolte
                                </Link>
                            </div>
                            
                            <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-white/80">
                                <div className="text-center">
                                    <p className="text-2xl font-black text-white">500+</p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest">Agriculteurs</p>
                                </div>
                                <div className="w-px h-8 bg-white/20"></div>
                                <div className="text-center">
                                    <p className="text-2xl font-black text-white">2k+</p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest">Commandes</p>
                                </div>
                                <div className="w-px h-8 bg-white/20"></div>
                                <div className="text-center">
                                    <p className="text-2xl font-black text-white">100%</p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest">Qualité Bio</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="hidden lg:block relative">
                            <div className="relative z-10 bg-white/10 p-4 rounded-[3rem] border border-white/20 shadow-2xl">
                                <div className="bg-white rounded-[2.5rem] overflow-hidden aspect-square shadow-inner">
                                    <img src={heroImage} alt="Agriculture Kara" className="w-full h-full object-cover" />
                                </div>
                            </div>
                            {/* Stats Card Overlay */}
                            <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 flex items-center gap-4 animate-bounce">
                                <div className="p-3 bg-agri-green/10 rounded-2xl">
                                    <TrendingUp className="w-6 h-6 text-agri-green" />
                                </div>
                    
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-agri-red font-black uppercase tracking-[0.3em] text-sm mb-4">L'Agriculture Moderne</h2>
                        <p className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                            Pourquoi choisir la plateforme <span className="text-agri-green">Vendify</span> ?
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="group">
                            <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center mb-8 group-hover:bg-agri-green transition-all duration-500 group-hover:rotate-6 shadow-sm">
                                <ShieldCheck className="w-10 h-10 text-agri-green group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight italic">Qualité Certifiée</h3>
                            <p className="text-gray-500 font-medium leading-relaxed">
                                Tous nos produits sont rigoureusement sélectionnés. Traçabilité totale depuis les champs de la Kara jusqu'à votre panier.
                            </p>
                        </div>

                        <div className="group">
                            <div className="w-20 h-20 bg-orange-50 rounded-[2rem] flex items-center justify-center mb-8 group-hover:bg-agri-brown transition-all duration-500 group-hover:-rotate-6 shadow-sm">
                                <Users className="w-10 h-10 text-agri-brown group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight italic">Soutien aux Paysans</h3>
                            <p className="text-gray-500 font-medium leading-relaxed">
                                En supprimant les intermédiaires, vous permettez aux agriculteurs de percevoir l'intégralité de la valeur de leur travail.
                            </p>
                        </div>

                        <div className="group">
                            <div className="w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center mb-8 group-hover:bg-agri-red transition-all duration-500 group-hover:rotate-6 shadow-sm">
                                <ShoppingBag className="w-10 h-10 text-agri-red group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight italic">Paiement Mobile Simple</h3>
                            <p className="text-gray-500 font-medium leading-relaxed">
                                Pas besoin de carte bancaire. Payez vos achats en toute sécurité via Yas ou Moov Africa en quelques secondes.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* CTA Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <div className="bg-gray-900 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-agri-green/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">Prêt à consommer <span className="text-agri-green">frais et local</span> ?</h2>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/catalog" className="btn-primary py-5 px-12 text-xl shadow-2xl shadow-agri-green/40">Parcourir le catalogue</Link>
                            <Link to="/login" className="bg-white/10 backdrop-blur-md text-white py-5 px-12 text-xl font-black rounded-2xl hover:bg-white/20 transition-all border border-white/10">Accéder à mon compte</Link>
                        </div>
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
};

export default Home;
