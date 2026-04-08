import React from 'react';
import { Link } from 'react-router-dom'; // <--- 1. Wajib import Link dari react-router-dom

// Pastikan untuk mengganti placeholder ini dengan path gambar/ikon asli Anda
const NOPI_LOGO = "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"; 
const HERO_IMAGE_PLACEHOLDER = "/path/to/your/receipt-illustration.png"; 

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#f7f9fc] flex items-center justify-center px-6 lg:px-8">
      
      {/* Wrapper Utama */}
      <div className="max-w-7xl w-full flex flex-col-reverse lg:flex-row items-center justify-between gap-12 py-12 lg:py-24">
        
        {/* BAGIAN KIRI: Teks & Tombol */}
        <div className="flex-1 w-full max-w-2xl text-center lg:text-left flex flex-col gap-8">
          
          {/* Header: Logo & Slogan */}
          <header className="flex flex-col items-center lg:items-start gap-1">
            <div className="flex items-center gap-3">
              <svg 
                className="w-8 h-8 text-[#ff8c00]" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={NOPI_LOGO} />
              </svg>
              <span className="text-3xl font-bold text-[#ff8c00] tracking-tight">NOPI</span>
            </div>
            <p className="text-sm font-medium tracking-widest text-gray-500 uppercase">
              Bisnis Makin Lancar.
            </p>
          </header>

          {/* Headline & Deskripsi Utama */}
          <main className="flex flex-col gap-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#ff8c00] leading-[1.15]">
              Nota Pintar,<br />
              Bisnis Makin Lancar.
            </h1>
            
            <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Otomasi pembukuan dengan<br className="hidden sm:block" />
              eksekusi data berbasis AI, Pantau<br className="hidden sm:block" />
              laba secara real-time.
            </p>

            {/* --- 2. TOMBOL AKSI DIPERBAIKI DI SINI --- */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-4">
              
              <Link 
                to="/login" 
                className="w-full sm:w-auto px-8 py-3.5 bg-[#34c759] hover:bg-[#2bb34d] text-white text-center text-base font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer block"
              >
                Masuk
              </Link>

              <Link 
                to="/register" 
                className="w-full sm:w-auto px-8 py-3.5 bg-[#ff9f43] hover:bg-[#f39031] text-white text-center text-base font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer block"
              >
                Daftarkan Toko
              </Link>

            </div>
          </main>

        </div>

        {/* BAGIAN KANAN: Visual Ilustrasi */}
        <div className="flex-1 w-full flex justify-center items-center lg:pl-12">
          {/* Placeholder Kotak */}
          <div className="w-full max-w-[400px] aspect-[4/5] bg-gradient-to-br from-[#ffb86c] to-[#ff9f43] rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 w-full h-8 flex justify-between px-4">
               {[...Array(8)].map((_, i) => (
                 <div key={i} className="w-6 h-6 bg-[#f7f9fc] rounded-full -mt-3"></div>
               ))}
            </div>
            <span className="text-7xl font-bold mb-4 text-[#ffe6cc]">$</span>
            <div className="w-3/4 h-3 bg-[#ffe6cc] rounded-full mb-3 opacity-80"></div>
            <div className="w-1/2 h-3 bg-[#ffe6cc] rounded-full opacity-80"></div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;