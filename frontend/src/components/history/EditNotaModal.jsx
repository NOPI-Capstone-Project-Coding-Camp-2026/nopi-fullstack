import { useState } from 'react';
import { X } from 'lucide-react';

const inputClassName = (isInvalid = false) =>
  `w-full rounded-[8px] border bg-white px-3 py-2.5 text-sm text-[#2d2d2d] outline-none transition placeholder:text-[#b8b0a7] focus:border-[#ea8327] focus:ring-1 focus:ring-[#ea8327] ${
    isInvalid ? 'border-[#f2a38f] bg-[#fff8f4]' : 'border-[#eadfd4]'
  }`;

const hasValue = (value) => value !== null && value !== undefined && `${value}`.trim() !== '';

const getFirstValue = (source, keys) => {
  if (!source || typeof source !== 'object') {
    return '';
  }

  for (const key of keys) {
    if (hasValue(source[key])) {
      return source[key];
    }
  }

  return '';
};

const parseCurrencyValue = (value) => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  if (!hasValue(value)) {
    return 0;
  }

  const compactValue = `${value}`.trim().replace(/[^\d,.-]/g, '');

  if (!compactValue) {
    return 0;
  }

  const lastComma = compactValue.lastIndexOf(',');
  const lastDot = compactValue.lastIndexOf('.');
  let normalizedValue = compactValue;

  if (lastComma > -1 && lastDot > -1) {
    normalizedValue =
      lastComma > lastDot
        ? compactValue.replace(/\./g, '').replace(',', '.')
        : compactValue.replace(/,/g, '');
  } else if (lastComma > -1) {
    const digitsAfterComma = compactValue.length - lastComma - 1;
    normalizedValue =
      digitsAfterComma === 3
        ? compactValue.replace(/,/g, '')
        : compactValue.replace(',', '.');
  } else if (lastDot > -1) {
    const dotParts = compactValue.split('.');
    const digitsAfterDot = compactValue.length - lastDot - 1;
    normalizedValue =
      dotParts.length > 2 || digitsAfterDot === 3
        ? compactValue.replace(/\./g, '')
        : compactValue;
  }

  const parsedValue = Number(normalizedValue);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const normalizeNumberText = (value) => {
  if (!hasValue(value)) {
    return '';
  }

  const numericValue = parseCurrencyValue(value);
  return Number.isFinite(numericValue) ? `${numericValue}` : '';
};

const getValidDate = (value) => {
  if (!hasValue(value)) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getIndonesiaDateInputValue = (value) => {
  const date = getValidDate(value);

  if (!date) {
    return '';
  }

  const dateParts = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const mappedParts = dateParts.reduce((parts, part) => {
    if (part.type === 'year' || part.type === 'month' || part.type === 'day') {
      return { ...parts, [part.type]: part.value };
    }

    return parts;
  }, {});

  if (!mappedParts.year || !mappedParts.month || !mappedParts.day) {
    return '';
  }

  return `${mappedParts.year}-${mappedParts.month}-${mappedParts.day}`;
};

const buildInitialForm = (nota) => {
  const rawNota = nota?.rawNota || nota || {};
  const dateParts = nota?.dateParts;
  const fallbackDate = dateParts?.year && dateParts?.month && dateParts?.day
    ? `${dateParts.year}-${String(dateParts.month).padStart(2, '0')}-${String(dateParts.day).padStart(2, '0')}`
    : '';
  const rawTotalHarga = getFirstValue(rawNota, ['totalHarga', 'cost', 'rawCost']);
  const totalHarga = hasValue(rawTotalHarga) ? rawTotalHarga : getFirstValue(nota, ['rawCost', 'cost']);

  return {
    toko: getFirstValue(rawNota, ['toko', 'merchant', 'nama_toko']) || nota?.merchant || '',
    tanggal: getIndonesiaDateInputValue(getFirstValue(rawNota, ['tanggal', 'date', 'createdAt'])) || fallbackDate,
    totalHarga: normalizeNumberText(totalHarga),
  };
};

const validateForm = (formData) => {
  const errors = {};
  const totalHarga = Number(formData.totalHarga);

  if (!formData.toko.trim()) {
    errors.toko = 'Nama toko tidak boleh kosong.';
  }

  if (!formData.tanggal) {
    errors.tanggal = 'Tanggal nota tidak boleh kosong.';
  }

  if (formData.totalHarga === '' || !Number.isFinite(totalHarga) || totalHarga < 0) {
    errors.totalHarga = 'Total harga harus angka valid dan tidak negatif.';
  }

  return errors;
};

const EditNotaModal = ({ isOpen, nota, onClose, onSaveAttempt, isSaving = false }) => {
  const [formData, setFormData] = useState(() => buildInitialForm(nota));
  const [errors, setErrors] = useState({});

  if (!isOpen) {
    return null;
  }

  const notaId = nota?.id || nota?._id || nota?.rawNota?.id || nota?.rawNota?._id;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    const nextErrors = validateForm(formData);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      await onSaveAttempt({
        id: notaId,
        toko: formData.toko.trim(),
        tanggal: formData.tanggal,
        totalHarga: Number(formData.totalHarga),
      });
      onClose();
    } catch {
      // Error feedback is shown by the parent so the modal can stay open.
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#1f1f1f]/50 px-4 py-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-nota-title"
        className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-[8px] bg-white shadow-[0_22px_50px_rgba(15,23,42,0.22)]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#f3e7dc] px-5 py-4 sm:px-6">
          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#d96f0a]">
              Edit Nota
            </p>
            <h2 id="edit-nota-title" className="mt-1 text-xl font-semibold text-[#2c2c2c] sm:text-2xl">
              Form perubahan nota
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] border border-[#f0e5d8] bg-[#fff8f0] text-[#e27c3e] transition hover:bg-[#fff0df] disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Tutup modal edit nota"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[calc(90vh-92px)] overflow-y-auto px-5 py-5 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-semibold text-[#6d6258]">Nama Toko Supplier</span>
              <input
                type="text"
                name="toko"
                value={formData.toko}
                onChange={handleChange}
                placeholder="Masukkan nama toko"
                className={inputClassName(Boolean(errors.toko))}
              />
              {errors.toko ? <p className="mt-1.5 text-xs font-semibold text-[#d94835]">{errors.toko}</p> : null}
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-[#6d6258]">Tanggal Nota</span>
              <input
                type="date"
                name="tanggal"
                value={formData.tanggal}
                onChange={handleChange}
                className={inputClassName(Boolean(errors.tanggal))}
              />
              {errors.tanggal ? (
                <p className="mt-1.5 text-xs font-semibold text-[#d94835]">{errors.tanggal}</p>
              ) : null}
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-[#6d6258]">Total Harga</span>
              <input
                type="number"
                min="0"
                name="totalHarga"
                value={formData.totalHarga}
                onChange={handleChange}
                placeholder="0"
                className={inputClassName(Boolean(errors.totalHarga))}
              />
              {errors.totalHarga ? (
                <p className="mt-1.5 text-xs font-semibold text-[#d94835]">{errors.totalHarga}</p>
              ) : null}
            </label>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#f3e7dc] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="inline-flex items-center justify-center rounded-[8px] border border-[#d8d8d8] bg-white px-5 py-3 text-sm font-semibold text-[#666] transition hover:bg-[#fafafa] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center rounded-[8px] bg-[#35c759] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(53,199,89,0.16)] transition hover:bg-[#2db44f] disabled:cursor-not-allowed disabled:opacity-75"
            >
              {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditNotaModal;
