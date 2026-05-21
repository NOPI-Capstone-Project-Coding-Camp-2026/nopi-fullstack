import { useMemo, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import DashboardLayout from '../components/layout/DashboardLayout';
import EditNotaModal from '../components/history/EditNotaModal';
import HistoryTable from '../components/history/HistoryTable';
import { CalendarIcon, SearchIcon } from '../components/ui/AppIcons';
import { apiUrl } from '../utils/api';

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

const formatCurrency = (value) => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return '-';
  }

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(numericValue);
};

const parseCurrencyValue = (value) => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  if (value === null || value === undefined) {
    return 0;
  }

  const compactValue = `${value}`.trim().replace(/[^\d,.-]/g, '');

  if (!compactValue) {
    return 0;
  }

  const lastComma = compactValue.lastIndexOf(',');
  const lastDot = compactValue.lastIndexOf('.');
  let normalizedValue = compactValue;

  if (lastComma > -1 && lastDot > -1) {
    normalizedValue =
      lastComma > lastDot
        ? compactValue.replace(/\./g, '').replace(',', '.')
        : compactValue.replace(/,/g, '');
  } else if (lastComma > -1) {
    const digitsAfterComma = compactValue.length - lastComma - 1;
    normalizedValue =
      digitsAfterComma === 3
        ? compactValue.replace(/,/g, '')
        : compactValue.replace(',', '.');
  } else if (lastDot > -1) {
    const dotParts = compactValue.split('.');
    const digitsAfterDot = compactValue.length - lastDot - 1;
    normalizedValue =
      dotParts.length > 2 || digitsAfterDot === 3
        ? compactValue.replace(/\./g, '')
        : compactValue;
  }

  const parsedValue = Number(normalizedValue);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

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

const getNotaItemId = (nota) => nota?.id ?? nota?._id ?? nota?.rawNota?.id ?? nota?.rawNota?._id;

const formatHistoryItem = (nota) => {
  const dateObj = getValidDate(nota.tanggal) || getValidDate(nota.createdAt);
  const dateParts = dateObj ? getIndonesiaDateParts(dateObj) : null;
  const rawCost = parseCurrencyValue(nota.totalHarga ?? nota.cost ?? 0);

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
  // STATE BARU: Untuk menyimpan data asli dari database
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [keyword, setKeyword] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [fetchError, setFetchError] = useState(false);
  const [selectedNota, setSelectedNota] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSavingNota, setIsSavingNota] = useState(false);

  // AMBIL DATA DARI BACKEND SAAT HALAMAN DIBUKA
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setFetchError(false);
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

  const handleEditNota = (nota) => {
    setSelectedNota(nota);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedNota(null);
  };

  const handleEditSaveAttempt = async (updatedNota) => {
    if (!updatedNota.id) {
      await Swal.fire({
        icon: 'error',
        title: 'Nota Tidak Valid',
        text: 'ID nota tidak ditemukan.',
        confirmButtonColor: '#ea8327',
      });
      throw new Error('ID nota tidak ditemukan.');
    }

    setIsSavingNota(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(apiUrl(`/api/nota/${encodeURIComponent(updatedNota.id)}`), {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toko: updatedNota.toko,
          tanggal: updatedNota.tanggal,
          totalHarga: updatedNota.totalHarga,
        }),
      });
      let result = {};

      try {
        result = await res.json();
      } catch {
        result = {};
      }

      if (!res.ok) {
        throw new Error(result.message || 'Nota gagal diperbarui.');
      }

      const formattedNota = formatHistoryItem(result.data);
      setHistoryData((currentData) =>
        currentData.map((item) =>
          String(getNotaItemId(item)) === String(updatedNota.id) ? formattedNota : item,
        ),
      );

      await Swal.fire({
        icon: 'success',
        title: 'Nota Diperbarui',
        text: 'Perubahan berhasil disimpan ke database.',
        confirmButtonColor: '#35c759',
      });
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Gagal Menyimpan',
        text: error.message || 'Perubahan nota belum berhasil disimpan.',
        confirmButtonColor: '#ea8327',
      });
      throw error;
    } finally {
      setIsSavingNota(false);
    }
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
  const selectedNotaId =
    selectedNota?.id || selectedNota?._id || selectedNota?.rawNota?.id || selectedNota?.rawNota?._id || 'edit-nota';

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
        {/* DROPDOWN TAHUN */}
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

        {/* DROPDOWN BULAN */}
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

        {/* DROPDOWN TANGGAL */}
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

        {/* INPUT PENCARIAN */}
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
          <div className="flex h-40 items-center justify-center rounded-[8px] bg-white shadow-sm">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#ea8327]"></div>
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
            onEditNota={handleEditNota}
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

      {isEditModalOpen ? (
        <EditNotaModal
          key={selectedNotaId}
          isOpen={isEditModalOpen}
          nota={selectedNota}
          onClose={handleCloseEditModal}
          onSaveAttempt={handleEditSaveAttempt}
          isSaving={isSavingNota}
        />
      ) : null}
    </DashboardLayout>
  );
};

export default History;
