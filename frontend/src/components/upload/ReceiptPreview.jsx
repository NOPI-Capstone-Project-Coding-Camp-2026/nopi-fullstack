import { SparklesIcon } from '../ui/AppIcons';

const ReceiptPreview = () => {
  return (
    <aside className="rounded-[28px] bg-[#35c759] p-7 text-white shadow-[0_16px_32px_rgba(53,199,89,0.28)]">
      <h3 className="text-[2rem] font-semibold leading-tight">Siap untuk Memproses?</h3>
      <p className="mt-4 text-[1.05rem] leading-9 text-white/95">
        Kurator AI kami akan mengekstrak tanggal, toko dan total biaya secara otomatis
      </p>

      <button
        type="button"
        className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-6 py-4 text-lg font-medium text-[#23a447] transition hover:bg-[#f2fff5]"
      >
        <SparklesIcon className="h-5 w-5" />
        Pindai Nota
      </button>
    </aside>
  );
};

export default ReceiptPreview;
