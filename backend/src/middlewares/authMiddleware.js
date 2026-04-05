import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  // Ambil token dari header 'Authorization'
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Akses ditolak, token tidak ada!" });
  }

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Masukkan data user ke dalam request
    next(); // Lanjut ke proses berikutnya
  } catch (error) {
    // Jika token expired atau salah, kirim error 401
    return res.status(401).json({ message: "Token tidak valid atau sudah kedaluwarsa!" });
  }
};