import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ShoppingBag, MapPin, Tag } from "lucide-react";

// 🔹 Terjemahan kategori makanan
const categoryTranslations = {
  Beef: "Daging Sapi",
  Chicken: "Ayam",
  Dessert: "Dessert",
  Lamb: "Daging Kambing",
  Miscellaneous: "Lainnya",
  Pasta: "Pasta",
  Pork: "Daging Babi",
  Seafood: "Makanan Laut",
  Side: "Pendamping",
  Starter: "Pembuka",
  Vegan: "Vegan",
  Vegetarian: "Vegetarian",
  Breakfast: "Sarapan",
  Goat: "Daging Kambing",
};

// 🔹 Terjemahan asal masakan
const areaTranslations = {
  American: "Amerika",
  British: "Inggris",
  Canadian: "Kanada",
  Chinese: "Tiongkok",
  Croatian: "Kroasia",
  Dutch: "Belanda",
  Egyptian: "Mesir",
  French: "Prancis",
  Greek: "Yunani",
  Indian: "India",
  Irish: "Irlandia",
  Italian: "Italia",
  Jamaican: "Jamaika",
  Japanese: "Jepang",
  Kenyan: "Kenya",
  Malaysian: "Malaysia",
  Mexican: "Meksiko",
  Moroccan: "Maroko",
  Polish: "Polandia",
  Portuguese: "Portugal",
  Russian: "Rusia",
  Spanish: "Spanyol",
  Thai: "Thailand",
  Tunisian: "Tunisia",
  Turkish: "Turki",
  Vietnamese: "Vietnam",
  Unknown: "Umum",
  Indonesian: "Indonesia",
  Filipino: "Filipina",
  Korean: "Korea",
};

// 🔹 Komponen utama
const FoodCard = ({ food }) => {
  const { addToCart } = useCart();

  // Hitung harga dummy berdasarkan ID
  const priceId = parseInt(food.idMeal || "0");
  const dummyPrice = 15000 + ((priceId % 35) * 1000);
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(dummyPrice);

  // Ambil terjemahan kategori dan asal
  const categoryID = categoryTranslations[food.strCategory] || food.strCategory || "Umum";
  const areaID = areaTranslations[food.strArea] || food.strArea || "Tidak diketahui";

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-slate-100 flex flex-col h-full">
      {/* 🔹 Gambar makanan */}
      <div className="relative overflow-hidden aspect-video">
        <img
          src={food.strMealThumb}
          alt={food.strMeal}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-2 left-2 flex gap-1">
          <span className="flex items-center gap-1 bg-white/90 backdrop-blur-sm text-slate-700 text-[10px] font-bold px-2 py-1 rounded-full">
            <Tag size={9} className="text-blue-500" />
            {categoryID}
          </span>
        </div>
      </div>

      {/* 🔹 Detail makanan */}
      <div className="p-5 flex flex-col flex-grow">
        <Link to={`/detail/${food.idMeal}`} className="hover:text-blue-600 transition-colors">
          <h3 className="font-bold text-base text-slate-800 line-clamp-2 leading-snug">
            {food.strMeal}
          </h3>
        </Link>
        <p className="flex items-center gap-1 text-xs text-slate-400 mt-1.5">
          <MapPin size={10} className="text-red-400" />
          Masakan {areaID}
        </p>

        {/* 🔹 Harga dan tombol */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
          <span className="font-extrabold text-slate-800 text-sm">{formattedPrice}</span>
          <div className="flex gap-2 flex-wrap justify-end">
            <Link
              to={`/detail/${food.idMeal}`}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors px-3 py-2 rounded-xl hover:bg-blue-50"
            >
              Detail Pesanan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
