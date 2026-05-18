import { useEffect, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import UploadBox from '../components/upload/UploadBox';
import ReceiptPreview from '../components/upload/ReceiptPreview';
import { apiUrl } from '../utils/api';
import Swal from 'sweetalert2'; // <--- Jangan lupa import Swal

const isRejectedScanResult = (result) =>
  result?.status === 'rejected' ||
  result?.data?.status === 'rejected' ||
  result?.result?.status === 'rejected';

const getRejectedScanReason = (result) =>
  result?.reason ||
  result?.data?.reason ||
  result?.result?.reason ||
  'Gambar belum dikenali sebagai nota. Gunakan foto struk atau nota yang lebih jelas.';

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  
  // (Opsional) State baru untuk menyimpan hasil teks dari AI jika ingin ditampilkan
  const [scanResult, setScanResult] = useState(null); 

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = (file) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setIsScanning(false);
    setScanResult(null); // Kosongkan hasil scan jika user mengganti foto
  };

  const handleClearFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl('');
    setIsScanning(false);
    setScanResult(null);
  };

  // --- MESIN UTAMA SCAN AI ---
  const handleScanReceipt = async () => {
    if (!selectedFile) {
      return;
    }

    // 1. Nyalakan animasi loading di komponen ReceiptPreview-mu
    setIsScanning(true);

    try {
      // 2. Bungkus foto ke dalam format yang bisa dikirim melalui jaringan
      const formData = new FormData();
      formData.append('image', selectedFile); // 'image' wajib sama dengan multer di backend

      // 3. Ambil "Surat Izin" (Token) user yang sedang login
      const token = localStorage.getItem('token');

      // 4. Tembak foto ke Backend NOPI
      const res = await fetch(apiUrl('/api/nota/scan'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await res.json();

      if (res.ok) {
        if (isRejectedScanResult(result)) {
          setScanResult(null);

          Swal.fire({
            icon: 'warning',
            title: 'Scan Ditolak',
            text: getRejectedScanReason(result),
            confirmButtonColor: '#ea8327'
          });
          return;
        }

        // 5. Jika sukses, simpan datanya dan beritahu user
        const extractedData = result.data || result.result || result;
        setScanResult(extractedData);
        console.log("Data hasil ekstrak:", extractedData); // Bisa dicek di Inspect Element (Console)
        
        Swal.fire({
          icon: 'success',
          title: 'Scan Selesai!',
          text: 'AI berhasil membaca nota Anda.',
          confirmButtonColor: '#35c759'
        });
      } else {
        // 6. Jika backend/AI error
        Swal.fire({
          icon: 'error',
          title: 'Gagal Membaca Nota',
          text: result.message,
          confirmButtonColor: '#ea8327'
        });
      }
    } catch {
      // 7. Jika server backend mati atau koneksi putus
      Swal.fire({
        icon: 'error',
        title: 'Koneksi Terputus',
        text: 'Tidak dapat terhubung ke server.',
        confirmButtonColor: '#ea8327'
      });
    } finally {
      // 8. Apapun yang terjadi (sukses/gagal), matikan animasi loading
      setIsScanning(false);
    }
  };
  // ---------------------------

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-[1.9rem] font-semibold tracking-[-0.06em] text-[#ea8327] sm:text-[2.25rem] lg:text-[2.7rem]">
          Tambah Nota Baru
        </h1>
        <p className="mt-2.5 max-w-2xl text-[0.95rem] text-[#2d2d2d] sm:text-[1rem] lg:text-[1.03rem]">
          Pastikan teks terlihat jelas dan pencahayaan cukup untuk akurasi terbaik.
        </p>
      </div>

      <div className="mt-7 grid min-w-0 gap-5 overflow-hidden xl:grid-cols-[minmax(280px,0.58fr)_minmax(0,1.42fr)] xl:items-start xl:gap-6">
        <UploadBox
          selectedFile={selectedFile}
          onFileSelect={handleFileSelect}
          onClearFile={handleClearFile}
        />
        <ReceiptPreview
          file={selectedFile}
          previewUrl={previewUrl}
          isScanning={isScanning} // Akan trigger animasi loading di komponenmu
          onScan={handleScanReceipt} // Fungsi baru kita dipanggil di sini!
          onClear={handleClearFile}
          // Opsional: Kamu bisa melempar scanResult ke ReceiptPreview kalau butuh ditampilkan
          scanData={scanResult} 
        />
      </div>
    </DashboardLayout>
  );
};

export default UploadPage;
