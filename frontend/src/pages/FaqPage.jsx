import DashboardLayout from '../components/layout/DashboardLayout';

const faqItems = [
  {
    category: 'Teknis',
    question: 'Bagaimana cara agar hasil scan akurat?',
    answer: 'Pastikan nota berada di permukaan datar, cahaya terang, dan seluruh teks dalam nota masuk ke dalam bingkai foto.',
  },
  {
    category: 'Fitur AI',
    question: 'Mengapa sistem menolak gambar saya?',
    answer: 'Filter CNN kami memastikan hanya dokumen berupa nota/struk yang diproses. Jika terlalu buram atau bukan nota, sistem akan menolaknya demi akurasi data.',
  },
  {
    category: 'Kalkulasi',
    question: 'Apa itu Margin Laba di halaman verifikasi?',
    answer: 'Itu adalah persentase keuntungan yang ingin Anda ambil. NOPI akan menghitung otomatis saran harga jual berdasarkan harga beli yang terdeteksi.',
  },
  {
    category: 'Keamanan',
    question: 'Apakah data transaksi saya aman?',
    answer: 'Tentu. Semua data disimpan secara terenkripsi menggunakan infrastruktur Supabase dan hanya dapat diakses oleh Anda.',
  },
  {
    category: 'Ekspor',
    question: 'Dalam format apa saya bisa mengunduh laporan?',
    answer: 'Laporan dapat diekspor ke format yang umum dipakai agar mudah dibagikan ke tim operasional dan akuntansi.',
  },
];

const FaqPage = () => {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-[3.2rem] font-semibold tracking-[-0.06em] text-[#ea8327]">FAQ</h1>
        <p className="mt-3 text-[1.15rem] text-[#2d2d2d]">
          Temukan jawaban cepat seputar penggunaan fitur AI dan manajemen nota di NOPI.
        </p>
      </div>

      <div className="mt-8 rounded-[26px] bg-white p-10 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
        {faqItems.map((item, index) => (
          <div key={index} className={index === faqItems.length - 1 ? '' : 'mb-8'}>
            <div className="flex items-center gap-4">
              <div className="h-7 w-1 rounded-full bg-[#ff9735]" />
              <h3 className="text-[1.9rem] font-medium tracking-[-0.04em] text-[#2d2d2d]">
                {item.category}
              </h3>
            </div>
            <p className="mt-4 text-lg font-semibold text-[#2d2d2d]">{item.question}</p>
            <p className="mt-2 text-[1.05rem] leading-9 text-[#8d8d8d]">{item.answer}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default FaqPage;
