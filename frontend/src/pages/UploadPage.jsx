import { useEffect, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import UploadBox from '../components/upload/UploadBox';
import ReceiptPreview from '../components/upload/ReceiptPreview';
import { apiUrl } from '../utils/api';
import Swal from 'sweetalert2';

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
    setScanResult(null); 
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

    setIsScanning(true);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile); 

      const token = localStorage.getItem('token');

      const res = await fetch(apiUrl('/api/nota/scan'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      // 🚨 PERTAHANAN KEAMANAN: Tangkap usiran dari Backend (Token palsu/kadaluarsa)
      if (res.status === 401) {
        Swal.fire({
          icon: 'warning',
          title: 'Sesi Berakhir',
          text: 'Sesi Anda telah habis atau tidak valid. Silakan login kembali.',
          confirmButtonColor: '#ea8327'
        }).then(() => {
          localStorage.removeItem('token'); // Buang token kadaluarsa
          window.location.href = '/login'; // Tendang ke halaman login
        });
        setIsScanning(false);
        return; // Hentikan proses agar kode di bawah tidak error
      }

      const result = await res.json();

      if (res.ok) {
        if (isRejectedScanResult(result)) {
          setScanResult(null);

          Swal.fire({
            icon: 'warning',
            title: 'Scan Ditolak',
            text: getRejectedScanReason(result),
            confirmButtonColor: '#ea8327'
          }).then(() => {
            handleClearFile(); // Opsional: bersihkan layar jika ditolak
          });
          return;
        }

        // 5. Jika sukses, simpan datanya dan beritahu user
        const extractedData = result.data || result.result || result;
        setScanResult(extractedData);
        
        Swal.fire({
          icon: 'success',
          title: 'Scan Selesai!',
          text: 'AI berhasil membaca nota Anda.',
          confirmButtonColor: '#35c759'
        });
      } else {
        // Tentukan pesan error yang tepat
        const errorMessage = (result.status === 'error' && result.message) 
          ? result.message 
          : 'Gambar tidak memiliki teks nota yang cukup jelas. Silakan foto ulang.';

        // JIKA GAGAL / BUKAN NOTA / TEKS KOSONG
        Swal.fire({
          icon: 'error',
          title: 'Bukan Nota',
          text: errorMessage, 
          confirmButtonColor: '#ea8327'
        }).then(() => {
          // Bersihkan layar dari gambar yang salah setelah user klik OK
          handleClearFile();
        });
      }
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Koneksi Terputus',
        text: 'Tidak dapat terhubung ke server.',
        confirmButtonColor: '#ea8327'
      }).then(() => {
        handleClearFile();
      });
    } finally {
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
          isScanning={isScanning} 
          onScan={handleScanReceipt} 
          onClear={handleClearFile}
          scanData={scanResult} 
        />
      </div>
    </DashboardLayout>
  );
};

export default UploadPage;
