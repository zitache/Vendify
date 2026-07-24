import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 pt-20 pb-10 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="bg-agri-green/20 p-2 rounded-xl">
                                <Leaf className="h-7 w-7 text-agri-green" />
                            </div>
                            <span className="font-extrabold text-2xl text-white tracking-tighter">Vendify</span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            La première plateforme de vente directe de produits agricoles de la région de la Kara, Togo. Du producteur au consommateur, sans intermédiaire.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-agri-green hover:text-white font-bold transition-colors">
                                f
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-agri-green hover:text-white font-bold transition-colors">
                                X
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-agri-green hover:text-white font-bold transition-colors">
                                in
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold mb-6 text-lg tracking-tight">Liens rapides</h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link to="/" className="hover:text-agri-green transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-agri-green rounded-full"></span> Accueil</Link></li>
                            <li><Link to="/catalog" className="hover:text-agri-green transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-agri-green rounded-full"></span> Catalogue</Link></li>
                            <li><Link to="/register" className="hover:text-agri-green transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-agri-green rounded-full"></span> Devenir vendeur</Link></li>
                            <li><Link to="/login" className="hover:text-agri-green transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-agri-green rounded-full"></span> Mon compte</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-white font-bold mb-6 text-lg tracking-tight">Informations</h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-agri-green transition-colors">À propos de Vendify</a></li>
                            <li><a href="#" className="hover:text-agri-green transition-colors">Conditions générales d'utilisation</a></li>
                            <li><a href="#" className="hover:text-agri-green transition-colors">Politique de confidentialité</a></li>
                            <li><a href="#" className="hover:text-agri-green transition-colors">Paiement sécurisé</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-bold mb-6 text-lg tracking-tight">Contactez-nous</h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex items-start gap-3">
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-agri-green flex-shrink-0" />
                                <span>+228 90 00 00 00</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-agri-green flex-shrink-0" />
                                <span>contact@vendify.tg</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-500 font-medium flex flex-col md:flex-row justify-between items-center gap-4">
                    <p>&copy; {new Date().getFullYear()} Vendify (AgriKara). Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
