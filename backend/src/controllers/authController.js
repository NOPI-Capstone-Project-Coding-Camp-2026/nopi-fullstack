import prisma from '../config/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; // <--- 1. Import library JWT

export const signUp = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah terdaftar!" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create({
      data: { 
        email, 
        name, 
        password: hashedPassword 
      }
    });

    res.status(201).json({ message: "Sign Up Berhasil", data: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password salah!" });
    }

    // --- 2. LOGIKA PEMBUATAN TOKEN ---
    // Kita simpan id dan email di dalam token
    const token = jwt.sign(
      { userId: user.id, email: user.email }, 
      process.env.JWT_SECRET, // Pastikan sudah ada di .env
      { expiresIn: '30m' }    // Masa aktif 30 menit
    );

    // 3. Kirim token ke client (Frontend/Postman)
    res.status(200).json({ 
      message: "Login Berhasil", 
      token: token, // <--- Token ini yang harus disimpan Frontend
      data: { id: user.id, email: user.email, name: user.name } 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const signOut = async (req, res) => {
  try {
    // Pada JWT, sign out dilakukan dengan menghapus token di sisi Frontend (Local Storage)
    res.status(200).json({ message: "Sign Out Berhasil." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

