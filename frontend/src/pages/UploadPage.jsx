import DashboardLayout from '../components/layout/DashboardLayout';
import UploadBox from '../components/upload/UploadBox';
import ReceiptPreview from '../components/upload/ReceiptPreview';

const UploadPage = () => {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-[3.2rem] font-semibold tracking-[-0.06em] text-[#ea8327]">
          Tambah Nota Baru
        </h1>
        <p className="mt-3 text-[1.15rem] text-[#2d2d2d]">
          Pastikan teks terlihat jelas dan pencahayaan cukup untuk akurasi terbaik.
        </p>
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1.6fr_0.56fr]">
        <UploadBox />
        <ReceiptPreview />
      </div>
    </DashboardLayout>
  );
};

export default UploadPage;
