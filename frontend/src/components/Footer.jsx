import React from 'react';
import { UtensilsCrossed, Globe, Share2, Rss, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="bg-blue-600 text-white p-2 rounded-xl">
                                <UtensilsCrossed size={20} />
                            </div>
                            <span className="font-extrabold text-xl text-white">CariMakan</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Platform pencarian resep dan makanan terlengkap. Temukan inspirasi memasak dari seluruh dunia.
                        </p>
                    </div>

                    {/* Tautan */}
                    <div>
                        <h3 className="font-bold text-white mb-4">Tautan Cepat</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/" className="text-slate-400 hover:text-blue-400 transition-colors">Beranda</Link></li>
                            <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Semua Kategori</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Resep Populer</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Tentang Kami</a></li>
                        </ul>
                    </div>

                    {/* Sosial Media */}
                    <div>
                        <h3 className="font-bold text-white mb-4">Ikuti Kami</h3>
                        <div className="flex gap-3">
                            <a href="#" className="bg-slate-800 p-2.5 rounded-xl hover:bg-pink-600 transition-colors" title="Instagram">
                                <Globe size={18} />
                            </a>
                            <a href="#" className="bg-slate-800 p-2.5 rounded-xl hover:bg-sky-500 transition-colors" title="Twitter">
                                <Share2 size={18} />
                            </a>
                            <a href="#" className="bg-slate-800 p-2.5 rounded-xl hover:bg-orange-500 transition-colors" title="RSS">
                                <Rss size={18} />
                            </a>
                        </div>
                        <p className="text-slate-500 text-xs mt-4">
                            Data resep disediakan oleh TheMealDB
                        </p>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-xs text-slate-500">
                        &copy; {new Date().getFullYear()} CariMakan. Hak cipta dilindungi.
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                        Dibuat dengan <Heart size={12} className="text-red-500 fill-current" /> untuk pecinta kuliner Indonesia
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
