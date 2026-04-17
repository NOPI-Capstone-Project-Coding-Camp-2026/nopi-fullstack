const HistoryTable = ({ items = [], hasActiveFilters = false }) => {
  const isEmpty = items.length === 0;

  return (
    <div className="overflow-hidden rounded-[26px] border border-[#f1ede8] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
      <div className="hidden bg-[#f7f7f7] px-8 py-6 md:block">
        <div className="grid grid-cols-5 gap-4 text-left text-sm font-semibold text-[#909090]">
          <span>Waktu</span>
          <span>Merchant</span>
          <span>Harga Beli</span>
          <span>Margin (%)</span>
          <span className="text-right">Harga Jual</span>
        </div>
      </div>

      {isEmpty ? (
        <div className="px-5 py-14 text-center sm:px-8 sm:py-20">
          <h3 className="text-xl font-semibold text-[#2c2c2c] sm:text-2xl">
            {hasActiveFilters ? 'Tidak ada data yang cocok' : 'Belum ada riwayat transaksi'}
          </h3>
          <p className="mt-4 text-base leading-7 text-[#8d8d8d] sm:text-[1.05rem] sm:leading-8">
            {hasActiveFilters
              ? 'Coba ubah kata kunci, tanggal, atau tipe merchant untuk melihat hasil lainnya.'
              : 'Riwayat nota akan muncul setelah Anda mengunggah dan menyimpan hasil scan pertama.'}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#f4f0ea]">
          {items.map((item) => (
            <div key={item.id} className="px-5 py-5 text-[#2c2c2c] sm:px-8 sm:py-6">
              <div className="grid gap-3 md:grid-cols-5 md:gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#b0b0b0] md:hidden">Waktu</div>
                  <div className="font-semibold">{item.dateLabel}</div>
                  <div className="mt-1 text-sm text-[#909090]">{item.timeLabel}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#b0b0b0] md:hidden">Merchant</div>
                  <div className="font-semibold">{item.merchant}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#b0b0b0] md:hidden">Harga Beli</div>
                  <div>{item.cost}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#b0b0b0] md:hidden">Margin</div>
                  <div>{item.margin}</div>
                </div>
                <div className="md:text-right">
                  <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#b0b0b0] md:hidden">Harga Jual</div>
                  <div>{item.sellPrice}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-4 px-5 py-6 text-[#909090] sm:flex-row sm:items-center sm:justify-between sm:px-8">
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
