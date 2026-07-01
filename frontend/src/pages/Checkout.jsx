import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { User, MapPin, CreditCard, ShoppingBag, CheckCircle, Smartphone, Building, ArrowLeft } from "lucide-react";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  // State
  const [orderType, setOrderType] = useState("delivery"); // 'delivery' or 'pickup'
  const [name, setName] = useState("Pengguna CariMakan");
  const [email, setEmail] = useState("pengguna@carimakan.id");
  const [address, setAddress] = useState("Jakarta, Indonesia");
  const [paymentMethod, setPaymentMethod] = useState("Bayar di Tempat (COD)");
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0 && !isProcessing) {
      navigate("/keranjang");
    }
  }, [cart, isProcessing, navigate]);

  if (cart.length === 0) return null;

  const totalHarga = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const formattedTotal = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(totalHarga);

  const handleConfirmOrder = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const orderId = Date.now();
      const orderDate = new Date().toLocaleString("id-ID");
      
      const finalAddress = orderType === 'delivery' ? address : "Ambil di Restoran (Pickup)";

      const newOrder = {
        id: orderId,
        date: orderDate,
        items: cart,
        totalHarga,
        formattedTotal,
        address: finalAddress,
        paymentMethod,
        orderType,
        customerName: name,
        customerEmail: email,
        status: "Sedang Diproses"
      };

      // Simpan ke localStorage
      const existingOrders = JSON.parse(localStorage.getItem("carimakan_orders")) || [];
      localStorage.setItem("carimakan_orders", JSON.stringify([newOrder, ...existingOrders]));

      // Pindah ke halaman karcis
      navigate(`/karcis/${orderId}`, { state: newOrder });
      clearCart();
    }, 1500); // Simulasi loading 1.5 detik
  };

  const paymentOptions = [
    { id: "Bayar di Tempat (COD)", title: "Bayar di Tempat (COD)", desc: "Bayar saat pesanan tiba", icon: MapPin },
    { id: "QRIS", title: "QRIS", desc: "Scan QR untuk bayar instan", icon: Smartphone },
    { id: "Transfer Bank", title: "Transfer Bank", desc: "BCA, Mandiri, BNI, BRI", icon: Building },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-slate-50/50 min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          to="/keranjang"
          className="p-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-full transition-colors shadow-sm"
        >
          <ArrowLeft size={20} className="text-slate-700" />
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900">Checkout Pesanan</h1>
      </div>

      <form onSubmit={handleConfirmOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Kolom Kiri: Form Informasi & Pembayaran */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Box Informasi Pemesan */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                <User size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Informasi Pemesan</h2>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Tipe Pesanan */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Tipe Pesanan</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="orderType" 
                      value="delivery"
                      checked={orderType === "delivery"}
                      onChange={() => setOrderType("delivery")}
                      className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                    />
                    <span className="text-slate-700 font-medium">Delivery (Antar)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="orderType" 
                      value="pickup"
                      checked={orderType === "pickup"}
                      onChange={() => setOrderType("pickup")}
                      className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                    />
                    <span className="text-slate-700 font-medium">Ambil di Tempat</span>
                  </label>
                </div>
              </div>

              {/* Nama & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Lengkap <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="nama@email.com"
                  />
                </div>
              </div>

              {/* Alamat */}
              {orderType === "delivery" ? (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Alamat Pengiriman <span className="text-red-500">*</span></label>
                  <textarea
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all min-h-[100px] resize-y"
                    placeholder="Contoh: Jl. Sudirman No. 123, RT 01/02, Jakarta Selatan"
                  ></textarea>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300 bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <label className="block text-sm font-bold text-blue-800 mb-1">Alamat Pengambilan (Toko)</label>
                  <p className="text-slate-700 text-sm">
                    <strong>CariMakan Resto</strong><br/>
                    Jl. Sudirman No. 1, RT 01/RW 02, Jakarta Selatan, 12190
                  </p>
                  <p className="text-xs text-blue-600 mt-2 font-semibold bg-white inline-block px-2 py-1 rounded-md">
                    * Bayar di kasir saat mengambil makanan
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Box Metode Pembayaran */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                <CreditCard size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Metode Pembayaran</h2>
            </div>
            
            <div className="p-6 space-y-4">
              {paymentOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = paymentMethod === option.id;
                
                return (
                  <label 
                    key={option.id}
                    className={`flex flex-col gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected ? 'border-blue-500 bg-blue-50/50' : 'border-slate-100 hover:border-blue-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                        <Icon size={24} />
                      </div>
                      <div className="flex-1">
                        <p className={`font-bold ${isSelected ? 'text-blue-800' : 'text-slate-800'}`}>{option.title}</p>
                        <p className="text-sm text-slate-500 mt-0.5">{option.desc}</p>
                      </div>
                      <div className="flex-shrink-0 mr-2">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-blue-600' : 'border-slate-300'
                        }`}>
                          {isSelected && <div className="w-3 h-3 rounded-full bg-blue-600" />}
                        </div>
                      </div>
                    </div>
                    
                    {/* Expanded Content untuk QRIS dan Transfer Bank */}
                    {isSelected && option.id === "QRIS" && (
                      <div className="mt-2 ml-16 mr-2 p-4 bg-white rounded-xl border border-slate-200 text-center animate-in fade-in zoom-in duration-300">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="QRIS Mock" className="w-32 h-32 mx-auto mb-3 opacity-80 mix-blend-multiply" />
                        <p className="text-sm font-semibold text-slate-700 mb-1">Scan untuk Membayar</p>
                        <p className="text-xs text-slate-500">Mendukung GoPay, OVO, Dana, LinkAja, ShopeePay</p>
                      </div>
                    )}

                    {isSelected && option.id === "Transfer Bank" && (
                      <div className="mt-2 ml-16 mr-2 p-4 bg-white rounded-xl border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-300">
                        <p className="text-sm font-semibold text-slate-700 mb-3">Pilih dan Transfer ke Rekening Berikut:</p>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="font-bold text-blue-800">BCA</span>
                            <span className="font-mono text-slate-600 text-sm">1234 5678 90</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="font-bold text-blue-800">Mandiri</span>
                            <span className="font-mono text-slate-600 text-sm">098 765 4321</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-4 text-center">a/n CariMakan Indonesia</p>
                      </div>
                    )}
                    
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value={option.id}
                      checked={isSelected}
                      onChange={() => setPaymentMethod(option.id)}
                      className="hidden"
                    />
                  </label>
                );
              })}
            </div>
          </div>

        </div>

        {/* Kolom Kanan: Ringkasan Pesanan */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden sticky top-24">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                <ShoppingBag size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Ringkasan Pesanan</h2>
            </div>
            
            <div className="p-6">
              {/* Daftar Item Singkat */}
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.idMeal} className="flex gap-4 items-center">
                    <img src={item.strMealThumb} alt={item.strMeal} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 line-clamp-1">{item.strMeal}</p>
                      <p className="text-sm text-slate-500 mb-1">x{item.quantity}</p>
                      <p className="font-bold text-blue-600 text-sm">
                        {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Total Item</span>
                  <span className="font-semibold text-slate-800">{totalItems} porsi</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Metode</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[150px] text-right" title={paymentMethod}>
                    {paymentMethod === 'Bayar di Tempat (COD)' ? 'COD' : paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                  <span className="font-bold text-slate-800 text-lg">Total Bayar</span>
                  <span className="font-extrabold text-2xl text-blue-600">{formattedTotal}</span>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isProcessing}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-all shadow-md active:scale-[0.98] ${
                  isProcessing 
                    ? 'bg-blue-400 text-white cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)]'
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    Konfirmasi Pesanan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};

export default Checkout;
