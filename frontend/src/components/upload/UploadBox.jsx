const UploadBox = () => {
  return (
    <div className="rounded-2xl border-2 border-dashed border-[#E27C3E] bg-[#FFF8F4] p-5 text-center sm:p-8">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FFE5D3] text-2xl sm:h-16 sm:w-16 sm:text-3xl">
        📎
      </div>

      <h3 className="mt-4 text-lg font-bold text-gray-900 sm:text-xl">Upload Nota</h3>
      <p className="mt-2 text-sm leading-6 text-gray-600">
        Seret file ke area ini atau klik tombol di bawah untuk memilih gambar nota.
      </p>

      <button className="mt-6 w-full rounded-xl bg-[#E27C3E] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#cf6f36] sm:w-auto">
        Pilih File
      </button>

      <p className="mt-3 text-xs text-gray-500">Format yang disarankan: JPG, JPEG, PNG</p>
    </div>
  );
};

export default UploadBox;
