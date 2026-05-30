import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  CheckCircle,
  TrendingUp,
  FileX,
  Calculator,
  ClipboardList,
  Camera,
  ShieldCheck,
  BarChart2,
  Lock,
  UserPlus,
  Building2,
  Wallet,
  Target,
  ChevronDown,
  ArrowRight,
  Sparkles,
  ScanLine,
} from 'lucide-react';
import NopiLogo from '../components/ui/NopiLogo';
import receiptHero from '../assets/receipt-hero.png';
import { faqItems } from '../data/faqItems';

// 6 FAQ paling relevan untuk landing page
const FAQ_LANDING = faqItems.filter((_, i) => [0, 3, 5, 6, 8, 12].includes(i));

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROBLEMS = [
  {
    Icon: FileX,
    title: 'Nota Hilang / Kebasahan',
    desc: 'Struk belanja sering hilang, buram, atau basah kena air. Akhirnya catatan keuangan toko jadi berantakan dan susah dilacak.',
    iconColor: '#ef4444',
    iconBg: 'rgba(239,68,68,0.08)',
  },
  {
    Icon: Calculator,
    title: 'Salah Hitung Untung',
    desc: 'Hitung untung rugi manual bisa salah kapan saja. Sekali salah angka, bisa bikin keputusan bisnis yang keliru dan rugi besar.',
    iconColor: '#ef4444',
    iconBg: 'rgba(239,68,68,0.08)',
  },
  {
    Icon: ClipboardList,
    title: 'Capek Catat & Hitung Manual',
    desc: 'Tiap hari nulis ulang nota satu per satu itu buang waktu dan tenaga. Ada NOPI, semua beres dalam hitungan detik.',
    iconColor: '#ef4444',
    iconBg: 'rgba(239,68,68,0.08)',
  },
];

const FEATURES = [
  {
    Icon: ScanLine,
    title: 'Foto & Beres (OCR Pintar)',
    desc: 'Cukup foto struk belanjaan, NOPI langsung baca dan ekstrak semua data otomatis. Tidak perlu ketik manual.',
    cardBg: '#fff7ed',
    iconBg: '#fed7aa',
    iconColor: '#ea580c',
    accentColor: '#ea580c',
  },
  {
    Icon: ShieldCheck,
    title: 'Validasi Nota Otomatis',
    desc: 'AI kami memastikan data yang dibaca dari nota sudah benar sebelum disimpan. Minim kesalahan, maksimal akurasi.',
    cardBg: '#f0fdf4',
    iconBg: '#bbf7d0',
    iconColor: '#16a34a',
    accentColor: '#16a34a',
  },
  {
    Icon: BarChart2,
    title: 'Atur Margin Profit',
    desc: 'Hitung harga jual yang ideal langsung dari aplikasi. Tentukan margin keuntungan tiap produk dengan mudah dan cepat.',
    cardBg: '#eff6ff',
    iconBg: '#bfdbfe',
    iconColor: '#2563eb',
    accentColor: '#2563eb',
  },
  {
    Icon: Lock,
    title: 'Riwayat Nota Aman',
    desc: 'Semua nota tersimpan aman di cloud. Kapan saja butuh, langsung bisa dicek. Tidak ada lagi nota hilang atau kerusakan fisik.',
    cardBg: '#faf5ff',
    iconBg: '#e9d5ff',
    iconColor: '#7c3aed',
    accentColor: '#7c3aed',
  },
];

const STEPS = [
  {
    Icon: UserPlus,
    number: '01',
    title: 'Daftar & Masuk',
    desc: 'Buat akun gratis dalam 1 menit. Tidak perlu kartu kredit, langsung bisa digunakan.',
  },
  {
    Icon: Building2,
    number: '02',
    title: 'Isi Profil Bisnis',
    desc: 'Lengkapi info toko kamu mulai dari nama, kategori, hingga alamat usaha agar data pencatatan jadi lebih rapi.',
  },
  {
    Icon: Camera,
    number: '03',
    title: 'Foto Struk Belanja',
    desc: 'Ambil foto struk atau nota pembelian. AI NOPI langsung baca dan ekstrak datanya.',
  },
  {
    Icon: Wallet,
    number: '04',
    title: 'Atur Untung & Simpan',
    desc: 'Tentukan harga jual dan margin profit per produk, lalu simpan. Selesai, beres!',
  },
];

const TEAM = [
  { name: 'Nadya Putri N. A.',  role: 'AI Engineer',   initials: 'NP', color: '#7c3aed', bg: '#f3e8ff' },
  { name: 'Fatiyah Hanna L.',   role: 'AI Engineer',   initials: 'FH', color: '#7c3aed', bg: '#f3e8ff' },
  { name: 'Daniswara Rizky',    role: 'Full Stack',    initials: 'DR', color: '#ea580c', bg: '#fff7ed' },
  { name: 'Dewi Ainun A.',      role: 'Full Stack',    initials: 'DA', color: '#ea580c', bg: '#fff7ed' },
  { name: 'Jihan Timmy N.',     role: 'Data Science',  initials: 'JT', color: '#2563eb', bg: '#eff6ff' },
  { name: 'Najwa Namira Z.',    role: 'Data Science',  initials: 'NN', color: '#2563eb', bg: '#eff6ff' },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

const Badge = ({ color, children }) => (
  <span
    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border"
    style={{
      backgroundColor: color + '15',
      borderColor: color + '30',
      color: color,
    }}
  >
    {children}
  </span>
);

const SectionHeader = ({ badge, badgeColor = '#ff8c00', title, subtitle }) => (
  <div className="text-center mb-14">
    <Badge color={badgeColor}>{badge}</Badge>
    <h2
      className="mt-4 text-3xl sm:text-[2.15rem] font-extrabold text-gray-900 leading-tight"
      dangerouslySetInnerHTML={{ __html: title }}
    />
    {subtitle && (
      <p className="mt-3 text-gray-500 text-base sm:text-[1.05rem] max-w-xl mx-auto leading-relaxed">
        {subtitle}
      </p>
    )}
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleFaq = (i) => setOpenFaq(prev => (prev === i ? null : i));

  return (
    <div className="min-h-screen bg-white overflow-x-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ══════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? '#ffffff' : 'transparent',
          borderBottom: scrolled ? '1px solid rgba(0,0,0,0.07)' : '1px solid transparent',
          boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.06)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <NopiLogo compact />

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-8">
              {[
                { label: 'Fitur', id: 'fitur' },
                { label: 'Cara Kerja', id: 'cara-kerja' },
              ].map(({ label, id }) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="text-sm font-semibold text-gray-600 hover:text-[#ff8c00] transition-colors duration-150"
                >
                  {label}
                </button>
              ))}
              <button
                onClick={() => scrollTo('faq')}
                className="text-sm font-semibold text-gray-600 hover:text-[#ff8c00] transition-colors duration-150"
              >
                FAQ
              </button>
            </div>

            {/* CTA buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/login"
                className="hidden sm:block text-sm font-semibold text-gray-700 hover:text-[#ff8c00] px-4 py-2 transition-colors"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="text-sm font-bold text-white px-5 py-2.5 rounded-lg transition-all duration-200 hover:shadow-lg active:scale-95"
                style={{ background: '#ff8c00' }}
              >
                Daftar Gratis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute top-0 right-0 w-[700px] h-[700px] opacity-40 rounded-full"
            style={{ background: 'rgba(255,140,0,0.06)' }}
          />
          <div
            className="absolute -bottom-20 -left-20 w-[500px] h-[500px] opacity-40 rounded-full"
            style={{ background: 'rgba(52,199,89,0.05)' }}
          />
          {/* Subtle dot grid */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="#333" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-20 lg:py-0 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

            {/* ── Left: Copy ─────────────────────────── */}
            <div className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
              {/* Pill badge */}
              <div
                className="inline-flex items-center gap-2 text-xs font-bold px-3.5 py-1.5 rounded-full mb-6"
                style={{ background: 'rgba(255,140,0,0.10)', border: '1px solid rgba(255,140,0,0.25)', color: '#ff8c00' }}
              >
                <Sparkles size={12} className="flex-shrink-0" />
                AI-Powered untuk UMKM Indonesia
              </div>

              {/* Headline */}
              <h1 className="text-[2.3rem] sm:text-5xl lg:text-[3.4rem] xl:text-[3.8rem] font-extrabold text-gray-900 leading-[1.12] mb-5">
                Nota Pintar,{' '}
                <span style={{ color: '#ff8c00' }}>
                  Bisnis Makin
                </span>
                {' '}Lancar.
              </h1>

              {/* Sub-headline */}
              <p className="text-gray-500 text-base sm:text-[1.08rem] lg:text-lg leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
                Otomasi pembukuan dengan eksekusi data berbasis AI.{' '}
                <span className="text-gray-800 font-semibold">Pantau laba secara real-time.</span>
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start mb-9">
                <Link
                  to="/register"
                  id="hero-cta-register"
                  className="inline-flex items-center gap-2 text-white font-bold px-7 py-3.5 rounded-lg text-[0.95rem] transition-all duration-200 hover:shadow-xl active:scale-95"
                  style={{ background: '#ff8c00', boxShadow: '0 4px 16px rgba(255,140,0,0.28)' }}
                >
                  <Zap size={17} />
                  Mulai Scan Nota Gratis
                </Link>
                <button
                  id="hero-cta-how"
                  onClick={() => scrollTo('cara-kerja')}
                  className="flex items-center justify-center gap-2 font-semibold px-7 py-3.5 rounded-lg text-[0.95rem] transition-all duration-200 hover:shadow-md active:scale-95 bg-white border border-gray-200 text-gray-700 hover:border-[#ff8c00] hover:text-[#ff8c00]"
                >
                  Lihat Cara Kerja
                  <ArrowRight size={16} />
                </button>
              </div>


            </div>

            {/* ── Right: Visual ──────────────────────── */}
            <div className="flex-1 flex items-center justify-center lg:justify-end relative w-full max-w-[480px] mx-auto lg:mx-0">
              {/* Floating notification cards */}
              <div
                className="absolute -top-5 -left-2 sm:-left-8 bg-white rounded-2xl px-3.5 py-2.5 z-10 hidden sm:flex items-center gap-2.5"
                style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.10)', border: '1px solid rgba(0,0,0,0.06)' }}
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#dcfce7' }}>
                  <CheckCircle size={16} color="#16a34a" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-gray-800 leading-none mb-0.5">Nota Terdeteksi!</div>
                  <div className="text-[10px] text-gray-400">4 item · Rp 127.500</div>
                </div>
              </div>

              <div
                className="absolute -bottom-4 -right-2 sm:-right-6 bg-white rounded-2xl px-3.5 py-2.5 z-10 hidden sm:flex items-center gap-2.5"
                style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.10)', border: '1px solid rgba(0,0,0,0.06)' }}
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#ffedd5' }}>
                  <TrendingUp size={16} color="#ea580c" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-gray-800 leading-none mb-0.5">Profit Hari Ini</div>
                  <div className="text-[10px] font-bold" style={{ color: '#16a34a' }}>+Rp 245.000</div>
                </div>
              </div>

              {/* Receipt hero — single image */}
              <div className="relative flex items-center justify-center w-full">
                <div
                  className="absolute inset-0 rounded-full opacity-30"
                  style={{ background: 'rgba(255,140,0,0.10)' }}
                />
                <img
                  src={receiptHero}
                  alt="Ilustrasi Nota NOPI"
                  className="relative w-56 sm:w-72 lg:w-[22rem] object-contain drop-shadow-2xl"
                  style={{ filter: 'drop-shadow(0 20px 40px rgba(255,140,0,0.22))' }}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PROBLEM SECTION
      ══════════════════════════════════════════ */}
      <section id="masalah" className="py-20 lg:py-28" style={{ background: '#fafafa' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Kenali Masalahnya Dulu"
            badgeColor="#ef4444"
            title={'Sering Pusing karena<br class="hidden sm:block" /> <span style="color:#ef4444">Masalah Ini?</span>'}
            subtitle="Pembukuan berantakan adalah musuh utama pertumbuhan UMKM."
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-7">
            {PROBLEMS.map((p, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-7 transition-all duration-200 hover:shadow-md hover:-translate-y-1"
                style={{ border: '1px solid rgba(0,0,0,0.07)' }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: p.iconBg }}
                >
                  <p.Icon size={22} color={p.iconColor} strokeWidth={2} />
                </div>
                <h3 className="text-[1.03rem] font-bold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-gray-500 text-[0.88rem] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          {/* Arrow transition */}
          <div className="flex flex-col items-center gap-2 mt-12">
            <p className="text-gray-400 text-sm font-medium">Tenang, ada solusinya</p>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white animate-bounce"
              style={{ background: '#ff8c00' }}
            >
              <ChevronDown size={20} />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURE SECTION
      ══════════════════════════════════════════ */}
      <section id="fitur" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Fitur Unggulan"
            badgeColor="#ff8c00"
            title={'Fitur Pintar NOPI, <span style="color:#ff8c00">Sahabat Baru</span> Toko Anda!'}
            subtitle="Teknologi kecerdasan buatan canggih yang dirancang ramah untuk pedagang Indonesia."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1.5"
                style={{
                  background: f.cardBg,
                  border: '1px solid rgba(0,0,0,0.06)',
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: f.iconBg }}
                >
                  <f.Icon size={22} color={f.iconColor} strokeWidth={2} />
                </div>
                <h3 className="text-[0.97rem] font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-[0.84rem] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section id="cara-kerja" className="py-20 lg:py-28" style={{ background: '#f9fafb' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Cara Mulai"
            badgeColor="#34c759"
            title={'Hanya 4 Langkah Mudah<br class="hidden sm:block" /> Mulai Pantau Untung'}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative">
            {/* Connector line for lg */}
            <div
              className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px"
              style={{ background: '#ffd6a0', zIndex: 0 }}
              aria-hidden="true"
            />

            {STEPS.map((s, i) => (
              <div key={i} className="relative z-10 text-center flex flex-col items-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-white"
                  style={{ border: '2px solid #ffb347', boxShadow: '0 4px 16px rgba(255,140,0,0.15)' }}
                >
                  <s.Icon size={26} color="#ff8c00" strokeWidth={1.8} />
                </div>
                <div className="text-xs font-extrabold mb-1.5 tracking-wide" style={{ color: '#ff8c00' }}>
                  LANGKAH {s.number}
                </div>
                <h3 className="text-[0.97rem] font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-[0.84rem] leading-relaxed max-w-[200px]">{s.desc}</p>
              </div>
            ))}
          </div>


        </div>
      </section>

      {/* ══════════════════════════════════════════
          FAQ SECTION
      ══════════════════════════════════════════ */}
      <section id="faq" className="py-20 lg:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Pertanyaan Umum"
            badgeColor="#ff8c00"
            title={'Ada yang Ingin <span style="color:#ff8c00">Kamu Tanyakan?</span>'}
            subtitle="Temukan jawaban cepat seputar cara kerja NOPI untuk toko kamu."
          />

          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}
          >
            {FAQ_LANDING.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="bg-white"
                  style={{ borderBottom: i < FAQ_LANDING.length - 1 ? '1px solid rgba(0,0,0,0.07)' : 'none' }}
                >
                  {/* Question row */}
                  <button
                    id={`lp-faq-q-${i}`}
                    type="button"
                    className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left transition-colors duration-150 hover:bg-[#fffaf4]"
                    aria-expanded={isOpen}
                    onClick={() => toggleFaq(i)}
                  >
                    <span className="flex items-start gap-3">
                      <span
                        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[0.68rem] font-bold"
                        style={{ background: '#fff1e4', color: '#ff8c00' }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[0.97rem] font-semibold text-gray-800 leading-6">
                        {item.question}
                      </span>
                    </span>
                    <ChevronDown
                      size={18}
                      color="#ff8c00"
                      className={`mt-0.5 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Answer panel */}
                  <div
                    id={`lp-faq-a-${i}`}
                    className={`overflow-hidden transition-all duration-200 ease-out ${
                      isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="px-6 pb-5 pl-[3.75rem] text-[0.88rem] leading-7 text-gray-500">
                      {item.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>


        </div>
      </section>

      {/* ══════════════════════════════════════════
          FINAL CTA SECTION
      ══════════════════════════════════════════ */}
      <section
        id="mulai"
        className="py-20 lg:py-28 relative overflow-hidden"
        style={{ background: '#ff8c00' }}
      >
        {/* Decoration circles */}
        <div aria-hidden="true">
          <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <div className="absolute -bottom-20 -left-12 w-56 h-56 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <div className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', transform: 'translateY(-50%)' }} />
        </div>

        <div className="relative max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(255,255,255,0.25)' }}
          >
            <Target size={32} color="#ffffff" />
          </div>
          <h2 className="text-3xl sm:text-[2.2rem] lg:text-5xl font-extrabold text-white leading-tight mb-5">
            Mulai Digitalisasi Pembukuan<br className="hidden sm:block" /> Toko Anda Hari Ini
          </h2>
          <p className="text-white/85 text-base sm:text-lg mb-10 leading-relaxed max-w-2xl mx-auto">
            NOPI membantu UMKM mencatat transaksi lebih cepat, aman, dan otomatis dengan bantuan AI.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              id="final-cta-register"
              className="inline-flex items-center justify-center gap-2 font-bold px-8 py-4 rounded-lg text-[0.97rem] transition-all duration-200 hover:bg-gray-50 active:scale-95"
              style={{ background: '#ffffff', color: '#ff8c00' }}
            >
              <Zap size={18} />
              Daftar Gratis Sekarang
            </Link>
            <Link
              to="/login"
              id="final-cta-login"
              className="inline-flex items-center justify-center gap-2 font-semibold px-8 py-4 rounded-lg text-[0.97rem] transition-all duration-200 hover:bg-white/10 active:scale-95"
              style={{ border: '2px solid rgba(255,255,255,0.55)', color: '#ffffff' }}
            >
              Sudah punya akun? Masuk
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TIM DI BALIK NOPI
      ══════════════════════════════════════════ */}
      <section id="tim" className="py-20 lg:py-28" style={{ background: '#f9fafb' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Tim di Balik NOPI"
            badgeColor="#ff8c00"
            title={'Orang-Orang di <span style="color:#ff8c00">Balik NOPI</span>'}
            subtitle="Mahasiswa teknik informatika yang berdedikasi membangun solusi teknologi cerdas demi digitalisasi jutaan UMKM di Indonesia."
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 lg:gap-6">
            {TEAM.map((member, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 text-center transition-all duration-200 hover:shadow-md hover:-translate-y-1"
                style={{ border: '1px solid rgba(0,0,0,0.07)' }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-4"
                  style={{ background: member.bg, color: member.color }}
                >
                  {member.initials}
                </div>
                <h3 className="text-[0.95rem] font-bold text-gray-900 mb-1 leading-snug">
                  {member.name}
                </h3>
                <span
                  className="inline-block text-[0.72rem] font-bold px-2.5 py-1 rounded-full"
                  style={{ background: member.bg, color: member.color }}
                >
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer style={{ background: '#111827' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-12 pb-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-10">

            {/* Brand */}
            <div className="text-center lg:text-left">
              <div style={{ filter: 'brightness(0) invert(1)', display: 'inline-block' }}>
                <NopiLogo compact />
              </div>
              <p className="text-gray-400 text-sm mt-3 max-w-xs leading-relaxed">
                Solusi Otomasi Pembukuan Praktis untuk UMKM Indonesia.
              </p>
            </div>

            {/* Links */}
            <div className="flex gap-12 sm:gap-16">
              <div>
                <h4 className="text-white text-sm font-bold mb-4 tracking-wide">PRODUK</h4>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li>
                    <button onClick={() => scrollTo('fitur')} className="hover:text-white transition-colors duration-150">
                      Fitur
                    </button>
                  </li>
                  <li>
                    <button onClick={() => scrollTo('cara-kerja')} className="hover:text-white transition-colors duration-150">
                      Cara Kerja
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollTo('faq')}
                      className="hover:text-white transition-colors duration-150"
                    >
                      FAQ
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-white text-sm font-bold mb-4 tracking-wide">AKUN</h4>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li>
                    <Link to="/login" className="hover:text-white transition-colors duration-150">
                      Masuk
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="hover:text-white transition-colors duration-150">
                      Daftar Gratis
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Divider + copyright */}
          <div
            className="mt-10 pt-6 text-center text-xs text-gray-600"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
          >
            © {new Date().getFullYear()} NOPI (Nota Pintar). All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
