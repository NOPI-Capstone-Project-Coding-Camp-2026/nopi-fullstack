import { useEffect, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import UploadBox from '../components/upload/UploadBox';
import ReceiptPreview from '../components/upload/ReceiptPreview';

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);

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
  };

  const handleClearFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl('');
    setIsScanning(false);
  };

  const handleScanReceipt = () => {
    if (!selectedFile) {
      return;
    }

    setIsScanning(true);
  };

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

      <div className="mt-7 grid min-w-0 gap-5 overflow-hidden xl:grid-cols-[minmax(0,1.18fr)_minmax(320px,0.72fr)] xl:items-center xl:gap-6">
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
        />
      </div>
    </DashboardLayout>
  );
};

export default UploadPage;
