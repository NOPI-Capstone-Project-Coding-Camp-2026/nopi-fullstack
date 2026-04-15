import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (userEmail, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Menggunakan variabel environment agar dinamis saat production
    const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const verificationLink = `${baseUrl}/api/auth/verify/${token}`;

    const mailOptions = {
      from: '"NOPI Support" <no-reply@nopi.com>',
      to: userEmail,
      subject: 'Aktivasi Akun NOPI Anda',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9fafb;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #E27C3E; margin: 0;">NOPI</h2>
            <p style="color: #888; font-size: 14px; margin-top: 5px;">Nota Pintar</p>
          </div>
          <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <h3 style="color: #333; margin-top: 0;">Halo!</h3>
            <p style="color: #555; line-height: 1.5;">Terima kasih telah mendaftar di NOPI. Untuk memastikan keamanan akun Anda, silakan verifikasi alamat email ini dengan mengklik tombol aman di bawah ini:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationLink}" style="background-color: #3CC360; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(60, 195, 96, 0.2);">Aktivasi Akun Saya</a>
            </div>
            
            <p style="color: #777; font-size: 13px; line-height: 1.5;">Tombol ini berisi kode unik yang dienkripsi secara aman. Jika Anda tidak merasa mendaftar di NOPI, Anda dapat mengabaikan dan menghapus email ini.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email verifikasi berhasil dikirim ke: ${userEmail}`);
  } catch (error) {
    console.error("❌ Gagal mengirim email:", error);
  }
};


//reset password email, mirip dengan email verifikasi tapi dengan link yang berbeda dan pesan yang disesuaikan
export const sendResetPasswordEmail = async (userEmail, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Arahkan ke Frontend (Port 5173), BUKAN ke Backend!
    // Karena user harus melihat form untuk mengetik password barunya.
    const resetLink = `http://localhost:5173/reset-password/${token}`;

    const mailOptions = {
      from: '"NOPI Support" <no-reply@nopi.com>',
      to: userEmail,
      subject: 'Reset Password Akun NOPI',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9fafb;">
          <h2 style="color: #E27C3E; text-align: center;">Reset Password NOPI</h2>
          <div style="background-color: white; padding: 30px; border-radius: 8px;">
            <p style="color: #555;">Kami menerima permintaan untuk mereset password akun Anda. Silakan klik tombol di bawah ini untuk membuat password baru:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background-color: #3CC360; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password Saya</a>
            </div>
            <p style="color: #e3342f; font-size: 13px; text-align: center;">Link ini hanya berlaku selama 1 jam.</p>
            <p style="color: #777; font-size: 13px;">Jika Anda tidak meminta reset password, abaikan email ini. Keamanan akun Anda tetap terjamin.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email Reset Password berhasil dikirim ke: ${userEmail}`);
  } catch (error) {
    console.error("❌ Gagal mengirim email reset:", error);
  }
};