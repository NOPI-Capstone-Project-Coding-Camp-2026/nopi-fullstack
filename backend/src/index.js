import express from 'express';
import cors from 'cors'; // Import cors-nya
import authRoutes from './routes/authRoutes.js';

const app = express(); // <--- BARIS INI WAJIB DI ATAS!

// Baru setelah itu pakai middleware
app.use(cors()); 
app.use(express.json());

// Baru routes
app.use('/api/auth', authRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server NOPI jalan di http://localhost:${PORT}`);
});