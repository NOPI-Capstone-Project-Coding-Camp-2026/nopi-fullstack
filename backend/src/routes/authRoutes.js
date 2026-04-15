import express from 'express';
import { signUp, signIn, googleSignIn, verifyEmail, forgotPassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();

// Rute pendaftaran manual
router.post('/signup', signUp);

// Rute login manual
router.post('/signin', signIn);

// Rute login otomatis via Google
router.post('/google', googleSignIn);

// Rute verifikasi email (Diakses langsung via klik dari email)
router.get('/verify/:token', verifyEmail);


router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;