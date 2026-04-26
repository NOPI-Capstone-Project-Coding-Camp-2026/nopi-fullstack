import { authMiddleware } from '../middlewares/authMiddleware.js';

// Hanya user yang punya token aktif 30 menit yang bisa akses ini
router.post('/upload', authMiddleware, uploadNotaController);