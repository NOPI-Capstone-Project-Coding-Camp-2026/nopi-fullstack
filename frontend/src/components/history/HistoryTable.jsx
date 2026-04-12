const dummyData = [
  { id: 1, date: '12 Jan 2026', time: '14.20 WIB', merchant: 'Warung Kopi Alex', cost: 'Rp. 450.000', margin: '12,5%', sellPrice: 'Rp 55.000' },
  { id: 2, date: '12 Jan 2026', time: '14.20 WIB', merchant: 'Warung Kopi Alex', cost: 'Rp. 450.000', margin: '12,5%', sellPrice: 'Rp 55.000' },
  { id: 3, date: '12 Jan 2026', time: '14.20 WIB', merchant: 'Warung Kopi Alex', cost: 'Rp. 450.000', margin: '12,5%', sellPrice: 'Rp 55.000' },
  { id: 4, date: '12 Jan 2026', time: '14.20 WIB', merchant: 'Warung Kopi Alex', cost: 'Rp. 450.000', margin: '12,5%', sellPrice: 'Rp 55.000' },
  { id: 5, date: '12 Jan 2026', time: '14.20 WIB', merchant: 'Warung Kopi Alex', cost: 'Rp. 450.000', margin: '12,5%', sellPrice: 'Rp 55.000' },
];

const HistoryTable = () => {
  return (
    <div className="overflow-hidden rounded-[26px] border border-[#f1ede8] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-[#f7f7f7]">
            <tr className="text-left text-sm text-[#909090]">
              <th className="px-8 py-6 font-semibold">Waktu</th>
              <th className="px-6 py-6 font-semibold">Merchant</th>
              <th className="px-6 py-6 font-semibold">Harga Beli</th>
              <th className="px-6 py-6 font-semibold">Margin (%)</th>
              <th className="px-8 py-6 text-right font-semibold">Harga Jual</th>
            </tr>
          </thead>

          <tbody>
            {dummyData.map((item) => (
              <tr key={item.id} className="border-t border-[#f4f0ea] text-sm">
                <td className="px-8 py-8 text-[#242424]">
                  <div className="font-semibold">{item.date}</div>
                  <div className="mt-1 text-xs text-[#909090]">{item.time}</div>
                </td>
                <td className="px-6 py-8 font-semibold text-[#2c2c2c]">{item.merchant}</td>
                <td className="px-6 py-8 text-lg font-medium text-[#2c2c2c]">{item.cost}</td>
                <td className="px-6 py-8">
                  <span className="inline-flex rounded-full bg-[#35c759] px-4 py-2 text-sm font-semibold text-white">
                    {item.margin}
                  </span>
                </td>
                <td className="px-8 py-8 text-right text-lg font-medium text-[#f1781c]">{item.sellPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 px-8 py-6 text-[#909090] sm:flex-row sm:items-center sm:justify-between">
        <p>Menampilkan 1-10 dari 452 transaksi</p>
        <div className="flex items-center gap-6 text-lg">
          <span>&lsaquo;</span>
          <span className="font-semibold text-[#242424]">1</span>
          <span>2</span>
          <span>3</span>
          <span>...</span>
          <span>10</span>
          <span>&rsaquo;</span>
        </div>
      </div>
    </div>
  );
};

export default HistoryTable;
