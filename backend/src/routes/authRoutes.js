import express from 'express';
import { signUp, signIn, googleSignIn, verifyEmail, forgotPassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();

// daftar manual tanpa otomatis google, tapi tetap harus verifikasi email
router.post('/signup', signUp);

// login manual
router.post('/signin', signIn);

// login via google
router.post('/google', googleSignIn);

// vrif email 
router.get('/verify/:token', verifyEmail);


router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;