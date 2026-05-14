import { useState, useEffect } from 'react';
import { Scan, Trash2, Save, Store, Calendar, DollarSign, CheckCircle2 } from 'lucide-react';
import Swal from 'sweetalert2';

const ReceiptPreview = ({ file, previewUrl, isScanning, onScan, onClear, scanData }) => {
  // State penampung data formulir yang bisa diedit oleh user
  const [formData, setFormData] = useState({
    toko: '',
    tanggal: '',
    totalHarga: ''
  });

  // Effect ini akan otomatis membedah data dari AI ke dalam kotak input formulir
  useEffect(() => {
    if (scanData) {
      let extractedToko = '';
      let extractedTanggal = '';
      let extractedTotal = '';

      // 🚨 PERBAIKAN UTAMA: Kita tembus bungkus 'data' dari balasan tim AI
      // Jika AI membungkusnya di dalam object 'data', kita ambil dalamnya. Jika tidak, pakai luarannya.
      const aiContent = scanData.data || scanData;

      // 1. JIKA TIM AI SUDAH BIKIN RAPI (Buat jaga-jaga ke depannya)
      if (aiContent.nama_toko || aiContent.tanggal || aiContent.total_harga) {
        extractedToko = aiContent.nama_toko || '';
        extractedTanggal = aiContent.tanggal || '';
        extractedTotal = aiContent.total_harga || '';
      } 
      // 2. JIKA MASIH BERANTAKAN (Ekstrak sendiri dari raw_text)
      else if (aiContent.raw_text) {
        const text = aiContent.raw_text;

        // Ekstrak Tanggal (Contoh target: TANGGAL : 2026-01-05)
        const dateMatch = text.match(/TANGGAL\s*:\s*(\d{4}-\d{2}-\d{2})/i);
        if (dateMatch) extractedTanggal = dateMatch[1];

        // Ekstrak Total Harga (Contoh target: TOTAL ; Rp 107,000.00)
        const totalMatch = text.match(/TOTAL\s*[;:]\s*Rp\s*([\d,\.]+)/i);
        if (totalMatch) {
          // Bersihkan koma dan hapus angka di belakang titik (107,000.00 -> 107000)
          extractedTotal = totalMatch[1].replace(/,/g, '').split('.')[0]; 
        }

        // Ekstrak Nama Toko (Contoh target: KIOS NADYA)
        const tokoMatch = text.match(/KIOS\s+[A-Z\s]+/i);
        if (tokoMatch) {
          extractedToko = tokoMatch[0].split(',')[0].trim(); 
        }
      }

      // Masukkan hasil tangkapan ke dalam kotak input formulir
      setFormData({
        toko: extractedToko,
        tanggal: extractedTanggal,
        totalHarga: extractedTotal
      });
    }
  }, [scanData]);

  // Fungsi untuk menangani ketikan user saat mengedit hasil AI
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

// Fungsi untuk menyimpan data final ke Database (Prisma)
const handleSaveToDatabase = async () => {
    Swal.fire({
      title: 'Menyimpan Nota...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    try {
      const token = localStorage.getItem('token');

      // KITA GUNAKAN FORMDATA KARENA AKAN MENGIRIM FILE GAMBAR & TEKS
      const formDataToSend = new FormData();
      formDataToSend.append('toko', formData.toko);
      formDataToSend.append('tanggal', formData.tanggal);
      formDataToSend.append('totalHarga', formData.totalHarga);
      
      if (file) {
        formDataToSend.append('image', file); // Mengambil dari props
      }

      const res = await fetch('http://localhost:5000/api/nota/save', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}` 
          // INGAT: JANGAN pakai 'Content-Type': 'application/json' jika pakai FormData
        },
        body: formDataToSend
      });

      const result = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Nota Tersimpan!',
          text: 'Data dan gambar berhasil diamankan di database.',
          confirmButtonColor: '#35c759'
        }).then(() => onClear());
      } else {
        Swal.fire({ icon: 'error', title: 'Gagal', text: result.message });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Gagal terhubung.' });
    }
  };

  if (!file && !previewUrl) {
    return (
      <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-[12px] border-2 border-dashed border-[#e6ddd2] bg-[#faf8f5] text-center p-6">
        <Scan className="mb-4 h-12 w-12 text-[#c1b5a5]" />
        <h3 className="text-lg font-medium text-[#7a6f61]">Belum ada nota</h3>
        <p className="mt-1 max-w-[250px] text-sm text-[#9f9485]">
          Pilih file foto di samping untuk melihat pratinjau dan mulai memindai.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-[12px] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.07)] border border-[#f2e4d7]">
      {/* AREA HEADER & PREVIEW GAMBAR */}
      <div className="relative flex max-h-[300px] items-center justify-center bg-[#1a1a1a] p-4 overflow-hidden">
        <img
          src={previewUrl}
          alt="Preview"
          className={`max-h-[260px] w-auto object-contain transition-opacity duration-300 ${isScanning ? 'opacity-40 blur-[2px]' : 'opacity-100'}`}
        />
        
        {isScanning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-[#ea8327]"></div>
            <p className="mt-4 font-medium tracking-wider text-sm animate-pulse">AI MEMBACA DATA...</p>
          </div>
        )}
      </div>

      {/* AREA KONTROL & FORMULIR */}
      <div className="p-6">
        {!scanData ? (
          /* JIKA BELUM DI-SCAN: TAMPILKAN TOMBOL SCAN */
          <div className="flex gap-3">
            <button
              onClick={onScan}
              disabled={isScanning}
              className="flex-1 flex items-center justify-center gap-2 rounded-[8px] bg-[#ea8327] py-4 text-sm font-bold text-white transition hover:bg-[#d57421] disabled:opacity-50"
            >
              <Scan className="h-5 w-5" />
              {isScanning ? 'MEMPROSES...' : 'SCAN DENGAN AI'}
            </button>
            <button
              onClick={onClear}
              disabled={isScanning}
              className="flex items-center justify-center rounded-[8px] bg-[#fff1e1] px-5 py-4 text-[#ea8327] transition hover:bg-[#ffe6ca] disabled:opacity-50"
              title="Hapus gambar"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ) : (
          /* JIKA SUDAH DI-SCAN: TAMPILKAN FORMULIR VALIDASI */
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-4 flex items-center gap-2 text-[#249a43]">
              <CheckCircle2 className="h-5 w-5" />
              <h3 className="font-semibold">Validasi Hasil AI</h3>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <label className="mb-1.5 flex items-center gap-2 font-medium text-[#4b4b4b]">
                  <Store className="h-4 w-4 text-[#ea8327]" /> Nama Toko / Vendor
                </label>
                <input
                  type="text"
                  name="toko"
                  value={formData.toko}
                  onChange={handleChange}
                  className="w-full rounded-[8px] border border-[#e6ddd2] bg-white px-4 py-2.5 outline-none transition focus:border-[#ea8327] focus:ring-1 focus:ring-[#ea8327]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 flex items-center gap-2 font-medium text-[#4b4b4b]">
                    <Calendar className="h-4 w-4 text-[#ea8327]" /> Tanggal
                  </label>
                  <input
                    type="text" 
                    name="tanggal"
                    value={formData.tanggal}
                    onChange={handleChange}
                    className="w-full rounded-[8px] border border-[#e6ddd2] bg-white px-4 py-2.5 outline-none transition focus:border-[#ea8327] focus:ring-1 focus:ring-[#ea8327]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 flex items-center gap-2 font-medium text-[#4b4b4b]">
                    <DollarSign className="h-4 w-4 text-[#ea8327]" /> Total Harga (Rp)
                  </label>
                  <input
                    type="number"
                    name="totalHarga"
                    value={formData.totalHarga}
                    onChange={handleChange}
                    className="w-full rounded-[8px] border border-[#e6ddd2] bg-white px-4 py-2.5 outline-none transition focus:border-[#ea8327] focus:ring-1 focus:ring-[#ea8327]"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleSaveToDatabase}
                className="flex-1 flex items-center justify-center gap-2 rounded-[8px] bg-[#35c759] py-3.5 text-sm font-bold text-white transition hover:bg-[#2db44f] shadow-lg shadow-green-500/20"
              >
                <Save className="h-5 w-5" />
                SIMPAN FINAL
              </button>
              <button
                onClick={onClear}
                className="flex items-center justify-center rounded-[8px] bg-gray-100 px-5 py-3.5 text-gray-500 transition hover:bg-gray-200 font-medium text-sm"
              >
                BATAL
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiptPreview;