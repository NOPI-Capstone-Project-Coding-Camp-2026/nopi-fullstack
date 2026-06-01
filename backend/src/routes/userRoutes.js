import express from 'express';
import { updateProfile } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();
// protect
router.put('/profile', authMiddleware, updateProfile);

export default router;