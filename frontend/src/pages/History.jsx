import { useMemo, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import HistoryTable from '../components/history/HistoryTable';
import { CalendarIcon, SearchIcon } from '../components/ui/AppIcons';
import { getMonthOptions, normalizedHistoryItems } from '../data/transactions';

const merchantTypes = [
  { value: 'all', label: 'Semua Merchant' },
  { value: 'warung', label: 'Warung' },
  { value: 'restoran', label: 'Restoran' },
  { value: 'retail', label: 'Retail' },
  { value: 'lainnya', label: 'Lainnya' },
];

const History = () => {
  const monthOptions = useMemo(() => getMonthOptions(normalizedHistoryItems), []);
  const defaultMonth = monthOptions[0]?.value || '';
  const [keyword, setKeyword] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [merchantType, setMerchantType] = useState('all');

  const filteredItems = useMemo(() => {
    return normalizedHistoryItems.filter((item) => {
      const matchesKeyword =
        keyword.trim() === '' ||
        item.merchant?.toLowerCase().includes(keyword.toLowerCase()) ||
        item.sellPrice?.toLowerCase().includes(keyword.toLowerCase()) ||
        item.cost?.toLowerCase().includes(keyword.toLowerCase());

      const matchesMonth = !selectedMonth || item.monthKey === selectedMonth;
      const matchesMerchantType = merchantType === 'all' || item.type === merchantType;

      return matchesKeyword && matchesMonth && matchesMerchantType;
    });
  }, [keyword, merchantType, selectedMonth]);

  const hasActiveFilters = keyword.trim() !== '' || selectedMonth !== defaultMonth || merchantType !== 'all';

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-[1.9rem] font-semibold tracking-[-0.06em] text-[#ea8327] sm:text-[2.3rem] lg:text-[2.8rem]">
          Riwayat Transaksi
        </h1>
        <p className="mt-2.5 text-[0.95rem] text-[#2d2d2d] sm:text-[1rem] lg:text-[1.02rem]">
          Manajemen data seluruh riwayat transaksi nota Anda.
        </p>
      </div>

      <div className="mt-7 grid gap-4 sm:mt-8 xl:grid-cols-3">
        <label className="flex items-center gap-3 rounded-[8px] bg-white px-4 py-3.5 shadow-[0_12px_28px_rgba(15,23,42,0.06)] sm:px-5">
          <CalendarIcon className="h-5 w-5 text-[#909090]" />
          <div className="flex-1">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#b0b0b0]">Per bulan</p>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="mt-1.5 w-full border-0 bg-transparent p-0 text-[0.96rem] text-[#2d2d2d] outline-none"
            >
              {monthOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </label>

        <label className="flex items-center gap-3 rounded-[8px] bg-white px-4 py-3.5 shadow-[0_12px_28px_rgba(15,23,42,0.06)] sm:px-5">
          <SearchIcon className="h-5 w-5 text-[#909090]" />
          <div className="flex-1">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#b0b0b0]">Kata kunci</p>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Cari merchant atau harga..."
              className="mt-1.5 w-full border-0 bg-transparent p-0 text-[0.96rem] text-[#2d2d2d] outline-none placeholder:text-[#c1c1c1]"
            />
          </div>
        </label>

        <label className="flex items-center gap-3 rounded-[8px] bg-white px-4 py-3.5 shadow-[0_12px_28px_rgba(15,23,42,0.06)] sm:px-5">
          <SearchIcon className="h-5 w-5 text-[#909090]" />
          <div className="flex-1">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#b0b0b0]">Tipe merchant</p>
            <select
              value={merchantType}
              onChange={(e) => setMerchantType(e.target.value)}
              className="mt-1.5 w-full border-0 bg-transparent p-0 text-[0.96rem] text-[#2d2d2d] outline-none"
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

      <div className="mt-8">
        <HistoryTable items={filteredItems} hasActiveFilters={hasActiveFilters} />
      </div>
    </DashboardLayout>
  );
};

export default History;
