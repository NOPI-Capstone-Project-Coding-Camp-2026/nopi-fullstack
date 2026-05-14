const HistoryTable = ({ items = [], hasActiveFilters = false }) => {
  const isEmpty = items.length === 0;

  return (
    <div className="overflow-hidden rounded-[8px] border border-[#f1ede8] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
      {isEmpty ? (
        <div className="px-5 py-12 text-center sm:px-8 sm:py-16">
          <h3 className="text-lg font-semibold text-[#2c2c2c] sm:text-xl">
            {hasActiveFilters ? 'Tidak ada data yang cocok' : 'Belum ada riwayat transaksi'}
          </h3>
          <p className="mt-3 text-[0.94rem] leading-7 text-[#8d8d8d] sm:text-[0.98rem]">
            {hasActiveFilters
              ? 'Coba ubah kata kunci, bulan, atau tipe merchant untuk melihat hasil lainnya.'
              : 'Riwayat nota akan muncul setelah Anda mengunggah dan menyimpan hasil scan pertama.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[880px] w-full border-collapse text-left text-[0.9rem] text-[#2c2c2c]">
            <thead className="bg-[#f7f7f7] text-[0.74rem] font-semibold uppercase tracking-[0.12em] text-[#909090]">
              <tr>
                <th className="px-4 py-3 whitespace-nowrap sm:px-5">Waktu</th>
                <th className="px-4 py-3 whitespace-nowrap sm:px-5">Merchant</th>
                <th className="px-4 py-3 whitespace-nowrap sm:px-5">Harga Beli</th>
                <th className="px-4 py-3 whitespace-nowrap sm:px-5">Harga Jual</th>
                <th className="px-4 py-3 whitespace-nowrap sm:px-5">Margin (%)</th>
                <th className="px-4 py-3 whitespace-nowrap sm:px-5">Tipe</th>
                <th className="px-4 py-3 whitespace-nowrap sm:px-5">Foto Nota User</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-[#f4f0ea] align-top">
                  <td className="px-4 py-3.5 whitespace-nowrap sm:px-5">
                    {/* Menggunakan date (dari formatter backend) atau dateLabel */}
                    <div className="font-semibold">{item.dateLabel || item.date}</div>
                    <div className="mt-1 text-[0.8rem] text-[#909090]">{item.timeLabel || ''}</div>
                  </td>
                  <td className="px-4 py-3.5 sm:px-5">
                    <div className="font-semibold">{item.merchant}</div>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap sm:px-5">{item.cost}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap sm:px-5">{item.sellPrice}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap sm:px-5">{item.margin || '-'}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap capitalize sm:px-5">{item.type}</td>
                  
                  {/* BAGIAN FOTO YANG SUDAH DIPERBAIKI */}
                  <td className="px-4 py-3.5 sm:px-5">
                    {item.imageUrl ? (
                      <a href={item.imageUrl} target="_blank" rel="noopener noreferrer">
                        <img
                          src={item.imageUrl}
                          alt={`Nota ${item.merchant}`}
                          className="h-12 w-12 rounded-[8px] border border-[#f0e5d8] object-cover hover:opacity-80 transition cursor-pointer"
                        />
                      </a>
                    ) : (
                      <div className="inline-flex h-12 min-w-12 items-center justify-center rounded-[8px] border border-dashed border-[#e8ddd2] bg-[#fcfaf7] px-2 text-center text-[0.7rem] font-medium leading-4 text-[#b0b0b0]">
                        Belum ada foto
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex flex-col gap-3 px-5 py-4 text-[0.86rem] text-[#909090] sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>Menampilkan {items.length} dari {items.length} transaksi</p>
        <div className="flex items-center gap-5 text-base">
          <span>&lsaquo;</span>
          <span className="font-semibold text-[#242424]">1</span>
          <span>&rsaquo;</span>
        </div>
      </div>
    </div>
  );
};

export default HistoryTable;