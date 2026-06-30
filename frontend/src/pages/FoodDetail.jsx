import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
import {
    Loader2, ArrowLeft, ShoppingBag, PlayCircle,
    ChefHat, ListChecks, MapPin, Tag, Clock, Users, CheckCircle2
} from 'lucide-react';

// Terjemahan kategori makanan
const categoryTranslations = {
    'Beef': 'Daging Sapi', 'Chicken': 'Ayam', 'Dessert': 'Dessert', 'Lamb': 'Daging Kambing',
    'Miscellaneous': 'Lainnya', 'Pasta': 'Pasta', 'Pork': 'Daging Babi', 'Seafood': 'Makanan Laut',
    'Side': 'Makanan Pendamping', 'Starter': 'Makanan Pembuka', 'Vegan': 'Vegan',
    'Vegetarian': 'Vegetarian', 'Breakfast': 'Sarapan', 'Goat': 'Daging Kambing'
};

// Terjemahan area/negara asal
const areaTranslations = {
    'American': 'Amerika', 'British': 'Inggris', 'Canadian': 'Kanada', 'Chinese': 'Tiongkok',
    'Croatian': 'Kroasia', 'Dutch': 'Belanda', 'Egyptian': 'Mesir', 'French': 'Prancis',
    'Greek': 'Yunani', 'Indian': 'India', 'Irish': 'Irlandia', 'Italian': 'Italia',
    'Jamaican': 'Jamaika', 'Japanese': 'Jepang', 'Kenyan': 'Kenya', 'Malaysian': 'Malaysia',
    'Mexican': 'Meksiko', 'Moroccan': 'Maroko', 'Polish': 'Polandia', 'Portuguese': 'Portugal',
    'Russian': 'Rusia', 'Spanish': 'Spanyol', 'Thai': 'Thailand', 'Tunisian': 'Tunisia',
    'Turkish': 'Turki', 'Vietnamese': 'Vietnam', 'Unknown': 'Tidak Diketahui',
    'Indonesian': 'Indonesia', 'Filipino': 'Filipina', 'Korean': 'Korea'
};

// Konversi instruksi bertahap ke daftar terstruktur
const parseInstructions = (text) => {
    if (!text) return [];
    // Pisahkan berdasarkan baris baru atau pola "Step N"
    const lines = text
        .replace(/STEP\s*\d+/gi, '\n')
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(l => l.length > 5);
    return lines;
};

const FoodDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [food, setFood] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/foods/${id}`);
                if (response.data.meals && response.data.meals.length > 0) {
                    setFood(response.data.meals[0]);
                } else {
                    setError('Makanan tidak ditemukan');
                }
            } catch (err) {
                setError('Gagal memuat detail makanan. Pastikan server backend berjalan.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
                <Loader2 className="animate-spin text-blue-600" size={56} />
                <p className="text-slate-500 font-medium text-lg animate-pulse">Memuat detail resep...</p>
            </div>
        );
    }

    if (error || !food) {
        return (
            <div className="max-w-3xl mx-auto mt-16 p-8 bg-red-50 text-red-600 rounded-3xl text-center border border-red-100">
                <p className="font-semibold text-xl mb-4">{error || 'Terjadi kesalahan'}</p>
                <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 text-blue-600 hover:underline font-medium">
                    <ArrowLeft size={16} /> Kembali ke Beranda
                </button>
            </div>
        );
    }

    // Kumpulkan bahan-bahan
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = food[`strIngredient${i}`]?.trim();
        const measure = food[`strMeasure${i}`]?.trim();
        if (ingredient) {
            ingredients.push({ name: ingredient, measure: measure || '' });
        }
    }

    // Harga dummy deterministik
    const priceId = parseInt(food.idMeal || "0");
    const dummyPrice = 15000 + ((priceId % 35) * 1000);
    const formattedPrice = new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', maximumFractionDigits: 0
    }).format(dummyPrice);

    const categoryID = categoryTranslations[food.strCategory] || food.strCategory;
    const areaID = areaTranslations[food.strArea] || food.strArea;
    const steps = parseInstructions(food.strInstructions);

    const handleAddToCart = () => {
        addToCart({ ...food, price: dummyPrice });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Tombol Kembali */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-8 group w-max"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="font-semibold">Kembali</span>
            </button>

            {/* Hero Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-6">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Gambar */}
                    <div className="relative h-72 lg:h-auto overflow-hidden">
                        <img
                            src={food.strMealThumb}
                            alt={food.strMeal}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:bg-gradient-to-r" />
                        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                            <span className="flex items-center gap-1 bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                                <Tag size={12} className="text-blue-500" />
                                {categoryID}
                            </span>
                            <span className="flex items-center gap-1 bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                                <MapPin size={12} className="text-red-500" />
                                {areaID}
                            </span>
                        </div>
                    </div>

                    {/* Info & Aksi */}
                    <div className="p-8 lg:p-10 flex flex-col justify-between">
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight mb-3">
                                {food.strMeal}
                            </h1>
                            <p className="text-3xl font-bold text-blue-600 mb-6">{formattedPrice}</p>

                            {/* Info Ringkas */}
                            <div className="grid grid-cols-2 gap-3 mb-8">
                                <div className="bg-blue-50 rounded-2xl p-4 flex items-center gap-3">
                                    <div className="bg-blue-100 p-2 rounded-xl">
                                        <ListChecks size={18} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-blue-500 font-medium">Bahan-bahan</p>
                                        <p className="text-lg font-bold text-blue-700">{ingredients.length} bahan</p>
                                    </div>
                                </div>
                                <div className="bg-green-50 rounded-2xl p-4 flex items-center gap-3">
                                    <div className="bg-green-100 p-2 rounded-xl">
                                        <ChefHat size={18} className="text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-green-500 font-medium">Langkah Masak</p>
                                        <p className="text-lg font-bold text-green-700">{steps.length} langkah</p>
                                    </div>
                                </div>
                                <div className="bg-orange-50 rounded-2xl p-4 flex items-center gap-3">
                                    <div className="bg-orange-100 p-2 rounded-xl">
                                        <Clock size={18} className="text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-orange-500 font-medium">Estimasi Waktu</p>
                                        <p className="text-lg font-bold text-orange-700">30-60 menit</p>
                                    </div>
                                </div>
                                <div className="bg-purple-50 rounded-2xl p-4 flex items-center gap-3">
                                    <div className="bg-purple-100 p-2 rounded-xl">
                                        <Users size={18} className="text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-purple-500 font-medium">Asal Masakan</p>
                                        <p className="text-lg font-bold text-purple-700">{areaID}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tombol Aksi */}
                        <div className="space-y-3">
                            <button
                                onClick={handleAddToCart}
                                className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-lg shadow-md transition-all duration-200 transform active:scale-95 ${added
                                    ? 'bg-green-500 text-white shadow-green-200'
                                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200'
                                    }`}
                            >
                                {added ? (
                                    <>
                                        <CheckCircle2 size={24} />
                                        Berhasil Ditambahkan!
                                    </>
                                ) : (
                                    <>
                                        <ShoppingBag size={24} />
                                        Tambah ke Keranjang
                                    </>
                                )}
                            </button>

                            {food.strYoutube && (
                                <a
                                    href={food.strYoutube}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3.5 rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-200 font-semibold border border-red-100 hover:border-red-500"
                                >
                                    <PlayCircle size={22} />
                                    Tonton Tutorial di YouTube
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bahan-bahan & Instruksi */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Daftar Bahan */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 lg:p-8">
                    <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800 mb-6">
                        <div className="bg-blue-100 p-2 rounded-xl">
                            <ListChecks size={20} className="text-blue-600" />
                        </div>
                        Daftar Bahan-bahan
                    </h2>
                    <ul className="space-y-3">
                        {ingredients.map((item, index) => (
                            <li key={index} className="flex items-start gap-3 group">
                                <div className="mt-1 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 transition-colors">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 group-hover:bg-white transition-colors" />
                                </div>
                                <span className="text-slate-700 text-sm leading-relaxed">
                                    {item.measure && (
                                        <span className="font-bold text-slate-900">{item.measure} </span>
                                    )}
                                    {item.name}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Instruksi Memasak */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 p-6 lg:p-8">
                    <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800 mb-6">
                        <div className="bg-orange-100 p-2 rounded-xl">
                            <ChefHat size={20} className="text-orange-600" />
                        </div>
                        Cara Memasak
                    </h2>
                    <ol className="space-y-5">
                        {steps.map((step, index) => (
                            <li key={index} className="flex gap-4 group">
                                <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-blue-600 transition-colors flex items-center justify-center font-bold text-slate-500 group-hover:text-white text-sm">
                                    {index + 1}
                                </div>
                                <p className="text-slate-600 leading-relaxed text-sm pt-1">{step}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default FoodDetail;
