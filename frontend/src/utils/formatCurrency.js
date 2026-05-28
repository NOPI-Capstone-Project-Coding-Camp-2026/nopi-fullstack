/**
 * Shared currency utilities untuk seluruh halaman frontend NOPI.
 * Sebelumnya, fungsi-fungsi ini diduplikasi di 4+ file:
 *   Dashboard.jsx, History.jsx, DetailNotaPage.jsx, ReceiptPreview.jsx
 *
 * Ekstraksi ke sini memastikan format Rupiah konsisten di semua tampilan.
 */

/**
 * Mem-parse nilai apapun (string angka, float, integer) menjadi Number Indonesia-safe.
 * Menangani format "1.000,50" (ID) maupun "1,000.50" (EN) secara otomatis.
 *
 * @param {string|number|null|undefined} value
 * @returns {number}
 */
export const parseCurrencyValue = (value) => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  if (value === null || value === undefined) {
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
    // Keduanya ada — yang paling belakang adalah desimal
    normalizedValue =
      lastComma > lastDot
        ? compactValue.replace(/\./g, '').replace(',', '.')
        : compactValue.replace(/,/g, '');
  } else if (lastComma > -1) {
    // Hanya koma: jika 3 digit setelahnya, itu pemisah ribuan (bukan desimal)
    const digitsAfterComma = compactValue.length - lastComma - 1;
    normalizedValue =
      digitsAfterComma === 3
        ? compactValue.replace(/,/g, '')
        : compactValue.replace(',', '.');
  } else if (lastDot > -1) {
    // Hanya titik: jika 3 digit setelahnya, itu pemisah ribuan
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

/**
 * Memformat angka menjadi string mata uang Rupiah Indonesia.
 * Contoh: 15000 → "Rp 15.000"
 *
 * @param {string|number|null|undefined} value
 * @param {string} [fallback='-'] - Nilai tampil jika input tidak valid
 * @returns {string}
 */
export const formatCurrency = (value, fallback = '-') => {
  const numericValue = typeof value === 'number' ? value : parseCurrencyValue(value);
  if (!Number.isFinite(numericValue)) return fallback;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(numericValue);
};

/**
 * Memformat angka menjadi string Rupiah — alias ringkas dari formatCurrency.
 * Digunakan di Dashboard untuk tampilan total modal.
 *
 * @param {number} number
 * @returns {string}
 */
export const formatRupiah = (number) => formatCurrency(number, 'Rp 0');

/**
 * Memformat persentase margin dengan 2 desimal maksimal.
 * Contoh: 12.5 → "12,5%"
 *
 * @param {string|number|null|undefined} value
 * @param {string} [fallback='0%']
 * @returns {string}
 */
export const formatPercent = (value, fallback = '0%') => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return fallback;
  return `${numericValue.toLocaleString('id-ID', { maximumFractionDigits: 2 })}%`;
};
