import { useMemo, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import HistoryTable from '../components/history/HistoryTable';
import { CalendarIcon, SearchIcon } from '../components/ui/AppIcons';

const historyItems = [];

const merchantTypes = [
  { value: 'all', label: 'Semua Merchant' },
  { value: 'warung', label: 'Warung' },
  { value: 'restoran', label: 'Restoran' },
  { value: 'retail', label: 'Retail' },
  { value: 'lainnya', label: 'Lainnya' },
];

const History = () => {
  const [keyword, setKeyword] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [merchantType, setMerchantType] = useState('all');

  const filteredItems = useMemo(() => {
    return historyItems.filter((item) => {
      const matchesKeyword =
        keyword.trim() === '' ||
        item.merchant?.toLowerCase().includes(keyword.toLowerCase()) ||
        item.sellPrice?.toLowerCase().includes(keyword.toLowerCase());

      const itemDate = item.dateIso || '';
      const matchesDateFrom = !dateFrom || itemDate >= dateFrom;
      const matchesDateTo = !dateTo || itemDate <= dateTo;
      const matchesMerchantType = merchantType === 'all' || item.type === merchantType;

      return matchesKeyword && matchesDateFrom && matchesDateTo && matchesMerchantType;
    });
  }, [keyword, dateFrom, dateTo, merchantType]);

  const hasActiveFilters = keyword.trim() !== '' || dateFrom !== '' || dateTo !== '' || merchantType !== 'all';

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.06em] text-[#ea8327] sm:text-4xl lg:text-[3.2rem]">
          Riwayat Transaksi
        </h1>
        <p className="mt-3 text-base text-[#2d2d2d] sm:text-[1.05rem] lg:text-[1.15rem]">
          Manajemen data seluruh riwayat transaksi nota Anda.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-6 xl:grid-cols-3">
        <label className="flex items-center gap-4 rounded-[20px] bg-white px-4 py-4 shadow-[0_12px_28px_rgba(15,23,42,0.06)] sm:px-6 sm:py-5">
          <CalendarIcon className="h-6 w-6 text-[#909090]" />
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#b0b0b0]">Dari tanggal</p>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="mt-2 w-full border-0 bg-transparent p-0 text-[1rem] text-[#2d2d2d] outline-none"
            />
          </div>
        </label>

        <label className="flex items-center gap-4 rounded-[20px] bg-white px-4 py-4 shadow-[0_12px_28px_rgba(15,23,42,0.06)] sm:px-6 sm:py-5">
          <CalendarIcon className="h-6 w-6 text-[#909090]" />
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#b0b0b0]">Sampai tanggal</p>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="mt-2 w-full border-0 bg-transparent p-0 text-[1rem] text-[#2d2d2d] outline-none"
            />
          </div>
        </label>

        <label className="flex items-center gap-4 rounded-[20px] bg-white px-4 py-4 shadow-[0_12px_28px_rgba(15,23,42,0.06)] sm:px-6 sm:py-5">
          <SearchIcon className="h-6 w-6 text-[#909090]" />
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#b0b0b0]">Kata kunci</p>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Cari merchant atau harga..."
              className="mt-2 w-full border-0 bg-transparent p-0 text-[1rem] text-[#2d2d2d] outline-none placeholder:text-[#c1c1c1]"
            />
          </div>
        </label>
      </div>

      <div className="mt-6">
        <label className="flex items-center gap-4 rounded-[20px] bg-white px-4 py-4 shadow-[0_12px_28px_rgba(15,23,42,0.06)] sm:px-6 sm:py-5 xl:max-w-[420px]">
          <SearchIcon className="h-6 w-6 text-[#909090]" />
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#b0b0b0]">Tipe merchant</p>
            <select
              value={merchantType}
              onChange={(e) => setMerchantType(e.target.value)}
              className="mt-2 w-full border-0 bg-transparent p-0 text-[1rem] text-[#2d2d2d] outline-none"
            >
              {merchantTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </label>
      </div>

      <div className="mt-10">
        <HistoryTable items={filteredItems} hasActiveFilters={hasActiveFilters} />
      </div>
    </DashboardLayout>
  );
};

export default History;
