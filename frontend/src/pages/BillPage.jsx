import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import { Download, MapPin, CreditCard } from "lucide-react";

const BillPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const state = location.state || {};
  const orderedItems = state.items || [];
  const formattedTotal = state.formattedTotal || "Rp 0";
  const address = state.address || "-";
  const paymentMethod = state.paymentMethod || "-";

  useEffect(() => {
    if (orderedItems.length === 0) {
      // If there are no items (e.g. user navigated directly to /karcis/123)
      navigate("/");
      return;
    }

    const generateQR = async () => {
      try {
        const qrData = `Pesanan #${id} - Total ${formattedTotal}`;
        const url = await QRCode.toDataURL(qrData);
        setQrCodeUrl(url);
      } catch (err) {
        console.error(err);
      }
    };
    generateQR();
  }, [id, formattedTotal, orderedItems.length, navigate]);

  const handleDownloadBill = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleString("id-ID");

    doc.setFontSize(16);
    doc.text("Karcis Pemesanan - CariMakan", 20, 20);
    doc.setFontSize(10);
    doc.text(`Tanggal: ${date}`, 20, 30);
    doc.text(`ID Pesanan: #${id}`, 20, 36);
    
    doc.text(`Alamat Pengiriman: ${address}`, 20, 46);
    doc.text(`Metode Pembayaran: ${paymentMethod}`, 20, 52);

    let y = 65;
    orderedItems.forEach((item) => {
      doc.text(`${item.strMeal} x${item.quantity} - Rp ${item.price * item.quantity}`, 20, y);
      y += 10;
    });

    doc.setFontSize(12);
    doc.text(`Total Pembayaran: ${formattedTotal}`, 20, y + 10);

    if (qrCodeUrl) {
      doc.addImage(qrCodeUrl, "PNG", 150, 20, 40, 40);
    }

    doc.setFontSize(10);
    doc.text("Terima kasih telah memesan di CariMakan!", 20, y + 30);
    doc.save(`Karcis_CariMakan_${id}.pdf`);
  };

  if (orderedItems.length === 0) return null;

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="text-center mb-6 border-b border-slate-100 pb-6">
          <h1 className="text-2xl font-bold text-slate-800">Bill Pemesanan</h1>
          <p className="text-slate-500 text-sm mt-1">ID Pesanan: {id}</p>
        </div>
        
        {qrCodeUrl && (
          <div className="flex justify-center mb-6">
            <img src={qrCodeUrl} alt="QR Code Pesanan" className="w-32 h-32" />
          </div>
        )}

        <div className="bg-slate-50 rounded-xl p-4 mb-6 space-y-3 border border-slate-100">
          <div className="flex items-start gap-3">
            <MapPin size={18} className="text-blue-500 mt-0.5" />
            <div>
              <p className="text-xs text-slate-400 font-semibold mb-0.5">Alamat Pengiriman</p>
              <p className="text-sm text-slate-700">{address}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 pt-3 border-t border-slate-200">
            <CreditCard size={18} className="text-blue-500 mt-0.5" />
            <div>
              <p className="text-xs text-slate-400 font-semibold mb-0.5">Metode Pembayaran</p>
              <p className="text-sm text-slate-700">{paymentMethod}</p>
            </div>
          </div>
        </div>

        <h3 className="font-bold text-slate-800 text-sm mb-3">Detail Pesanan</h3>
        <div className="space-y-3 mb-6">
          {orderedItems.map((item) => (
            <div key={item.idMeal} className="flex justify-between text-sm">
              <span className="text-slate-600">
                {item.strMeal} <span className="text-slate-400">x{item.quantity}</span>
              </span>
              <span className="font-medium text-slate-800">
                Rp {item.price * item.quantity}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-200 pt-4 mb-6 flex justify-between items-center">
          <p className="text-slate-700 font-bold">Total Pembayaran:</p>
          <p className="text-blue-600 font-extrabold text-xl">{formattedTotal}</p>
        </div>

        <button
          onClick={handleDownloadBill}
          className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white py-3 rounded-xl font-semibold hover:bg-slate-900 transition-colors mb-3 shadow-md"
        >
          <Download size={18} />
          Download PDF
        </button>

        <Link
          to="/"
          className="block text-center bg-blue-100 text-blue-700 py-3 rounded-xl font-semibold hover:bg-blue-200 transition-colors"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
};

export default BillPage;
