import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '../components/ui/AppIcons';
import { apiUrl } from '../utils/api';
import Swal from 'sweetalert2'; // <-- IMPORT SWEETALERT

const ForgotPassword = () => {
  // 1. Buat state untuk menampung ketikan email
  const [email, setEmail] = useState('');

  // 2. Fungsi untuk menembak API Backend saat tombol diklik
  const handleForgotPassword = async (e) => {
    e.preventDefault(); // Mencegah halaman refresh otomatis

    if (!email) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Harap masukkan alamat email Anda terlebih dahulu.',
        confirmButtonColor: '#E27C3E'
      });
      return;
    }

    // Tampilkan animasi loading
    Swal.fire({
      title: 'Mencari Akun...',
      text: 'Mohon tunggu sebentar',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const res = await fetch(apiUrl('/api/auth/forgot-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();

      if (res.ok) {
        // Pop-up Sukses
        Swal.fire({
          icon: 'success',
          title: 'Tautan Terkirim!',
          text: data.message || 'Silakan cek kotak masuk atau folder spam email Anda.',
          confirmButtonColor: '#4e82ee', // Menyesuaikan warna tombolmu
        });
        setEmail(''); // Kosongkan kolom input setelah berhasil
      } else {
        // Pop-up Gagal (Email tidak ditemukan, dll)
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: data.message,
          confirmButtonColor: '#E27C3E'
        });
      }
    } catch {
      // Pop-up Gagal Koneksi
      Swal.fire({
        icon: 'error',
        title: 'Koneksi Terputus',
        text: 'Tidak dapat terhubung ke server. Pastikan backend menyala.',
        confirmButtonColor: '#E27C3E'
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#ff8c00] px-4 py-10 sm:px-6">
      <div className="w-full max-w-[25rem] rounded-[8px] bg-white p-5 shadow-2xl sm:p-7 lg:p-8">
        <h1 className="text-[1.7rem] font-bold text-gray-900 sm:text-[2rem] tracking-tight leading-tight">
          Lupa Kata Sandi
        </h1>
        <p className="mt-2 text-[0.94rem] leading-relaxed text-gray-500">
          Jangan khawatir, masukkan email terdaftar Anda dan kami akan mengirimkan tautan untuk
          mengatur ulang kata sandi Anda.
        </p>

        {/* 3. Bungkus input dan tombol dengan form agar bisa di-submit pakai tombol Enter */}
        <form onSubmit={handleForgotPassword} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-[0.86rem] font-bold text-gray-900">Email</label>
            <input
              type="email"
              value={email} // <-- Hubungkan value ke state
              onChange={(e) => setEmail(e.target.value)} // <-- Update state saat mengetik
              placeholder="Isi email yang digunakan"
              className="w-full rounded-[8px] border border-transparent bg-gray-100 px-4 py-3 text-[0.95rem] outline-none transition-all focus:border-[#E27C3E] focus:bg-white focus:ring-2 focus:ring-[#E27C3E] placeholder:text-gray-400"
              required
            />
          </div>

          <button
            type="submit" // <-- Ubah menjadi type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#E27C3E] px-4 py-3.5 text-[0.98rem] font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#c7652c] active:scale-95"
          >
            Kirim Tautan Pemulihan →
          </button>
        </form>

        <div className="mt-6 flex justify-center border-t border-gray-100 pt-5">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-[0.92rem] font-bold text-[#E27C3E] transition hover:text-[#c7652c]"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Kembali ke Halaman Masuk
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
