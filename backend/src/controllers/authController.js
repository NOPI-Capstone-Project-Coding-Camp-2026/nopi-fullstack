import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendVerificationEmail, sendResetPasswordEmail } from '../utils/sendEmail.js';


const prisma = new PrismaClient();

// ==========================================
// 1. SIGN UP (PENDAFTARAN MANUAL)
// ==========================================
export const signUp = async (req, res) => {
  // CCTV PINTU MASUK
  console.log("➡️ Masuk ke rute SIGNUP!");
  
  // Praktik Terbaik: Buat salinan data (clone) khusus untuk log 
  // agar tidak merusak data asli yang akan dimasukkan ke database
  const logData = { ...req.body };
  if (logData.password) {
    // Ubah tampilan password menjadi seperti token/hash untuk menipu log
    logData.password = "[PROTECTED_ENCRYPTED_HASH_TOKEN]"; 
  }
  console.log("📦 Data dari Frontend:", logData);

  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah terdaftar!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        verificationToken: verificationToken,
        isVerified: false 
      },
    });

    await sendVerificationEmail(newUser.email, verificationToken);

    res.status(201).json({ 
      message: 'Pendaftaran berhasil! Silakan cek kotak masuk email Anda untuk verifikasi.',
    });
  } catch (error) {
    // CCTV ERROR
    console.log("🚨 ERROR SAAT SIGNUP:", error); 
    res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

// ==========================================
// 2. SIGN IN (LOGIN MANUAL)
// ==========================================
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Opsional: Jika kamu ingin memasang CCTV juga di rute login, lakukan hal yang sama
    const logData = { email, password: "[PROTECTED_ENCRYPTED_HASH_TOKEN]" };
    console.log("➡️ Masuk ke rute SIGNIN:", logData);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan!' });
    }

    // Blokir jika email belum diverifikasi
    if (!user.isVerified) {
      return res.status(403).json({ 
        message: 'Akses ditolak! Silakan cek email Anda dan klik link verifikasi terlebih dahulu.' 
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Password salah!' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' } // Berlaku 1 hari
    );
    
    res.status(200).json({ 
      message: 'Login berhasil!', 
      token, 
      data: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.log("🚨 ERROR SAAT SIGNIN:", error);
    res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

// ==========================================
// 3. GOOGLE SIGN IN / SIGN UP (OTOMATIS VERIFIKASI)
// ==========================================

// NANTI JANGAN LUPA DAFTARIN URI BARU KALAU UDAH DEPLOY!!!!!!!!!!!!!!!!!!

export const googleSignIn = async (req, res) => {
  try {
    const { token: googleAccessToken } = req.body;
    console.log("➡️ Masuk ke rute GOOGLE AUTH");

    // Ambil data profil dari Google API menggunakan access token
    const googleResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${googleAccessToken}` }
    });
    
    if (!googleResponse.ok) {
      return res.status(401).json({ message: 'Token Google tidak valid!' });
    }

    const { email, name } = await googleResponse.json();

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Auto-Register jika belum ada di database, langsung set isVerified: true
      const randomPassword = await bcrypt.hash(crypto.randomBytes(8).toString('hex'), 10);
      user = await prisma.user.create({
        data: { 
          email: email, 
          name: name, 
          password: randomPassword,
          isVerified: true,
          verificationToken: null
        }
      });
    } else if (!user.isVerified) {
      // Jika sebelumnya daftar manual tapi belum verif, lalu login pakai Google, kita otomatis verifikasi
      user = await prisma.user.update({
        where: { email },
        data: { isVerified: true, verificationToken: null }
      });
    }

    // Buat JWT Token untuk sistem backend kita
    const jwtToken = jwt.sign(
      { userId: user.id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    res.status(200).json({ 
      message: 'Google Login berhasil', 
      token: jwtToken, 
      data: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.log("🚨 ERROR SAAT GOOGLE AUTH:", error);
    res.status(500).json({ message: "Terjadi kesalahan server saat Google Auth", error: error.message });
  }
};

// ==========================================
// 4. VERIFY EMAIL (KLIK DARI EMAIL)
// ==========================================
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    console.log("➡️ Masuk ke rute VERIFY EMAIL dengan token tersamar");

    const user = await prisma.user.findFirst({
      where: { verificationToken: token }
    });

    if (!user) {
      return res.status(400).send(`
        <div style="text-align:center; padding: 50px; font-family: sans-serif;">
          <h1 style="color: red;">❌ Verifikasi Gagal</h1>
          <p>Token tidak valid atau email sudah diverifikasi sebelumnya.</p>
          <a href="http://localhost:5173/login" style="color: #E27C3E;">Kembali ke Halaman Login</a>
        </div>
      `);
    }

    // Update status ke verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null
      }
    });

    // Tampilkan pesan sukses dan otomatis arahkan ke frontend
    res.send(`
      <div style="text-align:center; padding: 50px; font-family: sans-serif;">
        <h1 style="color: #3CC360;">✅ Email Berhasil Diverifikasi!</h1>
        <p>Terima kasih, akun NOPI Anda sekarang sudah aktif.</p>
        <p>Mengarahkan Anda ke halaman login...</p>
        <script>
          setTimeout(() => {
            window.location.href = "http://localhost:5173/login";
          }, 3000);
        </script>
      </div>
    `);
  } catch (error) {
    console.log("🚨 ERROR SAAT VERIFY EMAIL:", error);
    res.status(500).send("<h1>Terjadi kesalahan server.</h1>");
  }
};

// ==========================================
// 5. MINTA RESET PASSWORD (Kirim Email)
// ==========================================
export const forgotPassword = async (req, res) => {
  console.log("➡️ Masuk ke rute FORGOT PASSWORD");
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'Email tidak terdaftar di sistem kami.' });
    }

    // Buat token unik dan set waktu kadaluarsa (1 jam dari sekarang)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 3600000 ms = 1 Jam

    // Simpan token ke database user
    await prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetTokenExpiry
      }
    });

    // Kirim email
    await sendResetPasswordEmail(user.email, resetToken);

    res.status(200).json({ message: 'Link reset password telah dikirim ke email Anda.' });
  } catch (error) {
    console.log("🚨 ERROR FORGOT PASSWORD:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// ==========================================
// 6. EKSEKUSI RESET PASSWORD (Ganti Password)
// ==========================================
export const resetPassword = async (req, res) => {
  console.log("➡️ Masuk ke rute RESET PASSWORD");
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Cari user yang punya token tersebut DAN batas waktunya belum lewat (masih lebih besar dari waktu sekarang)
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { gt: new Date() } // gt = greater than (lebih dari waktu sekarang)
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token tidak valid atau sudah kadaluarsa.' });
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password dan KOSONGKAN kembali tokennya agar tidak bisa dipakai 2x
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      }
    });

    res.status(200).json({ message: 'Password berhasil diubah! Silakan login.' });
  } catch (error) {
    console.log("🚨 ERROR RESET PASSWORD:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};