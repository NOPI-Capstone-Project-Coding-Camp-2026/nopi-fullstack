import { useRef, useState } from 'react';
import { CloseIcon, UploadCloudIcon } from '../ui/AppIcons';

const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const UploadBox = ({ selectedFile, onFileSelect, onClearFile }) => {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateFile = (file) => {
    if (!file) {
      return;
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setErrorMessage('Format file belum didukung. Gunakan JPG, JPEG, atau PNG.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage('Ukuran file terlalu besar. Maksimal 5 MB.');
      return;
    }

    setErrorMessage('');
    onFileSelect(file);
  };

  const handleInputChange = (event) => {
    const file = event.target.files?.[0];
    validateFile(file);
    event.target.value = '';
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    validateFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleOpenFilePicker = () => {
    inputRef.current?.click();
  };

  const handleClear = () => {
    setErrorMessage('');
    onClearFile();
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`min-w-0 overflow-hidden rounded-[8px] border-2 border-dashed p-5 text-center transition sm:p-7 xl:flex xl:min-h-[420px] xl:items-center xl:justify-center xl:p-8 ${
        isDragging
          ? 'border-[#cf6f36] bg-[#fff0e4]'
          : 'border-[#E27C3E] bg-[#FFF8F4]'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
        className="hidden"
        onChange={handleInputChange}
      />

      <div className="mx-auto flex w-full min-w-0 max-w-[34rem] flex-col items-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[8px] bg-[#FFE5D3] text-[#E27C3E] sm:h-16 sm:w-16">
          <UploadCloudIcon className="h-7 w-7 sm:h-8 sm:w-8" />
        </div>

        <h3 className="mt-4 text-[1.1rem] font-bold text-gray-900 sm:text-[1.2rem]">Upload Nota</h3>
        <p className="mt-2 max-w-[28rem] text-[0.92rem] leading-6 text-gray-600">
          Seret file ke area ini atau klik tombol di bawah untuk memilih gambar nota.
        </p>

        <button
          type="button"
          onClick={handleOpenFilePicker}
          className="mt-5 w-full rounded-[8px] bg-[#E27C3E] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#cf6f36] sm:w-auto sm:min-w-[170px]"
        >
          Pilih File
        </button>

        <p className="mt-3 text-xs text-gray-500">Format yang disarankan: JPG, JPEG, PNG maksimal 5 MB</p>

        {selectedFile ? (
          <div className="mt-5 w-full min-w-0 max-w-full rounded-[8px] border border-[#f1d6bf] bg-white px-4 py-3 text-left shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
            <div className="flex min-w-0 items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#2d2d2d]">{selectedFile.name}</p>
                <p className="mt-1 text-xs text-[#8d8d8d]">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>

              <button
                type="button"
                onClick={handleClear}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[#fff3ea] text-[#cf6f36] transition hover:bg-[#ffe6d4]"
                aria-label="Hapus file terpilih"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : null}

        {errorMessage ? <p className="mt-4 text-sm font-medium text-[#d84b36]">{errorMessage}</p> : null}
      </div>
    </div>
  );
};

export default UploadBox;
