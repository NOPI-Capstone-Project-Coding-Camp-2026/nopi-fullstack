const HistoryTable = ({ items = [], hasActiveFilters = false }) => {
  const isEmpty = items.length === 0;

  const renderReceiptImage = (item, sizeClassName = 'h-12 w-12') => (
    item.imageUrl ? (
      <a href={item.imageUrl} target="_blank" rel="noopener noreferrer" className="inline-flex">
        <img
          src={item.imageUrl}
          alt={`Nota ${item.merchant}`}
          className={`${sizeClassName} rounded-[8px] border border-[#f0e5d8] object-cover transition hover:opacity-80`}
        />
      </a>
    ) : (
      <div className={`${sizeClassName} inline-flex items-center justify-center rounded-[8px] border border-dashed border-[#e8ddd2] bg-[#fcfaf7] px-2 text-center text-[0.7rem] font-medium leading-4 text-[#b0b0b0]`}>
        Belum ada foto
      </div>
    )
  );

  const InfoRow = ({ label, value, strong = false }) => (
    <div className="min-w-0">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#aaa19a]">{label}</p>
      <p className={`mt-1 truncate text-sm text-[#2c2c2c] ${strong ? 'font-semibold' : 'font-medium'}`}>
        {value || '-'}
      </p>
    </div>
  );

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
        <>
          <div className="grid gap-3 p-3 lg:hidden">
            {items.map((item) => (
              <article key={item.id} className="rounded-[8px] border border-[#f1ede8] bg-[#fffdf9] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-[#2c2c2c]">{item.merchant}</p>
                    <p className="mt-1 text-xs font-medium text-[#909090]">
                      {item.dateLabel || item.date}
                      {item.timeLabel ? ` • ${item.timeLabel}` : ''}
                    </p>
                  </div>
                  {renderReceiptImage(item, 'h-14 w-14 shrink-0')}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <InfoRow label="Harga Beli" value={item.cost} strong />
                  <InfoRow label="Harga Jual" value={item.sellPrice} strong />
                  <InfoRow label="Margin" value={item.margin || '-'} />
                  <InfoRow label="Tipe" value={item.type} />
                </div>
              </article>
            ))}
          </div>

          <div className="hidden overflow-x-auto lg:block">
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
                    <td className="px-4 py-3.5 sm:px-5">
                      {renderReceiptImage(item)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
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
