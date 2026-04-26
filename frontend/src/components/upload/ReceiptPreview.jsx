import { SparklesIcon } from '../ui/AppIcons';

const ReceiptPreview = ({ file, previewUrl, isScanning = false, onScan, onClear }) => {
  const hasFile = Boolean(file);

  return (
    <aside className="min-w-0 overflow-hidden rounded-[8px] bg-[#35c759] p-5 text-white shadow-[0_16px_32px_rgba(53,199,89,0.28)] sm:p-6 xl:min-h-[420px]">
      <h3 className="text-[1.35rem] font-semibold leading-tight sm:text-[1.55rem]">
        {hasFile ? 'Preview Nota' : 'Siap untuk Memproses?'}
      </h3>
      <p className="mt-3 text-[0.95rem] leading-7 text-white/95 sm:text-[0.98rem] sm:leading-8">
        {hasFile
          ? 'File sudah berhasil dipilih. Anda bisa cek preview nota sebelum lanjut ke proses scan.'
          : 'Kurator AI kami akan mengekstrak tanggal, toko dan total biaya secara otomatis.'}
      </p>

      <div className="mt-5 min-w-0 overflow-hidden rounded-[8px] border border-white/20 bg-white/10">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview nota yang dipilih"
            className="block h-[240px] w-full max-w-full object-cover sm:h-[280px]"
          />
        ) : (
          <div className="flex h-[280px] flex-col items-center justify-center px-6 text-center">
            <div className="text-5xl text-white/80">⌁</div>
            <p className="mt-4 text-sm leading-6 text-white/85">
              Preview nota akan muncul di sini setelah Anda memilih file.
            </p>
          </div>
        )}
      </div>

      {file ? (
        <div className="mt-4 min-w-0 overflow-hidden rounded-[8px] bg-white/12 px-4 py-3">
          <p className="truncate text-sm font-semibold text-white">{file.name}</p>
          <p className="mt-1 text-xs text-white/80">
            {(file.size / (1024 * 1024)).toFixed(2)} MB
          </p>
        </div>
      ) : null}

      <button
        type="button"
        onClick={onScan}
        disabled={!hasFile || isScanning}
        className={`mt-7 inline-flex w-full items-center justify-center gap-3 rounded-[8px] px-6 py-3.5 text-[0.95rem] font-medium transition sm:w-auto sm:min-w-[170px] ${
          hasFile && !isScanning
            ? 'bg-white text-[#23a447] hover:bg-[#f2fff5]'
            : 'cursor-not-allowed bg-white/30 text-white/80'
        }`}
      >
        <SparklesIcon className="h-5 w-5" />
        {isScanning ? 'Siap Diproses' : 'Pindai Nota'}
      </button>

      {hasFile ? (
        <button
          type="button"
          onClick={onClear}
          className="mt-3 inline-flex w-full items-center justify-center rounded-[8px] border border-white/35 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10 sm:w-auto sm:min-w-[170px]"
        >
          Ganti File
        </button>
      ) : null}
    </aside>
  );
};

export default ReceiptPreview;
