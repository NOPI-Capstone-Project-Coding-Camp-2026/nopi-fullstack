import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Untuk pindah halaman otomatis

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); // Reset error setiap kali submit

    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await res.json();

      if (res.ok) {
        alert("Pendaftaran Berhasil! Silakan Login.");
        navigate('/login'); // Lempar user ke halaman login
      } else {
        // Menampilkan pesan error dari backend (misal: "Email sudah terdaftar")
        setError(data.message || 'Terjadi kesalahan saat mendaftar');
      }
    } catch (err) {
      setError('Tidak dapat terhubung ke server. Pastikan backend menyala.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-600">Buat Akun NOPI</h2>
          <p className="text-gray-500 mt-2">Mulai kelola nota pintarmu sekarang</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Input Nama */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Nama Lengkap</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" 
              placeholder="Masukkan nama lengkap" 
              required 
            />
          </div>

          {/* Input Email */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Alamat Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" 
              placeholder="contoh@email.com" 
              required 
            />
          </div>

          {/* Input Password */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Kata Sandi</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" 
              placeholder="Minimal 6 karakter" 
              required 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 active:scale-95 transition-all duration-200"
          >
            Daftar Sekarang
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Sudah punya akun? 
          <a href="/login" className="text-blue-600 font-bold ml-1 hover:underline">Masuk di sini</a>
        </div>
      </div>
    </div>
  );
};

export default Register;