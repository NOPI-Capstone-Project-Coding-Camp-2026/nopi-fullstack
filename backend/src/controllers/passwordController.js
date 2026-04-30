import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sendResetPasswordEmail } from '../utils/sendEmail.js';

const prisma = new PrismaClient();

export const forgotPassword = async (req, res) => {
  console.log("➡️ Masuk ke rute FORGOT PASSWORD");
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(404).json({ message: 'Email tidak terdaftar di sistem kami.' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 Jam

    await prisma.user.update({
      where: { email },
      data: { resetPasswordToken: resetToken, resetPasswordExpires: resetTokenExpiry }
    });

    await sendResetPasswordEmail(user.email, resetToken);
    res.status(200).json({ message: 'Link reset password telah dikirim ke email Anda.' });
  } catch (error) {
    console.log("🚨 ERROR FORGOT PASSWORD:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const resetPassword = async (req, res) => {
  console.log("➡️ Masuk ke rute RESET PASSWORD");
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { gt: new Date() }
      }
    });

    if (!user) return res.status(400).json({ message: 'Token tidak valid atau sudah kadaluarsa.' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, resetPasswordToken: null, resetPasswordExpires: null }
    });

    res.status(200).json({ message: 'Password berhasil diubah! Silakan login.' });
  } catch (error) {
    console.log("🚨 ERROR RESET PASSWORD:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};