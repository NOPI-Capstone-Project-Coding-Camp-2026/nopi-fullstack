export const faqItems = [
  {
    question: 'Apa fungsi utama fitur Upload Nota?',
    answer:
      'Fitur Upload Nota membantu pengguna mengubah foto nota menjadi data transaksi digital. Setelah nota diunggah, sistem akan membaca isi nota menggunakan AI dan menampilkan hasilnya pada halaman validasi.',
  },
  {
    question: 'Mengapa hasil scan nota perlu divalidasi?',
    answer:
      'Hasil scan dari AI dapat mempercepat pencatatan, tetapi tetap perlu diperiksa oleh pengguna. Kualitas foto, pencahayaan, tulisan nota, dan format nota yang berbeda-beda dapat memengaruhi hasil pembacaan AI.',
  },
  {
    question: 'Data apa saja yang ditampilkan dari hasil AI?',
    answer:
      'Data utama yang ditampilkan meliputi nama toko supplier, tanggal transaksi, nama barang, jumlah barang, harga satuan, dan total harga item. Data ini menjadi dasar pencatatan transaksi pembelian pengguna.',
  },
  {
    question: 'Apakah pengguna bisa mengedit hasil scan AI?',
    answer:
      'Ya. Pengguna dapat mengedit hasil scan sebelum menyimpan transaksi. Fitur ini membantu memperbaiki data jika terdapat kesalahan pembacaan, seperti nama barang, jumlah barang, atau harga yang tidak sesuai.',
  },
  {
    question: 'Apa fungsi tabel item hasil scan?',
    answer:
      'Tabel item hasil scan digunakan untuk menampilkan daftar barang dari nota secara terstruktur. Melalui tabel ini, pengguna dapat melihat, mengubah, menambah, atau menghapus item sebelum transaksi disimpan.',
  },
  {
    question: 'Mengapa ada kolom harga jual dan profit margin?',
    answer:
      'Kolom harga jual dan profit margin membantu NOPI tidak hanya mencatat transaksi pembelian, tetapi juga memperkirakan keuntungan. Dengan memasukkan harga jual, pengguna dapat melihat potensi margin dari setiap barang.',
  },
  {
    question: 'Apakah perhitungan keuntungan dilakukan otomatis?',
    answer:
      'Ya. Sistem dapat menghitung total modal, total harga jual, margin per item, dan total profit secara otomatis berdasarkan data item yang sudah divalidasi pengguna.',
  },
  {
    question: 'Apa manfaat fitur validasi hasil AI bagi pengguna UMKM?',
    answer:
      'Fitur validasi hasil AI membantu pengguna mencatat transaksi lebih cepat tanpa kehilangan kontrol atas data. Pengguna tetap bisa memastikan setiap item, harga, dan jumlah barang sudah benar sebelum data disimpan.',
  },
  {
    question: 'Apakah data nota langsung tersimpan setelah diunggah?',
    answer:
      'Tidak. Nota tidak langsung disimpan setelah diunggah. Pengguna akan diarahkan terlebih dahulu ke halaman validasi untuk memeriksa hasil AI, mengedit data jika diperlukan, lalu menyimpan transaksi secara manual.',
  },
  {
    question: 'Di mana pengguna bisa melihat transaksi yang sudah disimpan?',
    answer:
      'Transaksi yang sudah disimpan dapat dilihat melalui halaman Riwayat. Halaman ini menampilkan daftar riwayat nota yang pernah dicatat oleh pengguna.',
  },
  {
    question: 'Apakah fitur Edit Nota sudah tersedia?',
    answer:
      'Ya. Fitur Edit Nota tersedia melalui halaman Detail Nota, sehingga pengguna dapat membuka detail transaksi terlebih dahulu sebelum mengubah data nota dan item.',
  },
  {
    question: 'Apakah fitur ini mendukung tampilan ponsel?',
    answer:
      'Ya. Tampilan fitur NOPI sedang disesuaikan agar tetap nyaman digunakan di desktop maupun ponsel, terutama pada halaman Upload Nota, Validasi Hasil AI, Riwayat, Masuk, dan Profil.',
  },
  {
    question: 'Apa keunggulan fitur ini dibanding pencatatan manual?',
    answer:
      'Fitur ini membantu mempercepat pencatatan transaksi dari nota, mengurangi input manual, meminimalkan risiko data tercecer, dan membantu pengguna melihat estimasi keuntungan dari barang yang dibeli.',
  },
];
