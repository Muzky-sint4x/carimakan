import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, UtensilsCrossed } from 'lucide-react';

const Header = () => {
    const { cartCount } = useCart();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-blue-600 text-white p-2 rounded-xl group-hover:bg-blue-700 transition-colors">
                            <UtensilsCrossed size={22} />
                        </div>
                        <div className="leading-tight">
                            <span className="font-extrabold text-xl text-slate-800 tracking-tight">CariMakan</span>
                            <p className="text-xs text-slate-400 font-medium -mt-0.5">Temukan Makanan Favoritmu</p>
                        </div>
                    </Link>

                    {/* Navigasi Tengah */}
                    <nav className="hidden md:flex items-center gap-1">
                        <Link
                            to="/"
                            className={`text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${isActive('/') ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'}`}
                        >
                            Beranda
                        </Link>
                        <Link
                            to="/keranjang"
                            className={`text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${isActive('/keranjang') ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'}`}
                        >
                            Keranjang
                        </Link>
                        <Link
                            to="/profil"
                            className={`text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${isActive('/profil') ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'}`}
                        >
                            Profil
                        </Link>
                    </nav>

                    {/* Ikon Kanan */}
                    <div className="flex items-center gap-3">
                        {/* Tombol Keranjang */}
                        <Link
                            to="/keranjang"
                            className="relative flex items-center gap-2 bg-slate-50 hover:bg-blue-50 transition-colors px-3 py-2 rounded-xl group"
                            title="Keranjang Saya"
                        >
                            <ShoppingCart className="text-slate-600 group-hover:text-blue-600 transition-colors" size={20} />
                            <span className="text-sm font-semibold text-slate-600 group-hover:text-blue-600 transition-colors hidden sm:block">
                                Keranjang
                            </span>
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Tombol Profil */}
                        <Link
                            to="/profil"
                            className="bg-slate-100 p-2.5 rounded-full hover:bg-blue-100 transition-colors group"
                            title="Profil Saya"
                        >
                            <User className="text-slate-600 group-hover:text-blue-600 transition-colors" size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
