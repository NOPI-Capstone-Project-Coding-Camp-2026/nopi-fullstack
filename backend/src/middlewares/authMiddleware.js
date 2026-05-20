import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  // 1. Ambil token dari header 'Authorization'
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

  // 2. Jika tidak ada token, langsung usir dengan status 401
  if (!token) {
    return res.status(401).json({ 
      status: 'error', 
      message: "Akses ditolak, token tidak ada!" 
    });
  }

  try {
    // 3. Verifikasi keaslian token menggunakan kunci rahasia dari file .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Masukkan data user (termasuk userId) ke dalam objek request (req.user)
    req.user = decoded; 
    
    // 5. Lanjut ke proses controller berikutnya (scanNota / saveNota / getHistory)
    next(); 
  } catch (error) {
    // 6. Jika token expired atau dimodifikasi hacker, kirim status 401
    return res.status(401).json({ 
      status: 'error', 
      message: "Token tidak valid atau sudah kedaluwarsa! Silakan login ulang." 
    });
  }
};