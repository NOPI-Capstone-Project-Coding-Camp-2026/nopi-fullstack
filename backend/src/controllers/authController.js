import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendVerificationEmail } from '../utils/sendEmail.js';

const prisma = new PrismaClient();

export const signUp = async (req, res) => {
  console.log("➡️ Masuk ke rute SIGNUP!");
  const logData = { ...req.body };
  if (logData.password) logData.password = "[PROTECTED_ENCRYPTED_HASH_TOKEN]"; 
  console.log("📦 Data dari Frontend:", logData);

  try {
    const { name, email, password } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email sudah terdaftar!' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword, verificationToken, isVerified: false },
    });

    await sendVerificationEmail(newUser.email, verificationToken);
    res.status(201).json({ message: 'Pendaftaran berhasil! Silakan cek kotak masuk email Anda untuk verifikasi.' });
  } catch (error) {
    console.log("🚨 ERROR SAAT SIGNUP:", error); 
    res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const logData = { email, password: "[PROTECTED_ENCRYPTED_HASH_TOKEN]" };
    console.log("➡️ Masuk ke rute SIGNIN:", logData);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan!' });
    if (!user.isVerified) return res.status(403).json({ message: 'Akses ditolak! Silakan cek email Anda dan klik link verifikasi terlebih dahulu.' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Password salah!' });

    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const { password: userPassword, ...safeUserData } = user;
    
    res.status(200).json({ message: 'Login berhasil!', token, data: safeUserData });
  } catch (error) {
    console.log("🚨 ERROR SAAT SIGNIN:", error);
    res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

export const googleSignIn = async (req, res) => {
  try {
    const { token: googleAccessToken } = req.body;
    console.log("➡️ Masuk ke rute GOOGLE AUTH");

    const googleResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${googleAccessToken}` }
    });
    
    if (!googleResponse.ok) return res.status(401).json({ message: 'Token Google tidak valid!' });

    const { email, name } = await googleResponse.json();
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      const randomPassword = await bcrypt.hash(crypto.randomBytes(8).toString('hex'), 10);
      user = await prisma.user.create({
        data: { email, name, password: randomPassword, isVerified: true, verificationToken: null }
      });
    } else if (!user.isVerified) {
      user = await prisma.user.update({
        where: { email },
        data: { isVerified: true, verificationToken: null }
      });
    }

    const jwtToken = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const { password: userPassword, ...safeUserData } = user;

    res.status(200).json({ message: 'Google Login berhasil', token: jwtToken, data: safeUserData });
  } catch (error) {
    console.log("🚨 ERROR SAAT GOOGLE AUTH:", error);
    res.status(500).json({ message: "Terjadi kesalahan server saat Google Auth", error: error.message });
  }
};