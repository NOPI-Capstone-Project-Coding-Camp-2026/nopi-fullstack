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
    <div className="flex min-h-screen items-center justify-center bg-[#ee872d] px-6 py-10">
      <div className="w-full max-w-xl rounded-[8px] bg-[#fffaf5] px-10 py-12 shadow-[0_26px_46px_rgba(128,72,20,0.18)]">
        <h1 className="text-[2.8rem] font-semibold tracking-[-0.05em] text-[#2b2b2b]">
          Lupa Kata Sandi
        </h1>
        <p className="mt-4 max-w-lg text-[1.05rem] leading-9 text-[#8d8d8d]">
          Jangan khawatir, masukan email terdaftar Anda dan kami akan mengirimkan tautan untuk
          mengatur ulang kata sandi Anda
        </p>

        {/* 3. Bungkus input dan tombol dengan form agar bisa di-submit pakai tombol Enter */}
        <form onSubmit={handleForgotPassword} className="mt-10">
          <label className="mb-3 block text-lg font-semibold text-[#2b2b2b]">Email</label>
          <input
            type="email"
            value={email} // <-- Hubungkan value ke state
            onChange={(e) => setEmail(e.target.value)} // <-- Update state saat mengetik
            placeholder="Isi email yang digunakan"
            className="w-full rounded-[8px] bg-[#ededed] px-6 py-6 text-lg text-[#2b2b2b] outline-none placeholder:text-[#9b9b9b]"
            required
          />

          <button
            type="submit" // <-- Ubah menjadi type="submit"
            className="mt-10 w-full rounded-[8px] bg-[#4e82ee] px-6 py-6 text-[1.15rem] font-semibold text-white transition hover:bg-[#3f74e1]"
          >
            Kirim Tautan Pemulihan →
          </button>
        </form>

        <div className="mt-10 flex justify-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-3 text-base font-medium text-[#8f8f8f] transition hover:text-[#6d6d6d]"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Kembali ke Halaman Masuk
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
