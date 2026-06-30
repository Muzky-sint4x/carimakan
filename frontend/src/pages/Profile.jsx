import React, { useState } from 'react';
import { User, MapPin, Phone, Mail, Edit3, ShoppingBag, Star, Heart } from 'lucide-react';

const Profile = () => {
  // ✅ State untuk edit
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Pengguna CariMakan",
    email: "pengguna@carimakan.id",
    phone: "+62 812-3456-7890",
    address: "Jakarta, Indonesia",
  });

  const handleEditToggle = () => setIsEditing(!isEditing);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };
  const handleSave = () => {
    setIsEditing(false);
    alert("Data profil berhasil diperbarui!");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Profil Saya</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Kartu Profil */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto">
                <User size={40} className="text-white" />
              </div>
              <button
                onClick={handleEditToggle}
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 transition-colors shadow-md"
              >
                <Edit3 size={12} />
              </button>
            </div>
            <h2 className="text-xl font-bold text-slate-800">{profile.name}</h2>
            <p className="text-slate-500 text-sm mt-1">Pecinta Kuliner</p>

            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-100">
              <div className="text-center">
                <p className="text-xl font-bold text-slate-800">12</p>
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

        {/* Info Detail */}
        <div className="md:col-span-2 space-y-4">
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
                <div>
                  <p className="text-xs text-slate-400 font-medium">Nama Lengkap</p>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      className="border border-slate-200 rounded-lg p-2 mt-1 w-full focus:ring-2 focus:ring-blue-500"
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
                <div>
                  <p className="text-xs text-slate-400 font-medium">Email</p>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      className="border border-slate-200 rounded-lg p-2 mt-1 w-full focus:ring-2 focus:ring-blue-500"
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
                <div>
                  <p className="text-xs text-slate-400 font-medium">Nomor Telepon</p>
                  {isEditing ? (
                    <input
                      type="text"
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      className="border border-slate-200 rounded-lg p-2 mt-1 w-full focus:ring-2 focus:ring-blue-500"
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
                <div>
                  <p className="text-xs text-slate-400 font-medium">Alamat</p>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={profile.address}
                      onChange={handleChange}
                      className="border border-slate-200 rounded-lg p-2 mt-1 w-full focus:ring-2 focus:ring-blue-500"
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
                  className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors text-left border border-slate-100 hover:border-slate-200 group"
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
        </div>
      </div>
    </div>
  );
};

export default Profile;
