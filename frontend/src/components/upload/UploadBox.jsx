const UploadBox = () => {
  return (
    <div className="rounded-2xl border-2 border-dashed border-[#E27C3E] bg-[#FFF8F4] p-8 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFE5D3] text-3xl">
        📎
      </div>

      <h3 className="mt-4 text-xl font-bold text-gray-900">Upload Nota</h3>
      <p className="mt-2 text-sm leading-6 text-gray-600">
        Seret file ke area ini atau klik tombol di bawah untuk memilih gambar nota.
      </p>

      <button className="mt-6 rounded-xl bg-[#E27C3E] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#cf6f36]">
        Pilih File
      </button>

      <p className="mt-3 text-xs text-gray-500">Format yang disarankan: JPG, JPEG, PNG</p>
    </div>
  );
};

export default UploadBox;