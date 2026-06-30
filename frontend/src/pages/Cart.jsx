import jsPDF from "jspdf";
import QRCode from "qrcode";
import React from "react";
import { Link, useNavigate } from "react-router-dom";   // 🔹 tambahkan useNavigate
import { useCart } from "../context/CartContext";
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, ShoppingCart } from "lucide-react";
import html2canvas from "html2canvas";

const Cart = () => {
  const { cart, addToCart, removeFromCart, decreaseQty, cartCount } = useCart();
  const navigate = useNavigate();   // 🔹 inisialisasi navigate

  const totalHarga = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const formattedTotal = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(totalHarga);

  // ✅ Fungsi download bill PDF (opsional, bisa dipakai kalau mau)
  const handleDownloadBill = async () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleString();
    const orderId = Math.floor(Math.random() * 100000);

    doc.setFontSize(16);
    doc.text("Karcis Pemesanan - CariMakan", 20, 20);
    doc.setFontSize(12);
    doc.text(`Tanggal: ${date}`, 20, 30);
    doc.text(`ID Pesanan: #${orderId}`, 20, 40);

    let y = 60;
    cart.forEach((item) => {
      doc.text(`${item.strMeal} x${item.quantity} - Rp ${item.price * item.quantity}`, 20, y);
      y += 10;
    });

    doc.text(`Total Pembayaran: ${formattedTotal}`, 20, y + 10);

    const qrData = `Pesanan #${orderId} - Total ${formattedTotal}`;
    const qrImage = await QRCode.toDataURL(qrData);
    doc.addImage(qrImage, "PNG", 150, 20, 40, 40);

    doc.text("Terima kasih telah memesan di CariMakan!", 20, y + 30);
    doc.save(`Karcis_CariMakan_${orderId}.pdf`);
  };

  // ✅ Jika keranjang kosong
  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl p-12 shadow-sm border border-slate-100">
          <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart size={40} className="text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Keranjang Masih Kosong</h2>
          <p className="text-slate-500 mb-8">
            Yuk, tambahkan makanan favoritmu ke keranjang terlebih dahulu!
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={18} />
            Lihat Menu Makanan
          </Link>
        </div>
      </div>
    );
  }

  // ✅ Tampilan keranjang
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daftar Item */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => {
            const itemPrice = new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumFractionDigits: 0,
            }).format(item.price * item.quantity);

            return (
              <div
                key={item.idMeal}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex gap-0"
              >
                <img
                  src={item.strMealThumb}
                  alt={item.strMeal}
                  className="w-28 h-28 object-cover flex-shrink-0"
                />

                <div className="flex-grow p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <Link
                        to={`/detail/${item.idMeal}`}
                        className="font-bold text-slate-800 hover:text-blue-600 transition-colors line-clamp-1"
                      >
                        {item.strMeal}
                      </Link>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {item.strCategory} · {item.strArea}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.idMeal)}
                      className="text-slate-300 hover:text-red-500 transition-colors p-1 flex-shrink-0"
                      title="Hapus dari keranjang"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-600">{itemPrice}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decreaseQty(item.idMeal)}
                        className="w-8 h-8 bg-slate-100 hover:bg-blue-100 hover:text-blue-600 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-bold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ringkasan Pembayaran */}
        <div className="lg:col-span-1">
          <div
            id="bill-section"
            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-24"
          >
            <h2 className="text-lg font-bold text-slate-800 mb-6 pb-3 border-b border-slate-100">
              Ringkasan Pesanan
            </h2>
            <div className="space-y-3 mb-6">
              {cart.map((item) => (
                <div key={item.idMeal} className="flex justify-between text-sm">
                  <span className="text-slate-600 line-clamp-1 flex-1 mr-2">
                    {item.strMeal} <span className="text-slate-400">x{item.quantity}</span>
                  </span>
                  <span className="font-medium text-slate-800 flex-shrink-0">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }).format(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800">Total</span>
                <span className="font-extrabold text-xl text-blue-600">{formattedTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tombol Pesan Sekarang */}
      <div className="mt-8">
        <button
          onClick={() => navigate(`/karcis/${Date.now()}`)}   // 🔹 ubah jadi navigasi ke halaman karcis
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-2xl font-bold text-base hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg active:scale-95"
        >
          <ShoppingBag size={20} />
          Pesan Sekarang
        </button>
      </div>
    </div>
  );
};

export default Cart;
