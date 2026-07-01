import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import { Download, ArrowLeft } from "lucide-react";

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
  const orderDate = state.date || new Date().toLocaleString("id-ID");
  const orderType = state.orderType || "delivery";

  useEffect(() => {
    if (orderedItems.length === 0) {
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
    // Menghitung perkiraan tinggi kertas berdasarkan jumlah item dan alamat
    const baseHeight = 130;
    const itemHeight = orderedItems.length * 10;
    const addressHeight = orderType === 'delivery' ? 20 : 0;
    const totalHeight = baseHeight + itemHeight + addressHeight + (qrCodeUrl ? 40 : 0);

    // Format kertas kasir (lebar 80mm)
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, totalHeight]
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFont("courier", "bold");
    doc.setFontSize(16);
    doc.text("CARIMAKAN", pageWidth / 2, 12, { align: "center" });
    
    doc.setFontSize(9);
    doc.setFont("courier", "normal");
    doc.text("Jl. Sudirman No. 1, Jakarta", pageWidth / 2, 17, { align: "center" });
    doc.text("Telp: 0812-3456-7890", pageWidth / 2, 21, { align: "center" });
    
    // Separator
    doc.text("--------------------------------------", pageWidth / 2, 26, { align: "center" });
    
    // Order Info
    doc.setFontSize(8);
    doc.text(`WAKTU  : ${orderDate}`, 5, 32);
    doc.text(`ORDER  : #${id}`, 5, 36);
    doc.text(`TIPE   : ${orderType === 'pickup' ? 'Ambil Sendiri' : 'Delivery'}`, 5, 40);
    doc.text(`METODE : ${paymentMethod}`, 5, 44);

    doc.text("--------------------------------------", pageWidth / 2, 49, { align: "center" });

    // Items
    let y = 55;
    orderedItems.forEach((item) => {
      doc.setFont("courier", "bold");
      const name = item.strMeal.length > 20 ? item.strMeal.substring(0, 20) + "..." : item.strMeal;
      doc.text(name.toUpperCase(), 5, y);
      y += 4;
      
      doc.setFont("courier", "normal");
      const qtyStr = `${item.quantity} x Rp ${new Intl.NumberFormat("id-ID").format(item.price)}`;
      const subtotal = `Rp ${new Intl.NumberFormat("id-ID").format(item.price * item.quantity)}`;
      
      doc.text(qtyStr, 5, y);
      doc.text(subtotal, pageWidth - 5, y, { align: "right" });
      
      y += 6;
    });

    doc.text("--------------------------------------", pageWidth / 2, y, { align: "center" });
    y += 5;
    
    // Total
    doc.setFont("courier", "bold");
    doc.setFontSize(10);
    doc.text("TOTAL", 5, y);
    doc.text(formattedTotal, pageWidth - 5, y, { align: "right" });
    
    y += 5;
    doc.setFont("courier", "normal");
    doc.setFontSize(8);
    doc.text("--------------------------------------", pageWidth / 2, y, { align: "center" });
    y += 6;

    // Address if delivery
    if (orderType === 'delivery') {
      doc.setFont("courier", "bold");
      doc.text("ALAMAT PENGIRIMAN:", 5, y);
      y += 4;
      doc.setFont("courier", "normal");
      
      const splitAddress = doc.splitTextToSize(address, 70);
      doc.text(splitAddress, 5, y);
      y += (splitAddress.length * 4) + 2;
      
      doc.text("--------------------------------------", pageWidth / 2, y, { align: "center" });
      y += 6;
    }

    // QR Code
    if (qrCodeUrl) {
      const qrSize = 30;
      const xPos = (pageWidth - qrSize) / 2;
      doc.addImage(qrCodeUrl, "PNG", xPos, y, qrSize, qrSize);
      y += qrSize + 5;
    }

    // Footer
    doc.text("Terima kasih atas kunjungannya!", pageWidth / 2, y, { align: "center" });
    doc.text("Layanan Pelanggan: cs@carimakan.id", pageWidth / 2, y + 4, { align: "center" });

    doc.save(`Struk_CariMakan_${id}.pdf`);
  };

  if (orderedItems.length === 0) return null;

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      
      {/* Header Info */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800">Checkout Berhasil!</h1>
        <p className="text-slate-500 mt-2">Terima kasih, pesanan Anda sedang diproses.</p>
      </div>

      {/* QR Code Section */}
      {qrCodeUrl && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center mb-8 animate-in zoom-in duration-500">
          <p className="text-sm font-bold text-slate-700 mb-4">Tunjukkan QR ini saat pengambilan</p>
          <img src={qrCodeUrl} alt="QR Code Pesanan" className="w-40 h-40" />
          <p className="text-xs text-slate-400 mt-4 font-mono">ID: {id}</p>
        </div>
      )}

      {/* STRUK THERMAL DESIGN */}
      <div className="relative bg-white px-8 py-10 shadow-lg mb-8 font-mono text-slate-800 mx-auto w-full max-w-sm animate-in slide-in-from-bottom-8 duration-700">
        
        {/* Zigzag Top */}
        <div className="absolute -top-2 left-0 right-0 h-3 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSI4Ij48cG9seWdvbiBwb2ludHM9IjAsOCA4LDAgMTYsOCIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')] bg-repeat-x drop-shadow-sm"></div>

        <div className="text-center mb-6">
          <h2 className="font-extrabold text-2xl uppercase tracking-widest">CariMakan</h2>
          <p className="text-xs mt-1">Jl. Sudirman No. 1, Jakarta</p>
          <p className="text-xs">Telp: 0812-3456-7890</p>
        </div>

        <div className="border-b-2 border-dashed border-slate-300 my-4"></div>

        <div className="text-xs space-y-1.5 mb-4">
          <div className="flex justify-between">
            <span>WAKTU</span>
            <span>{orderDate}</span>
          </div>
          <div className="flex justify-between">
            <span>NO. ORDER</span>
            <span>#{id}</span>
          </div>
          <div className="flex justify-between">
            <span>TIPE</span>
            <span className="uppercase">{orderType === 'pickup' ? 'Ambil Sendiri' : 'Delivery'}</span>
          </div>
          <div className="flex justify-between">
            <span>METODE</span>
            <span className="uppercase">{paymentMethod}</span>
          </div>
        </div>

        <div className="border-b-2 border-dashed border-slate-300 my-4"></div>

        <div className="space-y-3 mb-4 text-sm">
          {orderedItems.map((item) => (
            <div key={item.idMeal}>
              <div className="font-bold uppercase line-clamp-1">{item.strMeal}</div>
              <div className="flex justify-between text-slate-600 mt-1">
                <span>{item.quantity} x {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(item.price)}</span>
                <span>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(item.price * item.quantity)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="border-b-2 border-dashed border-slate-300 my-4"></div>

        <div className="flex justify-between font-extrabold text-lg mt-2">
          <span>TOTAL</span>
          <span>{formattedTotal}</span>
        </div>

        <div className="border-b-2 border-dashed border-slate-300 my-4"></div>

        {orderType === 'delivery' && (
          <div className="text-xs mb-4">
            <p className="font-bold mb-1">ALAMAT PENGIRIMAN:</p>
            <p className="text-slate-600">{address}</p>
            <div className="border-b-2 border-dashed border-slate-300 my-4"></div>
          </div>
        )}

        <div className="text-center text-xs mt-6 text-slate-500">
          <p>Terima kasih atas kunjungannya!</p>
          <p className="mt-1">Layanan Pelanggan: cs@carimakan.id</p>
        </div>

        {/* Zigzag Bottom */}
        <div className="absolute -bottom-2 left-0 right-0 h-3 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSI4Ij48cG9seWdvbiBwb2ludHM9IjAsMCA4LDggMTYsMCIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')] bg-repeat-x drop-shadow-sm"></div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 max-w-sm mx-auto">
        <button
          onClick={handleDownloadBill}
          className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white py-4 rounded-2xl font-bold hover:bg-slate-900 transition-colors shadow-lg active:scale-95"
        >
          <Download size={20} />
          Simpan Struk (PDF)
        </button>

        <Link
          to="/"
          className="w-full flex items-center justify-center gap-2 bg-blue-100 text-blue-700 py-4 rounded-2xl font-bold hover:bg-blue-200 transition-colors active:scale-95"
        >
          <ArrowLeft size={20} />
          Kembali ke Beranda
        </Link>
      </div>

    </div>
  );
};

export default BillPage;
