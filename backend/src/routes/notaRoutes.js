import express from 'express';
import multer from 'multer';
import { scanNota, saveNota, getHistory } from '../controllers/notaController.js'; 
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Siapkan multer (penerjemah gambar yang dikirim dari Frontend via FormData)
const upload = multer({ storage: multer.memoryStorage() });

// 🚨 SEMUA RUTE DIAMANKAN OLEH authMiddleware
// Urutan: Cek Token (Satpam) -> Terima Foto (Multer) -> Jalankan Fungsi Utama
router.post('/scan', authMiddleware, upload.single('image'), scanNota);
router.post('/save', authMiddleware, upload.single('image'), saveNota); 

// Rute history tidak butuh multer karena tidak menerima upload foto
router.get('/history', authMiddleware, getHistory); 

export default router;