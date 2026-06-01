import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, verificationToken: null }
    });

    res.send(`
      <div style="text-align:center; padding: 50px; font-family: sans-serif;">
        <h1 style="color: #3CC360;">✅ Email Berhasil Diverifikasi!</h1>
        <p>Terima kasih, akun NOPI Anda sekarang sudah aktif.</p>
        <p>Mengarahkan Anda ke halaman login...</p>
        <script>
          setTimeout(() => { window.location.href = "http://localhost:5173/login"; }, 3000);
        </script>
      </div>
    `);
  } catch (error) {
    console.log("🚨 ERROR SAAT VERIFY EMAIL:", error);
    res.status(500).send("<h1>Terjadi kesalahan server.</h1>");
  }
};