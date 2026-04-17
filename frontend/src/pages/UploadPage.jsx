import DashboardLayout from '../components/layout/DashboardLayout';
import UploadBox from '../components/upload/UploadBox';
import ReceiptPreview from '../components/upload/ReceiptPreview';

const UploadPage = () => {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.06em] text-[#ea8327] sm:text-4xl lg:text-[3.2rem]">
          Tambah Nota Baru
        </h1>
        <p className="mt-3 text-base text-[#2d2d2d] sm:text-[1.05rem] lg:text-[1.15rem]">
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
