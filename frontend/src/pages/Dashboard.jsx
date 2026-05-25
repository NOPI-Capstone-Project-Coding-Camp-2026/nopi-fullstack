import { useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { BookmarkIcon, CalendarIcon, ChartIcon, PlusIcon } from '../components/ui/AppIcons';
import { AuthContext } from '../context/AuthContext';
import { apiUrl } from '../utils/api';
import { getBusinessProfile } from '../utils/businessProfile';

const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(number);
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
  }).formatToParts(date);

  return parts.reduce((dateParts, part) => {
    if (part.type === 'year' || part.type === 'month') {
      return { ...dateParts, [part.type]: Number(part.value) };
    }

    return dateParts;
  }, {});
};

const getMonthKey = (dateParts) => {
  if (!dateParts?.year || !dateParts?.month) {
    return '';
  }

  return `${dateParts.year}-${String(dateParts.month).padStart(2, '0')}`;
};

const getMonthLabel = (dateParts) => {
  if (!dateParts?.year || !dateParts?.month) {
    return '';
  }

  return new Date(dateParts.year, dateParts.month - 1, 1).toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });
};

const getDefaultTotalModalMonth = (items) => {
  if (items.length === 0) {
    return '';
  }

  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  if (items.some((item) => item.monthKey === currentMonthKey)) {
    return currentMonthKey;
  }

  const sortedMonthKeys = [...new Set(items.map((item) => item.monthKey).filter(Boolean))].sort((a, b) =>
    b.localeCompare(a),
  );

  return sortedMonthKeys[0] || '';
};

const Dashboard = () => {
  const { user, isProfileComplete } = useContext(AuthContext);
  const { displayBusinessName, businessCategory, businessAddress } = getBusinessProfile(user);
  
  // State untuk menyimpan data asli dari database
  const [historyItems, setHistoryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTotalModalMonth, setSelectedTotalModalMonth] = useState('');

  // Mengambil data dari Backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(apiUrl('/api/nota/history'), {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const result = await res.json();
        
        if (res.ok) {
          const historyData = Array.isArray(result.data) ? result.data : [];
          const formattedData = historyData.map(nota => {
            const dateObj = getValidDate(nota.tanggal) || getValidDate(nota.createdAt);
            const dateParts = dateObj ? getIndonesiaDateParts(dateObj) : null;
            const rawCost = parseCurrencyValue(nota.totalHarga ?? nota.cost);
            
            return {
              id: nota.id ?? nota._id,
              merchant: nota.toko || nota.merchant || 'Tidak Diketahui',
              cost: formatRupiah(rawCost),
              costRaw: rawCost,
              dateLabel: dateObj
                ? dateObj.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    timeZone: 'Asia/Jakarta',
                  })
                : '-',
              timeLabel: dateObj
                ? dateObj.toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'Asia/Jakarta',
                  })
                : '',
              monthKey: getMonthKey(dateParts),
              monthLabel: getMonthLabel(dateParts),
            };
          });
          
          setHistoryItems(formattedData);
          setSelectedTotalModalMonth((currentValue) => currentValue || getDefaultTotalModalMonth(formattedData));
        }
      } catch {
        // Dashboard tetap menampilkan state kosong yang aman jika data belum bisa dimuat.
      } finally {
        setIsLoading(false);
      }
    };

    if (isProfileComplete) {
      fetchDashboardData();
    }
  }, [isProfileComplete]);

  const totalModalMonthOptions = useMemo(() => {
    const monthMap = new Map();

    historyItems.forEach((item) => {
      if (item.monthKey && item.monthLabel) {
        monthMap.set(item.monthKey, item.monthLabel);
      }
    });

    const monthOptions = [...monthMap.entries()]
      .sort(([monthKeyA], [monthKeyB]) => monthKeyB.localeCompare(monthKeyA))
      .map(([value, label]) => ({ value, label }));

    return [{ value: '', label: 'Semua Bulan' }, ...monthOptions];
  }, [historyItems]);

  const { totalCapital, processedReceipts, activeMonthLabel } = useMemo(() => {
    const selectedItems = selectedTotalModalMonth
      ? historyItems.filter((item) => item.monthKey === selectedTotalModalMonth)
      : historyItems;
    const selectedOption = totalModalMonthOptions.find((option) => option.value === selectedTotalModalMonth);

    return {
      totalCapital: selectedItems.reduce((sum, item) => sum + item.costRaw, 0),
      processedReceipts: selectedItems.length,
      activeMonthLabel: selectedOption?.label?.toLowerCase() || 'semua bulan'
    };
  }, [historyItems, selectedTotalModalMonth, totalModalMonthOptions]);

  // Ambil 5 transaksi terbaru untuk preview
  const recentItems = useMemo(() => historyItems.slice(0, 5), [historyItems]);
  
  const primaryActionPath = isProfileComplete ? '/upload' : '/profile';
  const historyPath = isProfileComplete ? '/history' : '/profile';
  const isDashboardLoading = isProfileComplete && isLoading;

  return (
    <DashboardLayout>
      <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-[1.7rem] font-semibold leading-[1.08] tracking-[-0.05em] text-[#ea8327] sm:text-[2.2rem] lg:text-[2.8rem]">
            Selamat datang kembali, {displayBusinessName}
          </h1>
          <p className="mt-2.5 max-w-2xl text-[0.92rem] leading-6 text-[#2d2d2d] sm:text-[0.98rem] lg:text-[1.02rem]">
            Inilah ringkasan keuangan bisnis Anda untuk {activeMonthLabel}.
          </p>
          <p className="mt-2 text-[0.82rem] text-[#8d8d8d] sm:text-[0.88rem]">
            {businessCategory ? `${businessCategory}` : 'Profil bisnis Anda akan tampil di sini'}
            {businessAddress ? ` • ${businessAddress}` : ''}
          </p>
        </div>

        <Link
          to={primaryActionPath}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-[8px] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(53,199,89,0.18)] transition sm:w-auto sm:px-6 sm:text-[0.96rem] ${
            isProfileComplete ? 'bg-[#35c759] hover:bg-[#2db44f]' : 'bg-[#ea8327] hover:bg-[#d96f0a]'
          }`}
        >
          <PlusIcon className="h-4 w-4" />
          {isProfileComplete ? 'Tambah Nota' : 'Isi Profil Sekarang'}
        </Link>
      </section>

      {!isProfileComplete ? (
        <section className="mt-5 rounded-[8px] border border-[#f2e4d7] bg-[#fff7ee] px-5 py-4 shadow-[0_10px_20px_rgba(234,131,39,0.08)]">
          <p className="text-sm font-semibold text-[#8a561d]">Akses fitur lanjutan masih dikunci sementara.</p>
          <p className="mt-1.5 text-[0.92rem] leading-6 text-[#7a5a39]">
            Lengkapi profil bisnis Anda terlebih dahulu agar upload nota, history, dan fitur lainnya aktif normal.
          </p>
        </section>
      ) : null}

      <section className="mt-6 grid gap-4 lg:mt-7 xl:grid-cols-[1.55fr_0.85fr]">
        <div className="rounded-[8px] bg-white p-5 shadow-[0_14px_30px_rgba(15,23,42,0.07)] sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <ChartIcon className="h-5 w-5 text-[#d96f0a] sm:h-6 sm:w-6" />
            <label className="flex min-w-0 items-center gap-3 rounded-[8px] border border-[#f0e5d8] bg-[#fffdf9] px-4 py-3 sm:min-w-[230px]">
              <CalendarIcon className="h-5 w-5 shrink-0 text-[#909090]" />
              <div className="min-w-0 flex-1">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#b0b0b0]">
                  Periode modal
                </p>
                <select
                  value={selectedTotalModalMonth}
                  onChange={(event) => setSelectedTotalModalMonth(event.target.value)}
                  className="mt-1.5 w-full border-0 bg-transparent p-0 text-[0.92rem] text-[#2d2d2d] outline-none"
                >
                  {totalModalMonthOptions.map((option) => (
                    <option key={option.value || 'all'} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </label>
          </div>

          <p className="mt-5 text-[0.8rem] uppercase tracking-[0.12em] text-[#8d8d8d] sm:text-[0.88rem]">
            Total Modal
          </p>
          <div className="mt-2 text-[2rem] font-semibold tracking-[-0.06em] text-[#3b9b52] sm:text-[2.8rem]">
            {isDashboardLoading ? "Menghitung..." : formatRupiah(totalCapital)}
          </div>
          <p className="mt-3 text-[0.88rem] leading-6 text-[#8d8d8d] sm:text-[0.94rem]">
            Total modal dihitung dari penjumlahan seluruh harga beli pada periode yang dipilih.
          </p>
        </div>

        <div className="rounded-[8px] bg-white p-5 shadow-[0_14px_30px_rgba(15,23,42,0.07)] sm:p-6">
          <BookmarkIcon className="h-5 w-5 text-[#d96f0a] sm:h-6 sm:w-6" />
          <p className="mt-5 text-[0.78rem] uppercase tracking-[0.14em] text-[#8d8d8d] sm:text-[0.86rem]">
              Nota Terproses
          </p>
          <div className="mt-2 text-[1.9rem] font-semibold tracking-[-0.04em] text-[#222] sm:text-[2.5rem]">
            {isDashboardLoading ? "..." : processedReceipts}
          </div>
          <p className="mt-3 max-w-[18rem] text-[0.88rem] leading-6 text-[#8d8d8d] sm:text-[0.94rem]">
            Jumlah nota yang tercatat pada periode terpilih akan tampil di sini.
          </p>
        </div>
      </section>

      <section className="mt-8 xl:mt-9">
        <div>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-[1.45rem] font-semibold tracking-[-0.05em] text-[#ea8327] sm:text-[1.8rem]">
              Aktivitas Riwayat
            </h2>
            <Link
              to={historyPath}
              className={`text-sm font-semibold sm:text-[0.95rem] ${
                isProfileComplete ? 'text-[#262626]' : 'text-[#c07f47]'
              }`}
            >
              {isProfileComplete ? 'Lihat Semua Riwayat' : 'Lengkapi Profil untuk Membuka Riwayat'}
            </Link>
          </div>

          <div className="rounded-[8px] bg-white shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
            {isDashboardLoading ? (
               <div className="px-5 py-8 text-center sm:px-6 sm:py-9 text-[#8d8d8d]">Memuat aktivitas...</div>
            ) : recentItems.length === 0 ? (
              <div className="px-5 py-8 sm:px-6 sm:py-9">
                <p className="text-[0.92rem] leading-6 text-[#8d8d8d] sm:text-[0.96rem]">
                  Belum ada riwayat transaksi. Mulai dengan upload nota pertama Anda.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#f4f0ea]">
                {recentItems.map((item) => (
                  <div
                    key={item.id}
                    className="grid gap-3 px-5 py-4 text-[0.92rem] text-[#2c2c2c] sm:grid-cols-[1.2fr_0.8fr_0.7fr] sm:px-6"
                  >
                    <div>
                      <p className="font-semibold">{item.merchant}</p>
                      <p className="mt-1 text-[0.82rem] text-[#909090]">
                        {item.dateLabel} • {item.timeLabel}
                      </p>
                    </div>
                    <div>
                      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#b0b0b0]">
                        Harga Beli
                      </p>
                      <p className="mt-1 font-medium">{item.cost}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default Dashboard;
