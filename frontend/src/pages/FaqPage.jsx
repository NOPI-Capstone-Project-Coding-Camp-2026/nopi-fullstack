import DashboardLayout from '../components/layout/DashboardLayout';

const faqItems = [
  {
    question: 'Apa itu NOPI?',
    answer:
      'NOPI adalah aplikasi Nota Pintar yang membantu pelaku usaha mengelola nota, transaksi, dan profil bisnis dengan lebih rapi.',
  },
  {
    question: 'Kenapa saya harus melengkapi profile terlebih dahulu?',
    answer:
      'Profile bisnis perlu dilengkapi agar sistem dapat mengaktifkan seluruh fitur sesuai identitas toko Anda.',
  },
  {
    question: 'Fitur apa saja yang bisa diakses sebelum profile lengkap?',
    answer: 'Sebelum profile lengkap, Anda hanya dapat mengakses Dashboard dan Profile.',
  },
  {
    question: 'Data apa saja yang wajib diisi di halaman Profile?',
    answer:
      'Nama Toko, Kategori Bisnis, Lokasi/Alamat, Nomor Telefon, dan Email Terdaftar.',
  },
  {
    question: 'Apakah email terdaftar bisa diubah?',
    answer: 'Tidak. Email terdaftar ditampilkan sebagai informasi akun dan tidak dapat diubah.',
  },
  {
    question: 'Bagaimana cara upload nota?',
    answer:
      'Masuk ke halaman Upload Nota, pilih gambar nota, lalu lanjutkan proses scan sesuai alur yang tersedia.',
  },
  {
    question: 'Apa fungsi menu History?',
    answer: 'Menu History menampilkan riwayat transaksi atau nota yang telah diproses dan tersimpan.',
  },
  {
    question: 'Kenapa muncul popup untuk melengkapi profile?',
    answer:
      'Popup tersebut muncul karena profil bisnis Anda belum lengkap. Lengkapi profile agar semua fitur dapat digunakan.',
  },
];

const FaqPage = () => {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.06em] text-[#ea8327] sm:text-4xl lg:text-[3.2rem]">FAQ</h1>
        <p className="mt-3 text-base text-[#2d2d2d] sm:text-[1.05rem] lg:text-[1.15rem]">
          Temukan jawaban singkat dan resmi seputar penggunaan fitur, kelengkapan profile, dan alur utama di NOPI.
        </p>
      </div>

      <div className="mt-8 rounded-[8px] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
        <div className="mb-6 rounded-[8px] border border-[#f2e4d7] bg-[#fff8f2] px-4 py-4 sm:px-5">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#b68352]">Pusat Bantuan NOPI</p>
          <p className="mt-2 text-sm leading-7 text-[#6f6f6f] sm:text-[0.96rem]">
            FAQ ini disusun untuk membantu Anda memahami alur penggunaan aplikasi sesuai pembaruan frontend terbaru.
          </p>
        </div>

        {faqItems.map((item, index) => (
          <div
            key={item.question}
            className={`rounded-[8px] border border-[#f4ede5] bg-[#fffdfa] p-5 sm:p-6 ${
              index === faqItems.length - 1 ? '' : 'mb-4 sm:mb-5'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff1e4] text-sm font-semibold text-[#e27c3e]">
                {index + 1}
              </div>
              <h2 className="text-lg font-semibold leading-7 text-[#2d2d2d] sm:text-[1.15rem]">
                {item.question}
              </h2>
            </div>
            <div className="mt-4 border-l-2 border-[#ffe1c3] pl-4">
              <p className="text-[0.95rem] leading-7 text-[#737373] sm:text-[1rem] sm:leading-8">{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default FaqPage;
