import React from "react";
import { useParams, Link } from "react-router-dom";

const BillPage = () => {
  const { id } = useParams();

  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-md p-6 mt-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-4">Bill Pemesanan</h1>
      <p className="text-slate-600 mb-2">ID Pesanan: {id}</p>
      <p className="text-slate-600 mb-6">Terima kasih telah memesan di CariMakan!</p>

      <div className="border-t border-slate-200 pt-4">
        <p className="text-slate-700 font-semibold">Total Pembayaran:</p>
        <p className="text-blue-600 font-bold text-xl">Rp 34.000</p>
      </div>

      <Link
        to="/"
        className="block mt-6 text-center bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
};

export default BillPage;
