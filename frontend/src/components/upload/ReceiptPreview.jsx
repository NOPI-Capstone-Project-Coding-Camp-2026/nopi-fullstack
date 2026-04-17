import { SparklesIcon } from '../ui/AppIcons';

const ReceiptPreview = () => {
  return (
    <aside className="rounded-[28px] bg-[#35c759] p-5 text-white shadow-[0_16px_32px_rgba(53,199,89,0.28)] sm:p-7">
      <h3 className="text-[1.6rem] font-semibold leading-tight sm:text-[2rem]">Siap untuk Memproses?</h3>
      <p className="mt-4 text-base leading-7 text-white/95 sm:text-[1.05rem] sm:leading-9">
        Kurator AI kami akan mengekstrak tanggal, toko dan total biaya secara otomatis
      </p>

      <button
        type="button"
        className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-white px-6 py-4 text-base font-medium text-[#23a447] transition hover:bg-[#f2fff5] sm:w-auto sm:text-lg"
      >
        <SparklesIcon className="h-5 w-5" />
        Pindai Nota
      </button>
    </aside>
  );
};

export default ReceiptPreview;
