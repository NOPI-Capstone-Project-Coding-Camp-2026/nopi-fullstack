import { useMemo, useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import HistoryTable from '../components/history/HistoryTable';
import { CalendarIcon, SearchIcon } from '../components/ui/AppIcons';
import { SkeletonTableRow } from '../components/ui/SkeletonLoader';
import { apiUrl } from '../utils/api';
import { canUseMockAuth } from '../utils/mockAuth';
import { getMockNotas } from '../utils/mockData';
import { formatCurrency, parseCurrencyValue } from '../utils/formatCurrency';
import { calculateReceiptSummary, mapDbItemsToState } from '../utils/receiptItems';

const MONTH_OPTIONS = [
  { value: '1', label: 'Januari' },
  { value: '2', label: 'Februari' },
  { value: '3', label: 'Maret' },
  { value: '4', label: 'April' },
  { value: '5', label: 'Mei' },
  { value: '6', label: 'Juni' },
  { value: '7', label: 'Juli' },
  { value: '8', label: 'Agustus' },
  { value: '9', label: 'September' },
  { value: '10', label: 'Oktober' },
  { value: '11', label: 'November' },
  { value: '12', label: 'Desember' },
];

const PAGE_SIZE = 10;


const getValidDate = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getIndonesiaDateParts = (date) => {
  const parts = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(date);

  return parts.reduce((dateParts, part) => {
    if (part.type === 'year' || part.type === 'month' || part.type === 'day') {
      return { ...dateParts, [part.type]: Number(part.value) };
    }

    return dateParts;
  }, {});
};

const getDaysInMonth = (year, month) => new Date(Number(year), Number(month), 0).getDate();

const formatHistoryItem = (nota) => {
  const dateObj = getValidDate(nota.tanggal) || getValidDate(nota.createdAt);
  const dateParts = dateObj ? getIndonesiaDateParts(dateObj) : null;
  
  // 🚨 KUNCI KONSISTENSI: Hitung total dari detail barang
  const stateItems = mapDbItemsToState(nota.items || []);
  const summary = calculateReceiptSummary(stateItems);
  const rawCost = summary.hasTotalModal ? summary.totalModal : parseCurrencyValue(nota.totalHarga ?? nota.cost ?? 0);

  return {
    id: nota.id ?? nota._id,
    merchant: nota.toko || nota.merchant || 'Tidak Diketahui',
    cost: formatCurrency(rawCost),
    rawCost,
    date: dateObj
      ? dateObj.toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta' })
      : '-',
    dateLabel: dateObj
      ? dateObj.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          timeZone: 'Asia/Jakarta',
        })
      : '-',
    dateParts,
    rawNota: nota,
  };
};

const History = () => {
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [keyword, setKeyword] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setFetchError(false);

        // ─── MOCK MODE BYPASS ────────────────────────────────────────────────────
        if (canUseMockAuth()) {
          const mockNotas = getMockNotas();
          setHistoryData(mockNotas.map(formatHistoryItem));
          setIsLoading(false);
          return;
        }
        // ──────────────────────────────────────────────────────────────────────────

        const token = localStorage.getItem('token');
        const res = await fetch(apiUrl('/api/nota/history'), {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const result = await res.json();
        
        if (res.ok) {
          const historyData = Array.isArray(result.data) ? result.data : [];
          setHistoryData(historyData.map(formatHistoryItem));
        } else {
          setFetchError(true);
        }
      } catch {
        setFetchError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const yearOptions = useMemo(() => {
    const uniqueYears = [...new Set(historyData.map(item => item.dateParts?.year).filter(Boolean))];
    uniqueYears.sort((a, b) => b - a);

    return uniqueYears;
  }, [historyData]);

  const dayOptions = useMemo(() => {
    if (!selectedYear || !selectedMonth) {
      return [];
    }

    return Array.from(
      { length: getDaysInMonth(selectedYear, selectedMonth) },
      (_, index) => String(index + 1),
    );
  }, [selectedMonth, selectedYear]);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    setSelectedMonth('');
    setSelectedDay('');
    setCurrentPage(1);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    setSelectedDay('');
    setCurrentPage(1);
  };

  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
    setCurrentPage(1);
  };

  const handleKeywordChange = (event) => {
    setKeyword(event.target.value);
    setCurrentPage(1);
  };

  const filteredHistory = useMemo(() => {
    return historyData.filter((item) => {
      const normalizedKeyword = keyword.trim().toLowerCase();
      const matchesKeyword =
        normalizedKeyword === '' ||
        item.merchant?.toLowerCase().includes(normalizedKeyword) ||
        item.cost?.toLowerCase().includes(normalizedKeyword) ||
        `${item.rawCost ?? ''}`.toLowerCase().includes(normalizedKeyword);

      const matchesYear = !selectedYear || item.dateParts?.year === Number(selectedYear);
      const matchesMonth = !selectedMonth || item.dateParts?.month === Number(selectedMonth);
      const matchesDay = !selectedDay || item.dateParts?.day === Number(selectedDay);

      return matchesKeyword && matchesYear && matchesMonth && matchesDay;
    });
  }, [historyData, keyword, selectedDay, selectedMonth, selectedYear]);

  const hasActiveFilters =
    keyword.trim() !== '' || selectedYear !== '' || selectedMonth !== '' || selectedDay !== '';

  const totalFilteredItems = filteredHistory.length;
  const totalPages = Math.ceil(totalFilteredItems / PAGE_SIZE);
  const safeCurrentPage = totalPages > 0 ? Math.min(currentPage, totalPages) : 1;
  const pageStartIndex = (safeCurrentPage - 1) * PAGE_SIZE;
  const paginatedHistory = filteredHistory.slice(pageStartIndex, pageStartIndex + PAGE_SIZE);
  const displayStart = totalFilteredItems === 0 ? 0 : pageStartIndex + 1;
  const displayEnd = Math.min(pageStartIndex + paginatedHistory.length, totalFilteredItems);
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

      <div className="mt-7 grid gap-4 sm:mt-8 md:grid-cols-2 xl:grid-cols-4">
        <label className="flex items-center gap-3 rounded-[8px] bg-white px-4 py-3.5 shadow-[0_12px_28px_rgba(15,23,42,0.06)] sm:px-5">
          <CalendarIcon className="h-5 w-5 text-[#909090]" />
          <div className="flex-1">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#b0b0b0]">Tahun</p>
            <select
              value={selectedYear}
              onChange={handleYearChange}
              className="mt-1.5 w-full border-0 bg-transparent p-0 text-[0.96rem] text-[#2d2d2d] outline-none"
            >
              <option value="">Semua Tahun</option>
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </label>

        <label className="flex items-center gap-3 rounded-[8px] bg-white px-4 py-3.5 shadow-[0_12px_28px_rgba(15,23,42,0.06)] sm:px-5">
          <CalendarIcon className="h-5 w-5 text-[#909090]" />
          <div className="flex-1">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#b0b0b0]">Bulan</p>
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              disabled={!selectedYear}
              className="mt-1.5 w-full border-0 bg-transparent p-0 text-[0.96rem] text-[#2d2d2d] outline-none"
            >
              <option value="">Semua Bulan</option>
              {MONTH_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </label>

        <label className="flex items-center gap-3 rounded-[8px] bg-white px-4 py-3.5 shadow-[0_12px_28px_rgba(15,23,42,0.06)] sm:px-5">
          <CalendarIcon className="h-5 w-5 text-[#909090]" />
          <div className="flex-1">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#b0b0b0]">Tanggal</p>
            <select
              value={selectedDay}
              onChange={handleDayChange}
              disabled={!selectedYear || !selectedMonth}
              className="mt-1.5 w-full border-0 bg-transparent p-0 text-[0.96rem] text-[#2d2d2d] outline-none"
            >
              <option value="">Semua Tanggal</option>
              {dayOptions.map((day) => (
                <option key={day} value={day}>
                  {day}
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
              onChange={handleKeywordChange}
              placeholder="Cari nama toko atau harga..."
              className="mt-1.5 w-full border-0 bg-transparent p-0 text-[0.96rem] text-[#2d2d2d] outline-none placeholder:text-[#c1c1c1]"
            />
          </div>
        </label>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="overflow-hidden rounded-[8px] bg-white shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
            <table className="w-full" aria-busy="true" aria-label="Memuat riwayat transaksi...">
              <thead>
                <tr className="border-b border-[#f2e4d7]">
                  {['Toko Supplier', 'Tanggal', 'Total Modal', 'Aksi'].map((col) => (
                    <th key={col} className="px-4 py-3.5 text-left text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#9f9485]">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f7f0ea]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonTableRow key={i} columns={4} />
                ))}
              </tbody>
            </table>
          </div>
        ) : fetchError ? (
          <div className="flex h-40 flex-col items-center justify-center rounded-[8px] bg-white px-5 text-center text-gray-500 shadow-sm">
            <p>Riwayat transaksi belum dapat dimuat. Silakan coba lagi nanti.</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center rounded-[8px] bg-white text-gray-500 shadow-sm">
            <p>Tidak ada riwayat transaksi yang ditemukan.</p>
          </div>
        ) : (
          <HistoryTable
            items={paginatedHistory}
            hasActiveFilters={hasActiveFilters}
            pagination={{
              currentPage: safeCurrentPage,
              totalPages,
              totalItems: totalFilteredItems,
              displayStart,
              displayEnd,
              onPageChange: setCurrentPage,
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default History;
