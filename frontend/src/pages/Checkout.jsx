import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { User, MapPin, CreditCard, ShoppingBag, CheckCircle, Smartphone, Building, ArrowLeft, X } from "lucide-react";
import QRCode from "qrcode";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  // State
  const [orderType, setOrderType] = useState("delivery");
  const [name, setName] = useState("Pengguna CariMakan");
  const [email, setEmail] = useState("pengguna@carimakan.id");
  const [address, setAddress] = useState("Jakarta, Indonesia");
  const [paymentMethod, setPaymentMethod] = useState("QRIS");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQRISModal, setShowQRISModal] = useState(false);
  const [qrisUrl, setQrisUrl] = useState("");

  const totalHarga = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const formattedTotal = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(totalHarga);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0 && !isProcessing && !showQRISModal) {
      navigate("/keranjang");
    }
  }, [cart, isProcessing, showQRISModal, navigate]);

  useEffect(() => {
    if (showQRISModal) {
      QRCode.toDataURL(`QRIS_PAYMENT_${Date.now()}_${totalHarga}`).then(setQrisUrl);
    }
  }, [showQRISModal, totalHarga]);

  if (cart.length === 0 && !showQRISModal) return null;

  const processOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const orderId = Date.now();
      const orderDate = new Date().toLocaleString("id-ID");
      
      const finalAddress = orderType === 'delivery' ? address : "Jl. Makan Enak No. 123, Jakarta";

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

      const existingOrders = JSON.parse(localStorage.getItem("carimakan_orders")) || [];
      localStorage.setItem("carimakan_orders", JSON.stringify([newOrder, ...existingOrders]));

      navigate(`/karcis/${orderId}`, { state: newOrder });
      clearCart();
    }, 1500);
  };

  const handleConfirmOrder = (e) => {
    e.preventDefault();
    if (paymentMethod === "QRIS") {
      setShowQRISModal(true);
    } else {
      processOrder();
    }
  };

  const paymentOptions = [
    { id: "QRIS", title: "QRIS", desc: "Scan QR untuk bayar instan", icon: Smartphone },
    { id: "Transfer Bank", title: "Transfer Bank", desc: "BCA, Mandiri, BNI, BRI", icon: Building },
    { id: "Bayar di Tempat (COD)", title: "Cash on Delivery", desc: "Bayar saat pesanan tiba", icon: MapPin },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-slate-50/50 min-h-screen font-sans">
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
        
        {/* Kolom Kiri */}
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
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="orderType" 
                      value="delivery"
                      checked={orderType === "delivery"}
                      onChange={() => setOrderType("delivery")}
                      className="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500"
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
                      className="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500"
                    />
                    <span className="text-slate-700 font-medium">Ambil di Tempat</span>
                  </label>
                </div>
              </div>

              {/* Nama */}
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

              {/* Email */}
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

              {/* Alamat */}
              {orderType === "delivery" ? (
                <div className="animate-in fade-in duration-300">
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
                <div className="animate-in fade-in duration-300">
                  <label className="block text-sm font-semibold text-blue-800 mb-2">Alamat Pengambilan (Toko)</label>
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center gap-2">
                     <MapPin size={18} className="text-blue-600" />
                     <p className="text-slate-700 font-medium">
                       Jl. Makan Enak No. 123, Jakarta
                     </p>
                  </div>
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
                const isSelected = paymentMethod === option.id;
                
                return (
                  <label 
                    key={option.id}
                    className={`flex flex-col gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected ? 'border-blue-500 bg-blue-50/50' : 'border-slate-100 hover:border-blue-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 flex items-center justify-center">
                         {option.id === "QRIS" && <div className="bg-indigo-600 text-white rounded p-1.5"><Smartphone size={20}/></div>}
                         {option.id === "Transfer Bank" && <div className="bg-slate-200 text-slate-700 rounded-full p-2"><Building size={20}/></div>}
                         {option.id === "Bayar di Tempat (COD)" && <div className="bg-emerald-500 text-white rounded p-1.5"><MapPin size={20}/></div>}
                      </div>
                      
                      <div className="flex-1">
                        <p className={`font-bold ${isSelected ? 'text-blue-800' : 'text-slate-800'}`}>{option.title}</p>
                        <p className={`text-sm ${isSelected ? 'text-slate-600' : 'text-slate-500'}`}>{option.desc}</p>
                      </div>
                      <div className="flex-shrink-0 mr-2">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-blue-600' : 'border-slate-300'
                        }`}>
                          {isSelected && <div className="w-3 h-3 rounded-full bg-blue-600" />}
                        </div>
                      </div>
                    </div>
                    
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
                disabled={isProcessing && !showQRISModal}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-all shadow-md active:scale-[0.98] ${
                  isProcessing && !showQRISModal
                    ? 'bg-blue-400 text-white cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-[0_4px_14px_0_rgba(37,99,235,0.39)]'
                }`}
              >
                {isProcessing && !showQRISModal ? (
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

      {/* QRIS Modal Popup */}
      {showQRISModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative animate-in zoom-in-95 duration-300">
            
            <h2 className="text-3xl font-extrabold text-slate-800 mb-1">Scan QRIS</h2>
            <p className="text-blue-600 mb-6">Total Tagihan: <strong className="font-bold">{formattedTotal}</strong></p>

            <div className="bg-white border-2 border-blue-600 rounded-2xl p-4 inline-block mb-6 mx-auto">
              {qrisUrl ? (
                <img src={qrisUrl} alt="QRIS" className="w-48 h-48 object-contain" />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center bg-slate-50 animate-pulse">
                  <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                </div>
              )}
            </div>

            <p className="text-slate-600 text-sm mb-6 px-4">
              Buka aplikasi m-banking atau e-wallet Anda (Gopay, OVO, Dana) dan scan kode di atas.
            </p>

            <div className="space-y-3">
              <button 
                onClick={processOrder}
                disabled={isProcessing}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
                  isProcessing ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isProcessing ? "Memproses..." : "Saya Sudah Bayar"}
              </button>
              
              <button 
                onClick={() => {
                  if (!isProcessing) setShowQRISModal(false);
                }}
                disabled={isProcessing}
                className="w-full py-4 rounded-xl font-bold text-slate-400 hover:text-slate-600 transition-colors bg-transparent"
              >
                Batal / Ubah Metode
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Checkout;
