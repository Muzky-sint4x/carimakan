import React, { useState, useEffect } from 'react';
import { User, MapPin, Phone, Mail, Edit3, ShoppingBag, Star, Heart, ArrowLeft, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  // ✅ State untuk edit
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'orders'
  const [orderHistory, setOrderHistory] = useState([]);
  
  const [profile, setProfile] = useState({
    name: "Pengguna CariMakan",
    email: "pengguna@carimakan.id",
    phone: "+62 812-3456-7890",
    address: "Jakarta, Indonesia",
  });

  useEffect(() => {
    // Load history pesanan saat komponen dimuat
    const storedOrders = JSON.parse(localStorage.getItem("carimakan_orders")) || [];
    setOrderHistory(storedOrders);
  }, []);

  const handleEditToggle = () => setIsEditing(!isEditing);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };
  const handleSave = () => {
    setIsEditing(false);
    alert("Data profil berhasil diperbarui!");
  };

  const handleMenuClick = (label) => {
    if (label === 'Riwayat Pesanan') {
      setActiveTab('orders');
    } else {
      alert(`Fitur ${label} sedang dalam pengembangan.`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        {activeTab === 'orders' && (
          <button 
            onClick={() => setActiveTab('profile')}
            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-700" />
          </button>
        )}
        <h1 className="text-3xl font-extrabold text-slate-900">
          {activeTab === 'profile' ? 'Profil Saya' : 'Riwayat Pesanan'}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Kartu Profil - Selalu tampil di kiri jika di desktop */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 text-center sticky top-24">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto">
                <User size={40} className="text-white" />
              </div>
              {activeTab === 'profile' && (
                <button
                  onClick={handleEditToggle}
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 transition-colors shadow-md"
                >
                  <Edit3 size={12} />
                </button>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-800">{profile.name}</h2>
            <p className="text-slate-500 text-sm mt-1">Pecinta Kuliner</p>

            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-100">
              <div className="text-center">
                <p className="text-xl font-bold text-slate-800">{orderHistory.length}</p>
                <p className="text-xs text-slate-500">Pesanan</p>
              </div>
              <div className="text-center border-x border-slate-100">
                <p className="text-xl font-bold text-slate-800">5</p>
                <p className="text-xs text-slate-500">Favorit</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-slate-800">4.8</p>
                <p className="text-xs text-slate-500">Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Tampilan dinamis (Profil atau Riwayat Pesanan) */}
        <div className="md:col-span-2 space-y-4">
          
          {activeTab === 'profile' ? (
            <>
              {/* Informasi Pribadi */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-slate-800 text-lg">Informasi Pribadi</h3>
                  <button
                    onClick={handleEditToggle}
                    className="flex items-center gap-1.5 text-blue-600 text-sm font-semibold hover:bg-blue-50 px-3 py-1.5 rounded-xl transition-colors"
                  >
                    <Edit3 size={14} />
                    {isEditing ? "Batal" : "Edit"}
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Nama */}
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-100 p-2.5 rounded-xl">
                      <User size={18} className="text-slate-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-400 font-medium">Nama Lengkap</p>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={profile.name}
                          onChange={handleChange}
                          className="border border-slate-200 rounded-lg p-2 mt-1 w-full focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      ) : (
                        <p className="font-semibold text-slate-800">{profile.name}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-100 p-2.5 rounded-xl">
                      <Mail size={18} className="text-slate-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-400 font-medium">Email</p>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={profile.email}
                          onChange={handleChange}
                          className="border border-slate-200 rounded-lg p-2 mt-1 w-full focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      ) : (
                        <p className="font-semibold text-slate-800">{profile.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Telepon */}
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-100 p-2.5 rounded-xl">
                      <Phone size={18} className="text-slate-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-400 font-medium">Nomor Telepon</p>
                      {isEditing ? (
                        <input
                          type="text"
                          name="phone"
                          value={profile.phone}
                          onChange={handleChange}
                          className="border border-slate-200 rounded-lg p-2 mt-1 w-full focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      ) : (
                        <p className="font-semibold text-slate-800">{profile.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Alamat */}
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-100 p-2.5 rounded-xl">
                      <MapPin size={18} className="text-slate-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-400 font-medium">Alamat Default</p>
                      {isEditing ? (
                        <input
                          type="text"
                          name="address"
                          value={profile.address}
                          onChange={handleChange}
                          className="border border-slate-200 rounded-lg p-2 mt-1 w-full focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      ) : (
                        <p className="font-semibold text-slate-800">{profile.address}</p>
                      )}
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <button
                    onClick={handleSave}
                    className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                  >
                    Simpan Perubahan
                  </button>
                )}
              </div>

              {/* Menu Cepat */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                <h3 className="font-bold text-slate-800 text-lg mb-4">Menu Akun</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { icon: ShoppingBag, label: 'Riwayat Pesanan', desc: 'Lihat semua pesanan', color: 'blue' },
                    { icon: Heart, label: 'Makanan Favorit', desc: 'Resep yang disimpan', color: 'red' },
                    { icon: Star, label: 'Ulasan Saya', desc: 'Rating yang diberikan', color: 'yellow' },
                    { icon: MapPin, label: 'Alamat Saya', desc: 'Kelola alamat pengiriman', color: 'green' },
                  ].map(({ icon: Icon, label, desc, color }) => (
                    <button
                      key={label}
                      onClick={() => handleMenuClick(label)}
                      className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors text-left border border-slate-100 hover:border-slate-200 group w-full"
                    >
                      <div className={`p-2.5 rounded-xl bg-${color}-50 group-hover:bg-${color}-100 transition-colors`}>
                        <Icon size={18} className={`text-${color}-500`} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{label}</p>
                        <p className="text-xs text-slate-400">{desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            // TAB: RIWAYAT PESANAN
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              {orderHistory.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 shadow-sm border border-slate-100 text-center">
                  <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag size={32} className="text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Belum Ada Pesanan</h3>
                  <p className="text-slate-500 mb-6">Mulai pesan makanan favorit Anda sekarang!</p>
                  <Link
                    to="/"
                    className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Eksplor Menu
                  </Link>
                </div>
              ) : (
                orderHistory.map((order) => (
                  <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100">
                      <div>
                        <p className="text-xs text-slate-400 font-medium mb-1">{order.date}</p>
                        <p className="text-sm font-bold text-slate-800">Pesanan #{order.id}</p>
                      </div>
                      <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold">
                        <Clock size={14} />
                        {order.status || "Selesai"}
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-3">
                            <img src={item.strMealThumb} alt={item.strMeal} className="w-10 h-10 rounded-lg object-cover" />
                            <p className="font-medium text-slate-700">{item.strMeal} <span className="text-slate-400">x{item.quantity}</span></p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-slate-50 rounded-xl p-3 flex justify-between items-center">
                      <p className="text-xs text-slate-500">Total Belanja</p>
                      <p className="font-bold text-blue-600">{order.formattedTotal}</p>
                    </div>
                    
                    <Link 
                      to={`/karcis/${order.id}`}
                      state={order}
                      className="mt-4 w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                    >
                      <CheckCircle size={16} />
                      Lihat Karcis
                    </Link>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
