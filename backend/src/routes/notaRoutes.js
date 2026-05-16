import express from 'express';
import multer from 'multer';
import { scanNota, saveNota, getHistory } from '../controllers/notaController.js'; 
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Siapkan multer (penerjemah FormData)
const upload = multer({ storage: multer.memoryStorage() });

router.post('/scan', authMiddleware, upload.single('image'), scanNota);

// V--- PERBAIKAN DI SINI ---V
// Pastikan ada upload.single('image') di tengah-tengah!
router.post('/save', authMiddleware, upload.single('image'), saveNota); 
// ^-------------------------^

router.get('/history', authMiddleware, getHistory); 

export default router;