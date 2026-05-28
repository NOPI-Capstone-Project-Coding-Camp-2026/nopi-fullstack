/**
 * Mock Data Layer untuk mode development tanpa backend.
 *
 * Mengapa diperlukan:
 *   Sebelumnya, mode mock hanya mencakup auth (Login/Register via localStorage).
 *   Namun semua halaman protected (Upload, History, Dashboard, Detail) tetap
 *   memanggil fetch() ke backend riil. Jika backend mati, semua halaman
 *   menampilkan "Koneksi Terputus" meskipun mode mock aktif.
 *
 * Layer ini menyediakan CRUD nota berbasis localStorage sehingga seluruh
 *   alur pengguna dapat diuji sepenuhnya tanpa backend Express menyala.
 *
 * Hanya aktif jika: DEV mode && VITE_USE_MOCK_AUTH !== 'false'
 */

import { canUseMockAuth } from './mockAuth';

/** Key localStorage untuk penyimpanan nota mock */
const MOCK_NOTA_KEY = 'nopi-mock-notas';

/** ID unik sederhana berbasis timestamp */
const generateId = () => Date.now() + Math.floor(Math.random() * 1000);

/**
 * Ambil semua nota dari localStorage.
 * @returns {Array}
 */
export const getMockNotas = () => {
  if (!canUseMockAuth()) return [];
  try {
    const raw = localStorage.getItem(MOCK_NOTA_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/**
 * Simpan array nota kembali ke localStorage.
 * @param {Array} notas
 */
const saveMockNotas = (notas) => {
  localStorage.setItem(MOCK_NOTA_KEY, JSON.stringify(notas));
};

/**
 * Simpan satu nota baru ke localStorage.
 * Mengembalikan objek nota yang tersimpan (dengan id & timestamps).
 *
 * @param {{ toko: string, tanggal: string, totalHarga: number, items: Array, imageUrl?: string }} notaData
 * @returns {{ id: number, toko: string, tanggal: string, totalHarga: number, items: Array, imageUrl: string|null, createdAt: string, updatedAt: string }}
 */
export const saveMockNota = (notaData) => {
  const notas = getMockNotas();
  const now = new Date().toISOString();

  const newNota = {
    id: generateId(),
    toko: notaData.toko || 'Tidak Diketahui',
    tanggal: notaData.tanggal || now,
    totalHarga: notaData.totalHarga || 0,
    imageUrl: notaData.imageUrl || null,
    items: (notaData.items || []).map((item, idx) => ({
      id: generateId() + idx,
      namaBarang: item.namaBarang || item.itemName || '',
      jumlahBarang: item.jumlahBarang || item.quantity || 1,
      hargaSatuan: item.hargaSatuan ?? item.unitPrice ?? null,
      totalHargaItem: item.totalHargaItem ?? item.totalItemCost ?? 0,
      profitMargin: item.profitMargin ?? null,
      hargaJual: item.hargaJual ?? null,
      totalProfit: item.totalProfit ?? null,
    })),
    createdAt: now,
    updatedAt: now,
  };

  saveMockNotas([newNota, ...notas]);
  return newNota;
};

/**
 * Ambil satu nota berdasarkan ID.
 * @param {number|string} id
 * @returns {object|null}
 */
export const getMockNotaById = (id) => {
  const notas = getMockNotas();
  return notas.find((n) => String(n.id) === String(id)) || null;
};

/**
 * Update nota yang sudah ada. Mengembalikan nota yang sudah diupdate, atau null jika tidak ditemukan.
 * @param {number|string} id
 * @param {{ toko?: string, tanggal?: string, items?: Array }} updates
 * @returns {object|null}
 */
export const updateMockNota = (id, updates) => {
  const notas = getMockNotas();
  let updatedNota = null;

  const newNotas = notas.map((n) => {
    if (String(n.id) !== String(id)) return n;

    const now = new Date().toISOString();
    const validItems = (updates.items || n.items || []).map((item, idx) => ({
      id: item.id || generateId() + idx,
      namaBarang: item.namaBarang || item.itemName || '',
      jumlahBarang: item.jumlahBarang || item.quantity || 1,
      hargaSatuan: item.hargaSatuan ?? item.unitPrice ?? null,
      totalHargaItem: item.totalHargaItem ?? item.totalItemCost ?? 0,
      profitMargin: item.profitMargin ?? null,
      hargaJual: item.hargaJual ?? null,
      totalProfit: item.totalProfit ?? null,
    }));

    const calculatedTotal = validItems.reduce((acc, i) => acc + (i.totalHargaItem || 0), 0);

    updatedNota = {
      ...n,
      toko: updates.toko ?? n.toko,
      tanggal: updates.tanggal ?? n.tanggal,
      totalHarga: calculatedTotal,
      items: validItems,
      updatedAt: now,
    };
    return updatedNota;
  });

  saveMockNotas(newNotas);
  return updatedNota;
};

/**
 * Hapus nota berdasarkan ID. Mengembalikan true jika berhasil.
 * @param {number|string} id
 * @returns {boolean}
 */
export const deleteMockNota = (id) => {
  const notas = getMockNotas();
  const filtered = notas.filter((n) => String(n.id) !== String(id));
  if (filtered.length === notas.length) return false;
  saveMockNotas(filtered);
  return true;
};

/**
 * Hasil scan nota palsu untuk simulasi response AI.
 * Struktur mengikuti format response API HuggingFace yang sudah digunakan ReceiptPreview.
 *
 * @returns {object}
 */
export const generateMockScanResult = () => ({
  message: 'Nota berhasil diekstrak oleh AI! (Mock Mode)',
  data: {
    raw_text: 'TOKO SEMBAKO MAJU\n26/05/2025\nBeras 5kg x2 Rp45000\nMinyak Goreng 1L x3 Rp18000\nGula Pasir 1kg x1 Rp16000\nTotal: Rp79000',
    nama_toko: 'Toko Sembako Maju',
    tanggal: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    parsed_items: {
      items: [
        {
          nama_barang: 'Beras 5kg',
          jumlah_barang: 2,
          harga_satuan: 45000,
          total_harga_item: 90000,
        },
        {
          nama_barang: 'Minyak Goreng 1L',
          jumlah_barang: 3,
          harga_satuan: 18000,
          total_harga_item: 54000,
        },
        {
          nama_barang: 'Gula Pasir 1kg',
          jumlah_barang: 1,
          harga_satuan: 16000,
          total_harga_item: 16000,
        },
      ],
    },
  },
});
