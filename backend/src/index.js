import express from 'express';
import cors from 'cors'; // Import cors-nya
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import notaRoutes from './routes/notaRoutes.js';

const app = express(); // <--- BARIS INI WAJIB DI ATAS!

// Baru setelah itu pakai middleware
app.use(cors()); 

// limit (gabungkan jadi satu saja agar lebih bersih)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Baru routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/nota', notaRoutes); /* rute AI */

// Gunakan process.env.PORT agar fleksibel di server, fallback ke 5000 untuk lokal
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server NOPI jalan di http://localhost:${PORT}`);
});

// 🚨 BARIS WAJIB UNTUK DEPLOY BACKEND DI VERCEL 🚨
export default app;