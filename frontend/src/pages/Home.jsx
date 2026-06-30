import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import FoodCard from '../components/FoodCard';
import { Loader2, Frown } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const Home = () => {
    const [foods, setFoods] = useState([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchFoods = async (searchQuery = '') => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/foods/search?q=${encodeURIComponent(searchQuery)}`);
            if (response.data.meals) {
                setFoods(response.data.meals);
            } else {
                setFoods([]);
            }
        } catch (err) {
            setError('Gagal memuat data makanan. Pastikan server backend berjalan.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFoods();
    }, []);

    const handleSearch = (searchQuery) => {
        fetchFoods(searchQuery);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                    Temukan Makanan <span className="text-blue-600">Favoritmu</span>
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                    Eksplorasi berbagai resep lezat dari seluruh dunia, dari makanan pembuka hingga hidangan penutup.
                </p>
            </div>

            <SearchBar query={query} setQuery={setQuery} onSearch={handleSearch} />

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-blue-600">
                    <Loader2 className="animate-spin mb-4" size={48} />
                    <p className="text-slate-500 font-medium animate-pulse">Sedang mencari makanan enak...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center max-w-2xl mx-auto border border-red-100">
                    <p className="font-medium">{error}</p>
                </div>
            ) : foods.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {foods.map((food) => (
                        <FoodCard key={food.idMeal} food={food} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <Frown size={64} className="mb-4 text-slate-300" />
                    <p className="text-lg font-medium text-slate-600">Waduh, makanannya nggak ketemu.</p>
                    <p className="text-sm">Coba cari dengan kata kunci lain ya!</p>
                </div>
            )}
        </div>
    );
};

export default Home;
