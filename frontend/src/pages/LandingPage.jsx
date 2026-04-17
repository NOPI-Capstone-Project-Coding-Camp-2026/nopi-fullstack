import React from 'react';
import { Link } from 'react-router-dom';
import NopiLogo from '../components/ui/NopiLogo';
import receiptHero from '../assets/receipt-hero.png';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#f7f9fc] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      
      {/* Wrapper Utama */}
      <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center justify-between gap-8 py-10 sm:gap-10 sm:py-12 lg:gap-12 lg:py-24">
        
        {/* BAGIAN KIRI: Teks & Tombol */}
        <div className="flex-1 w-full max-w-2xl text-center lg:text-left flex flex-col gap-5 sm:gap-8">
          
          <header className="flex flex-col items-center lg:items-start gap-1">
            <NopiLogo className="mx-auto lg:mx-0" />
          </header>

          {/* Headline & Deskripsi Utama */}
          <main className="flex flex-col gap-6">
            <h1 className="text-[2rem] font-extrabold text-[#ff8c00] leading-[1.15] sm:text-5xl lg:text-6xl">
              Nota Pintar,<br />
              Bisnis Makin Lancar.
            </h1>
            
            <p className="mx-auto max-w-lg text-base leading-relaxed text-gray-600 sm:text-lg lg:mx-0 lg:text-xl">
              Otomasi pembukuan dengan
              <br className="hidden sm:block" />
              eksekusi data berbasis AI, Pantau
              <br className="hidden sm:block" />
              laba secara real-time.
            </p>

            <div className="mt-2 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              
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
          <div className="relative flex w-full max-w-[520px] items-center justify-center">
            <div className="absolute inset-0 rounded-[48px] bg-[radial-gradient(circle_at_center,rgba(240,138,42,0.12),transparent_70%)] blur-2xl" />
            <img
              src={receiptHero}
              alt="Ilustrasi nota NOPI"
              className="relative w-full max-w-[180px] object-contain drop-shadow-[0_28px_36px_rgba(240,138,42,0.18)] sm:max-w-[300px] lg:max-w-[430px]"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;
