import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();

// Hubungkan ke Supabase Storage
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// ==========================================
// 1. FUNGSI UNTUK SCAN NOTA VIA AI
// ==========================================
export const scanNota = async (req, res) => {
  console.log("➡️ Masuk ke rute SCAN NOTA AI");

  try {
    // 1. Pastikan user mengirim file gambar
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'Gambar nota tidak ditemukan!' });
    }

    // 2. Ubah file gambar dari Multer menjadi format Blob
    const imageBlob = new Blob([req.file.buffer], { type: req.file.mimetype });
    
    // 3. Bungkus ke dalam FormData
    const formData = new FormData();
    formData.append('file', imageBlob, req.file.originalname);

    console.log("⏳ Sedang mengirim ke AI Engine...");

    // 4. Tembak ke API Tim AI Engineer
    const aiResponse = await fetch('https://aletta2206-nopi-ai-api.hf.space/api/extract-nota', {
      method: 'POST',
      body: formData,
    });

    if (!aiResponse.ok) {
      throw new Error(`AI API merespons dengan status: ${aiResponse.status}`);
    }

    // 5. Ambil hasil ekstrak data
    const extractedData = await aiResponse.json();
    console.log("✅ Hasil dari AI:", JSON.stringify(extractedData, null, 2));

    // 🚨 FILTER CERDAS DI BACKEND (DEFENSIVE PROGRAMMING)
    const aiData = extractedData.data || extractedData || {};
    const rawText = aiData.raw_text || '';
    
    // Sesuaikan dengan format JSON AI yang baru (dibungkus dalam parsed_items.items)
    const parsedItemsObj = aiData.parsed_items || {};
    const parsedItemsArray = parsedItemsObj.items || aiData.items || [];

    // Validasi: Apakah teksnya cukup panjang ATAU ada daftar barangnya?
    const isNotaValid = rawText.trim().length > 15 || parsedItemsArray.length > 0;

    // Jika kosong / gagal deteksi, langsung tolak dari Backend (Status 400 Bad Request)
    if (!isNotaValid) {
      console.log("❌ AI menolak gambar: Bukan nota atau teks terlalu sedikit.");
      return res.status(400).json({
        status: 'error',
        message: 'Gambar tidak memiliki teks nota yang cukup jelas. Silakan foto ulang.'
      });
    }

    // 6. Jika lolos filter, baru kirim status Sukses ke React
    res.status(200).json({
      message: 'Nota berhasil diekstrak oleh AI!',
      data: extractedData
    });

  } catch (error) {
    console.log("🚨 ERROR SAAT SCAN NOTA:", error);
    res.status(500).json({ status: 'error', message: "Terjadi kesalahan saat menghubungi server AI." });
  }
};

// ==========================================
// 2. FUNGSI UNTUK MENYIMPAN NOTA KE DATABASE
// ==========================================
export const saveNota = async (req, res) => {
  console.log("➡️ Masuk ke rute SAVE NOTA (Dengan Gambar)");

  try {
    // 🚨 AMAN: Ambil ID user dari tiket (token) yang sudah digeledah oleh authMiddleware
    const userId = req.user.userId;
    const { toko, tanggal, totalHarga } = req.body;
    
    let imageUrl = null;

    // Jika ada file gambar yang dikirim, upload ke Supabase Storage
    if (req.file) {
      // Buat nama file unik
      const fileName = `${Date.now()}-${req.file.originalname.replace(/\s+/g, '-')}`;

      // Upload ke bucket 'nota-images'
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('nota-images')
        .upload(fileName, req.file.buffer, { 
          contentType: req.file.mimetype 
        });

      if (uploadError) throw uploadError;

      // Ambil link URL publiknya
      const { data: publicUrlData } = supabase.storage
        .from('nota-images')
        .getPublicUrl(fileName);

      imageUrl = publicUrlData.publicUrl;
    }

    const parsedTotalHarga = parseFloat(totalHarga) || 0;
    const parsedTanggal = tanggal ? new Date(tanggal) : new Date();

    const newNota = await prisma.nota.create({
      data: {
        toko: toko || 'Tidak Diketahui',
        totalHarga: parsedTotalHarga,
        tanggal: parsedTanggal,
        imageUrl: imageUrl, 
        userId: userId, // 🚨 AMAN: Nota ini hanya akan dikaitkan dengan user yang login
      },
    });

    console.log("✅ Nota & Gambar berhasil disimpan!");

    res.status(201).json({
      status: 'success',
      message: 'Nota berhasil disimpan!',
      data: newNota
    });

  } catch (error) {
    console.log("🚨 ERROR SAAT MENYIMPAN NOTA:", error);
    res.status(500).json({ status: 'error', message: "Terjadi kesalahan saat menyimpan nota." });
  }
};

// ==========================================
// 3. FUNGSI UNTUK MENGAMBIL RIWAYAT NOTA
// ==========================================
export const getHistory = async (req, res) => {
  try {
    // 🚨 AMAN: Ambil ID user dari tiket (token) yang sudah digeledah oleh authMiddleware
    const userId = req.user.userId; 
    
    // Cari HANYA nota milik user ini, urutkan dari yang paling baru
    const history = await prisma.nota.findMany({
      where: { userId: userId },
      orderBy: { tanggal: 'desc' } 
    });

    res.status(200).json({ status: 'success', data: history });
  } catch (error) {
    console.log("🚨 ERROR AMBIL HISTORY:", error);
    res.status(500).json({ status: 'error', message: "Gagal mengambil riwayat transaksi." });
  }
};