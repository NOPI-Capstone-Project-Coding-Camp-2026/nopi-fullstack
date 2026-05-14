import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();

// Hubungkan ke Supabase Storage
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export const scanNota = async (req, res) => {
  console.log("➡️ Masuk ke rute SCAN NOTA AI");

  try {
    // 1. Pastikan user mengirim file gambar
    if (!req.file) {
      return res.status(400).json({ message: 'Gambar nota tidak ditemukan!' });
    }

    // 2. Ubah file gambar dari Multer menjadi format Blob agar bisa dikirim via Fetch
    const imageBlob = new Blob([req.file.buffer], { type: req.file.mimetype });
    
    // 3. Bungkus ke dalam FormData (Format standar pengiriman file API AI)
    const formData = new FormData();
    // Catatan: Pastikan kata "file" di bawah ini sama dengan yang diminta di Swagger UI tim AI.
    // Kadang AI minta namanya "image" atau "upload". Kita asumsikan standar: "file".
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

    // 5. Ambil hasil ekstrak data (Total Harga, Tanggal, dll) dari AI
    const extractedData = await aiResponse.json();
    console.log("✅ Hasil dari AI:", extractedData);

    // OPSIONAL: Di sini nanti kamu bisa langsung menyimpan hasilnya ke database menggunakan:
    // await prisma.nota.create({ ... })

    // 6. Kirim balik hasil pintarnya ke Frontend React
    res.status(200).json({
      message: 'Nota berhasil diekstrak oleh AI!',
      data: extractedData
    });

  } catch (error) {
    console.log("🚨 ERROR SAAT SCAN NOTA:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat menghubungi server AI." });
  }
};

export const saveNota = async (req, res) => {
  console.log("➡️ Masuk ke rute SAVE NOTA (Dengan Gambar)");

  try {
    const userId = req.user.userId;
    const { toko, tanggal, totalHarga } = req.body;
    
    let imageUrl = null;

    // 1. Jika ada file gambar yang dikirim, upload ke Supabase Storage
    if (req.file) {
      // Buat nama file unik (Contoh: 168231234-nota.jpg)
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

    // 2. Simpan semua data ke Database via Prisma
    const newNota = await prisma.nota.create({
      data: {
        toko: toko || 'Tidak Diketahui',
        totalHarga: parsedTotalHarga,
        tanggal: parsedTanggal,
        imageUrl: imageUrl, // <--- Link foto disimpan di sini!
        userId: userId,
      },
    });

    console.log("✅ Nota & Gambar berhasil disimpan!");

    res.status(201).json({
      message: 'Nota berhasil disimpan!',
      data: newNota
    });

  } catch (error) {
    console.log("🚨 ERROR SAAT MENYIMPAN NOTA:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat menyimpan nota." });
  }
};

// FUNGSI UNTUK MENGAMBIL RIWAYAT NOTA
// ==========================================
export const getHistory = async (req, res) => {
  try {
    const userId = req.user.userId; // Ambil ID user dari token JWT
    
    // Cari semua nota milik user ini, urutkan dari yang paling baru
    const history = await prisma.nota.findMany({
      where: { userId: userId },
      orderBy: { tanggal: 'desc' } 
    });

    res.status(200).json({ data: history });
  } catch (error) {
    console.log("🚨 ERROR AMBIL HISTORY:", error);
    res.status(500).json({ message: "Gagal mengambil riwayat transaksi." });
  }
};