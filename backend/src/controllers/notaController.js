import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// ==========================================
// 1. FUNGSI UNTUK SCAN NOTA VIA AI
// ==========================================
export const scanNota = async (req, res) => {
  console.log("➡️ Masuk ke rute SCAN NOTA AI");

  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'Gambar nota tidak ditemukan!' });
    }

    const imageBlob = new Blob([req.file.buffer], { type: req.file.mimetype });
    
    const formData = new FormData();
    formData.append('file', imageBlob, req.file.originalname);

    const aiResponse = await fetch('https://aletta2206-nopi-ai-api.hf.space/api/extract-nota', {
      method: 'POST',
      body: formData,
    });

    if (!aiResponse.ok) {
      throw new Error(`AI API merespons dengan status: ${aiResponse.status}`);
    }

    const extractedData = await aiResponse.json();
    
    const aiData = extractedData.data || extractedData || {};
    const rawText = aiData.raw_text || '';
    const parsedItemsObj = aiData.parsed_items || {};
    const parsedItemsArray = parsedItemsObj.items || aiData.items || [];

    const isNotaValid = rawText.trim().length > 15 || parsedItemsArray.length > 0;

    if (!isNotaValid) {
      return res.status(400).json({
        status: 'error',
        message: 'Gambar tidak memiliki teks nota yang cukup jelas. Silakan foto ulang.'
      });
    }

    res.status(200).json({ message: 'Nota berhasil diekstrak oleh AI!', data: extractedData });
  } catch (error) {
    res.status(500).json({ status: 'error', message: "Terjadi kesalahan saat menghubungi server AI." });
  }
};

// ==========================================
// 2. FUNGSI UNTUK MENYIMPAN NOTA & BARANG KE DATABASE
// ==========================================
export const saveNota = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { toko, tanggal, items } = req.body; 
    
    let imageUrl = null;
    if (req.file) {
      const fileName = `${Date.now()}-${req.file.originalname.replace(/\s+/g, '-')}`;
      const { error: uploadError } = await supabase.storage
        .from('nota-images')
        .upload(fileName, req.file.buffer, { contentType: req.file.mimetype });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('nota-images').getPublicUrl(fileName);
      imageUrl = publicUrlData.publicUrl;
    }

    const parsedTanggal = tanggal ? new Date(tanggal) : new Date();

    let parsedItems = [];
    if (items) {
      try {
        parsedItems = JSON.parse(items);
      } catch (err) {
        console.log("Gagal mem-parsing data items");
      }
    }

    // 🚨 KUNCI KONSISTENSI: Hitung total dari item secara absolut
    const validItems = parsedItems.map(item => ({
      namaBarang: item.namaBarang || 'Tanpa Nama',
      jumlahBarang: parseInt(item.jumlahBarang) || 1,
      hargaSatuan: parseFloat(item.hargaSatuan) || null,
      totalHargaItem: parseFloat(item.totalHargaItem) || 0,
      profitMargin: parseFloat(item.profitMargin) || null,
      hargaJual: parseFloat(item.hargaJual) || null,
      totalProfit: parseFloat(item.totalProfit) || null
    }));

    const calculatedTotalHarga = validItems.reduce((acc, curr) => acc + curr.totalHargaItem, 0);

    const newNota = await prisma.nota.create({
      data: {
        toko: toko || 'Tidak Diketahui',
        totalHarga: calculatedTotalHarga, // 🚨 Masukkan hasil hitungan pasti
        tanggal: parsedTanggal,
        imageUrl: imageUrl, 
        userId: userId, 
        items: { create: validItems }
      },
      include: { items: true }
    });

    res.status(201).json({ status: 'success', message: 'Nota berhasil disimpan!', data: newNota });
  } catch (error) {
    res.status(500).json({ status: 'error', message: "Terjadi kesalahan saat menyimpan nota." });
  }
};

// ==========================================
// 3. FUNGSI UNTUK MENGAMBIL RIWAYAT NOTA
// ==========================================
export const getHistory = async (req, res) => {
  try {
    const history = await prisma.nota.findMany({
      where: { userId: req.user.userId },
      orderBy: { tanggal: 'desc' },
      include: { items: true } 
    });
    res.status(200).json({ status: 'success', data: history });
  } catch (error) {
    res.status(500).json({ status: 'error', message: "Gagal mengambil riwayat transaksi." });
  }
};

// ==========================================
// 4. FUNGSI UNTUK MENGAMBIL 1 NOTA SPESIFIK
// ==========================================
export const getNotaById = async (req, res) => {
  try {
    const { id } = req.params;
    const nota = await prisma.nota.findFirst({
      where: { id: Number(id), userId: req.user.userId },
      include: { items: true }
    });

    if (!nota) return res.status(404).json({ message: "Nota tidak ditemukan." });
    res.status(200).json({ status: 'success', data: nota });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

// ==========================================
// 5. FUNGSI UNTUK UPDATE NOTA (MODAL EDIT)
// ==========================================
export const updateNota = async (req, res) => {
  try {
    const { id } = req.params;
    const { toko, tanggal, items } = req.body;
    
    const existingNota = await prisma.nota.findFirst({
      where: { id: Number(id), userId: req.user.userId }
    });

    if (!existingNota) return res.status(404).json({ message: "Nota tidak ditemukan atau akses ditolak." });
    
    const parsedTanggal = tanggal ? new Date(tanggal) : new Date();

    const validItems = (items || []).map(item => ({
      namaBarang: item.namaBarang || 'Tanpa Nama',
      jumlahBarang: parseInt(item.jumlahBarang) || 1,
      hargaSatuan: parseFloat(item.hargaSatuan) || null,
      totalHargaItem: parseFloat(item.totalHargaItem) || 0,
      profitMargin: parseFloat(item.profitMargin) || null,
      hargaJual: parseFloat(item.hargaJual) || null,
      totalProfit: parseFloat(item.totalProfit) || null
    }));

    const calculatedTotalHarga = validItems.reduce((acc, curr) => acc + curr.totalHargaItem, 0);

    const updatedNota = await prisma.nota.update({
      where: { id: Number(id) },
      data: { 
        toko, 
        tanggal: parsedTanggal, 
        totalHarga: calculatedTotalHarga,
        items: {
          deleteMany: {}, 
          create: validItems
        }
      },
      include: { items: true }
    });

    res.status(200).json({ status: 'success', message: 'Nota berhasil diperbarui!', data: updatedNota });
  } catch (error) {
    res.status(500).json({ status: 'error', message: "Gagal memperbarui nota." });
  }
};

// ==========================================
// 6. FUNGSI UNTUK MENGHAPUS NOTA
// ==========================================
export const deleteNota = async (req, res) => {
  try {
    const { id } = req.params;
    const existingNota = await prisma.nota.findFirst({
      where: { id: Number(id), userId: req.user.userId }
    });

    if (!existingNota) return res.status(404).json({ message: "Nota tidak ditemukan atau akses ditolak." });

    await prisma.nota.delete({ where: { id: Number(id) } });
    res.status(200).json({ status: 'success', message: 'Nota berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: "Gagal menghapus nota." });
  }
};