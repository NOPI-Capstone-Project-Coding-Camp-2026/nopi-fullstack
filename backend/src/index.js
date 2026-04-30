import express from 'express';
import cors from 'cors'; // Import cors-nya
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express(); // <--- BARIS INI WAJIB DI ATAS!

// Baru setelah itu pakai middleware
app.use(cors()); 
app.use(express.json());

// limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Baru routes
app.use('/api/auth', authRoutes);

app.use('/api/user', userRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server NOPI jalan di http://localhost:${PORT}`);
});