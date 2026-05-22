import express from 'express';
import multer from 'multer';
import { scanNota, saveNota, getHistory, getNotaById, updateNota, deleteNota } from '../controllers/notaController.js'; 
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// 🚨 RUTE UTAMA
router.post('/scan', authMiddleware, upload.single('image'), scanNota);
router.post('/save', authMiddleware, upload.single('image'), saveNota); 
router.get('/history', authMiddleware, getHistory); 

// 🚨 RUTE UNTUK HALAMAN DETAIL (Baca, Edit, Hapus)
router.get('/:id', authMiddleware, getNotaById);
router.patch('/:id', authMiddleware, updateNota); // Untuk Edit
router.delete('/:id', authMiddleware, deleteNota); // Untuk Hapus

export default router;