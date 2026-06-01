import express from 'express';
// Mengambil dari 3 file berbeda
import { signUp, signIn, googleSignIn } from '../controllers/authController.js';
import { verifyEmail } from '../controllers/verificationController.js';
import { forgotPassword, resetPassword } from '../controllers/passwordController.js';

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