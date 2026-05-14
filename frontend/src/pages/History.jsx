import { useMemo, useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import HistoryTable from '../components/history/HistoryTable';
import { CalendarIcon, SearchIcon } from '../components/ui/AppIcons';
// Kita tidak pakai normalizedHistoryItems lagi, tapi getMonthOptions mungkin masih bisa dipakai jika bentuknya umum
// import { getMonthOptions } from '../data/transactions'; 

const merchantTypes = [
  { value: 'all', label: 'Semua Merchant' },
  { value: 'warung', label: 'Warung' },
  { value: 'restoran', label: 'Restoran' },
  { value: 'retail', label: 'Retail' },
  { value: 'lainnya', label: 'Lainnya' },
];

const History = () => {
  // STATE BARU: Untuk menyimpan data asli dari database
  const [historyItems, setHistoryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [keyword, setKeyword] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [merchantType, setMerchantType] = useState('all');

  // AMBIL DATA DARI BACKEND SAAT HALAMAN DIBUKA
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/nota/history', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const result = await res.json();
        
        if (res.ok) {
          // Format data dari DB agar cocok dengan struktur tabelmu
          const formattedData = result.data.map(nota => {
            const dateObj = new Date(nota.tanggal);
            const monthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`; // Hasil: "2026-05"
            
            return {
              id: nota.id,
              merchant: nota.toko, // Database pakai 'toko', tabelmu butuh 'merchant'
              cost: nota.totalHarga.toString(),
              sellPrice: "0", // Bisa diisi perhitungan laba nantinya
              date: dateObj.toLocaleDateString('id-ID'), // Format tanggal lokal
              monthKey: monthKey,
              type: 'lainnya', // Default, karena di DB kita belum simpan kategori toko
              imageUrl: nota.imageUrl,
              rawItem: nota
            };
          });
          
          setHistoryItems(formattedData);
        }
      } catch (error) {
        console.error("Gagal menarik data riwayat:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // BUAT OPSI BULAN SECARA OTOMATIS BERDASARKAN DATA YANG ADA
  const monthOptions = useMemo(() => {
    const uniqueMonths = [...new Set(historyItems.map(item => item.monthKey))];
    // Urutkan dari yang terbaru
    uniqueMonths.sort((a, b) => b.localeCompare(a)); 
    
    const options = uniqueMonths.map(month => {
      const [year, m] = month.split('-');
      const date = new Date(year, parseInt(m) - 1);
      const monthName = date.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
      return { value: month, label: monthName };
    });

    // Tambahkan opsi "Semua Waktu" di awal
    return [{ value: '', label: 'Semua Waktu' }, ...options];
  }, [historyItems]);

  // Set default bulan pertama kali loading
  useEffect(() => {
    if (monthOptions.length > 1 && !selectedMonth) {
      // Bebas, mau default ke bulan terbaru, atau 'Semua Waktu' (value: '')
      setSelectedMonth(''); 
    }
  }, [monthOptions, selectedMonth]);


  // FILTERING LOGIC
  const filteredItems = useMemo(() => {
    return historyItems.filter((item) => {
      const matchesKeyword =
        keyword.trim() === '' ||
        item.merchant?.toLowerCase().includes(keyword.toLowerCase()) ||
        item.cost?.toLowerCase().includes(keyword.toLowerCase());

      const matchesMonth = !selectedMonth || item.monthKey === selectedMonth;
      const matchesMerchantType = merchantType === 'all' || item.type === merchantType;

      return matchesKeyword && matchesMonth && matchesMerchantType;
    });
  }, [keyword, merchantType, selectedMonth, historyItems]);

  const hasActiveFilters = keyword.trim() !== '' || selectedMonth !== '' || merchantType !== 'all';

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
        {/* DROPDOWN BULAN */}
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

        {/* INPUT PENCARIAN */}
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

        {/* DROPDOWN KATEGORI */}
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
        {isLoading ? (
          <div className="flex h-40 items-center justify-center rounded-[8px] bg-white shadow-sm">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#ea8327]"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center rounded-[8px] bg-white text-gray-500 shadow-sm">
            <p>Tidak ada riwayat transaksi yang ditemukan.</p>
          </div>
        ) : (
          <HistoryTable items={filteredItems} hasActiveFilters={hasActiveFilters} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default History;