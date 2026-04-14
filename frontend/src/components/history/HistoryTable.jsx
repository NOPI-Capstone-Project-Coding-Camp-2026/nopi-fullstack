const HistoryTable = ({ items = [], hasActiveFilters = false }) => {
  const isEmpty = items.length === 0;

  return (
    <div className="overflow-hidden rounded-[26px] border border-[#f1ede8] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
      <div className="bg-[#f7f7f7] px-8 py-6">
        <div className="grid grid-cols-5 gap-4 text-left text-sm font-semibold text-[#909090]">
          <span>Waktu</span>
          <span>Merchant</span>
          <span>Harga Beli</span>
          <span>Margin (%)</span>
          <span className="text-right">Harga Jual</span>
        </div>
      </div>

      {isEmpty ? (
        <div className="px-8 py-20 text-center">
          <h3 className="text-2xl font-semibold text-[#2c2c2c]">
            {hasActiveFilters ? 'Tidak ada data yang cocok' : 'Belum ada riwayat transaksi'}
          </h3>
          <p className="mt-4 text-[1.05rem] leading-8 text-[#8d8d8d]">
            {hasActiveFilters
              ? 'Coba ubah kata kunci, tanggal, atau tipe merchant untuk melihat hasil lainnya.'
              : 'Riwayat nota akan muncul setelah Anda mengunggah dan menyimpan hasil scan pertama.'}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#f4f0ea]">
          {items.map((item) => (
            <div key={item.id} className="grid grid-cols-5 gap-4 px-8 py-6 text-[#2c2c2c]">
              <div>
                <div className="font-semibold">{item.dateLabel}</div>
                <div className="mt-1 text-sm text-[#909090]">{item.timeLabel}</div>
              </div>
              <div className="font-semibold">{item.merchant}</div>
              <div>{item.cost}</div>
              <div>{item.margin}</div>
              <div className="text-right">{item.sellPrice}</div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-4 px-8 py-6 text-[#909090] sm:flex-row sm:items-center sm:justify-between">
        <p>Menampilkan {items.length} dari {items.length} transaksi</p>
        <div className="flex items-center gap-6 text-lg">
          <span>&lsaquo;</span>
          <span className="font-semibold text-[#242424]">1</span>
          <span>&rsaquo;</span>
        </div>
      </div>
    </div>
  );
};

export default HistoryTable;
