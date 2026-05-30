import { useContext, useEffect, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import UploadBox from '../components/upload/UploadBox';
import ReceiptPreview from '../components/upload/ReceiptPreview';
import { apiUrl } from '../utils/api';
import { canUseMockAuth } from '../utils/mockAuth';
import { generateMockScanResult } from '../utils/mockData';
import Swal from 'sweetalert2';
import { AuthContext } from '../context/AuthContext';

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
  const { logout } = useContext(AuthContext);
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

    // FIX: Hapus draft sesi sebelumnya agar tidak mencemari hasil scan baru
    sessionStorage.removeItem('nopi-receipt-draft');

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setIsScanning(false);
    setScanResult(null);
  };

  const handleClearFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    // FIX: Hapus draft saat BATAL agar sesi berikutnya selalu mulai bersih
    sessionStorage.removeItem('nopi-receipt-draft');

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

    // Hapus draft lama sebelum scan baru dimulai, agar hasil AI tidak
    // tertimpa data dari sesi scan sebelumnya.
    sessionStorage.removeItem('nopi-receipt-draft');

    setIsScanning(true);

    // ─── MOCK MODE BYPASS ──────────────────────────────────────────────────────
    // Jika mock auth aktif (mode dev tanpa backend), gunakan data scan palsu
    // agar seluruh flow upload → preview → simpan dapat diuji offline.
    if (canUseMockAuth()) {
      await new Promise((resolve) => setTimeout(resolve, 1200)); // simulasi delay AI
      const mockResult = generateMockScanResult();
      setScanResult(mockResult.data);
      setIsScanning(false);
      Swal.fire({
        icon: 'success',
        title: 'Scan Selesai! (Mock)',
        text: 'Mode demo: AI berhasil membaca nota simulasi.',
        confirmButtonColor: '#35c759',
        confirmButtonText: 'Lihat Hasil',
      });
      return;
    }
    // ──────────────────────────────────────────────────────────────────────────

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
          // Delegasi ke logout() AuthContext:
          // googleLogout + hapus token & user + reset Context + full reload
          logout();
        });
        setIsScanning(false);
        return;
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
          confirmButtonColor: '#35c759',
          confirmButtonText: 'Lihat Hasil',
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
          key={previewUrl}
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
