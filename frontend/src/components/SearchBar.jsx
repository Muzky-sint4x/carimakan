import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ query, setQuery, onSearch }) => {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSearch && onSearch(query);
        }
    };

    return (
        <div className="relative max-w-2xl mx-auto mb-10 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
                type="text"
                className="block w-full pl-12 pr-36 py-4 border border-slate-200 rounded-2xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-base transition-all shadow-sm hover:shadow-md"
                placeholder="Cari resep makanan favoritmu..."
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                }}
                onKeyDown={handleKeyDown}
            />
            <button
                className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white px-6 rounded-xl hover:bg-blue-700 transition-colors font-semibold text-sm shadow-sm"
                onClick={() => onSearch && onSearch(query)}
            >
                Cari Resep
            </button>
        </div>
    );
};

export default SearchBar;
