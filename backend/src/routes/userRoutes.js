import express from 'express';
import { updateProfile } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rute ini dilindungi authMiddleware, jadi hanya user login yang bisa update
router.put('/profile', authMiddleware, updateProfile);

export default router;