import { useEffect, useState } from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { apiUrl } from '../utils/api';
import Swal from 'sweetalert2';
// 🚨 Banknote ditambahkan di sini
import { Trash2, Plus, Edit, Save, X, Banknote } from 'lucide-react';
import {
  buildReceiptItemsPayload,
  calculateItemTotals,
  calculateReceiptSummary,
  createBlankReceiptItem,
  validateReceiptItem
} from '../utils/receiptItems';

// --- FUNGSI FORMATTING ---
const formatCurrency = (value) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return '-';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(numericValue);
};

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' });
};

const formatPercent = (value) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return '0%';
  return `${numericValue.toLocaleString('id-ID', { maximumFractionDigits: 2 })}%`;
};

const inputClassName = (isInvalid = false) =>
  `w-full rounded-[8px] border bg-white px-3 py-2.5 text-sm text-[#2d2d2d] outline-none transition focus:border-[#ea8327] focus:ring-1 focus:ring-[#ea8327] ${
    isInvalid ? 'border-[#f2a38f] bg-[#fff8f4]' : 'border-[#eadfd4]'
  }`;

// --- KOMPONEN HEADER UNTUK KARTU ---
const SectionHeader = ({ icon: Icon, title, description, action }) => (
  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
    <div className="flex min-w-0 items-start gap-2.5">
      {Icon ? (
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#ea8327]" aria-hidden="true" />
      ) : null}
      <div className="min-w-0">
        <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-[#8a561d]">{title}</h3>
        {description ? (
          <p className="mt-1 text-xs leading-5 text-[#8d8d8d]">{description}</p>
        ) : null}
      </div>
    </div>
    {action ? <div className="shrink-0">{action}</div> : null}
  </div>
);

// Membentuk data dari Backend ke format State Frontend
const mapDbItemsToState = (items) => {
  if (!Array.isArray(items)) return [];
  return items.map((item, index) => {
    const modal = Number(item.totalHargaItem || 0);
    const jual = Number(item.hargaJual || 0);
    const qty = Number(item.jumlahBarang || 1);
    
    return {
      id: item.id || `item-${Date.now()}-${index}`,
      itemName: String(item.namaBarang || ''),
      quantity: String(item.jumlahBarang || '1'),
      unitPrice: String(item.hargaSatuan || '0'),
      totalItemCost: String(item.totalHargaItem || '0'),
      marginPercent: item.profitMargin !== null ? String(item.profitMargin) : '',
      sellingPrice: String(item.hargaJual || '0'),
      // 🚨 KUNCI: Hitung otomatis saat mapping agar tidak kosong
      totalSellingPrice: jual * qty, 
      totalProfit: (jual * qty) - modal,
      isEdited: false
    };
  });
};

const DetailNotaPage = () => {
  const { notaId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const stateNota = location.state?.nota;
  
  const [fetchedNota, setFetchedNota] = useState(null);
  const [isLoading, setIsLoading] = useState(!stateNota);
  const [notFound, setNotFound] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ toko: '', tanggal: '' });
  
  const [receiptItems, setReceiptItems] = useState([]);

  const nota = fetchedNota || stateNota;
  const hasStateNota = Boolean(stateNota?.id && `${stateNota.id}` === `${notaId}`);

  useEffect(() => {
    const fetchNotaDetail = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(apiUrl(`/api/nota/${encodeURIComponent(notaId)}`), {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        if (res.ok) {
          const result = await res.json();
          setFetchedNota(result.data);
          setReceiptItems(mapDbItemsToState(result.data.items));
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (!hasStateNota) fetchNotaDetail();
    else setReceiptItems(mapDbItemsToState(stateNota.items));
  }, [notaId, navigate, stateNota, hasStateNota]);

  const handleStartEdit = () => {
    if (!nota) return;
    const dateObj = new Date(nota.tanggal || nota.createdAt);
    const dateString = !Number.isNaN(dateObj.getTime()) ? dateObj.toISOString().split('T')[0] : '';
    setFormData({ toko: nota.toko || '', tanggal: dateString });
    setReceiptItems(mapDbItemsToState(nota.items));
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (itemId, field, value) => {
    setReceiptItems((currentItems) =>
      currentItems.map((item) => item.id === itemId ? calculateItemTotals({ ...item, [field]: value, isEdited: true }, field) : item)
    );
  };

  const addManualItem = () => setReceiptItems((prev) => [...prev, createBlankReceiptItem({ date: formData.tanggal, quantity: '1', isEdited: true })]);
  const removeItem = (itemId) => setReceiptItems((prev) => prev.filter((item) => item.id !== itemId));

  const receiptSummary = calculateReceiptSummary(receiptItems);

  const handleSaveEdit = async () => {
    const invalidReceiptItems = receiptItems.filter((item) => !validateReceiptItem(item).isValid);
    if (invalidReceiptItems.length > 0) {
      Swal.fire({ icon: 'warning', title: 'Lengkapi Item', text: 'Periksa form yang kosong.', confirmButtonColor: '#ea8327' });
      return;
    }

    Swal.fire({ title: 'Menyimpan Perubahan...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    try {
      const token = localStorage.getItem('token');
      const payloadItems = buildReceiptItemsPayload(receiptItems);
      
      const res = await fetch(apiUrl(`/api/nota/${notaId}`), {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toko: formData.toko,
          tanggal: formData.tanggal,
          items: payloadItems 
        })
      });

      if (res.ok) {
        const result = await res.json();
        setFetchedNota(result.data); 
        setReceiptItems(mapDbItemsToState(result.data.items));
        setIsEditing(false); 
        Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Perubahan nota tersimpan.', confirmButtonColor: '#35c759' });
      } else {
        throw new Error('Gagal memperbarui');
      }
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Gagal terhubung ke server.' });
    }
  };

  const handleDeleteNota = async () => {
    const confirm = await Swal.fire({
      title: 'Hapus Nota?', text: "Data tidak dapat dikembalikan!", icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#d94835', cancelButtonColor: '#6d6258', confirmButtonText: 'Ya, Hapus!'
    });

    if (confirm.isConfirmed) {
      Swal.fire({ title: 'Menghapus...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      try {
        const res = await fetch(apiUrl(`/api/nota/${notaId}`), {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) Swal.fire({ icon: 'success', title: 'Terhapus!', confirmButtonColor: '#35c759' }).then(() => navigate('/history'));
      } catch {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Gagal menghapus nota.' });
      }
    }
  };

  const supplierName = isEditing ? formData.toko : (nota?.toko || 'Tidak Diketahui');
  const transactionDate = isEditing ? formatDate(formData.tanggal) : formatDate(nota?.tanggal || nota?.createdAt);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[1.9rem] font-semibold text-[#ea8327] sm:text-[2.3rem] lg:text-[2.8rem]">Detail Nota</h1>
          <p className="mt-2 text-[#2d2d2d]">{isEditing ? "Mode Edit Aktif. Ubah data lalu simpan." : "Ringkasan nota dan item hasil scan."}</p>
        </div>

        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Link to="/history" className="inline-flex items-center rounded-[8px] border border-[#f0d8c1] px-4 py-3 text-sm font-semibold text-[#b85f12] hover:bg-[#fff6ed]">Kembali</Link>
              <button onClick={handleStartEdit} className="inline-flex items-center gap-2 rounded-[8px] bg-[#ea8327] px-4 py-3 text-sm font-semibold text-white hover:bg-[#d57421]"><Edit className="h-4 w-4" /> Edit</button>
              <button onClick={handleDeleteNota} className="inline-flex items-center gap-2 rounded-[8px] bg-[#fff1f0] px-4 py-3 text-sm font-semibold text-[#d94835] hover:bg-[#ffe1dd]"><Trash2 className="h-4 w-4" /> Hapus</button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(false)} className="inline-flex items-center gap-2 rounded-[8px] bg-[#f1ede8] px-4 py-3 text-sm font-semibold text-[#6d6258] hover:bg-[#e6ddd2]"><X className="h-4 w-4" /> Batal</button>
              <button onClick={handleSaveEdit} className="inline-flex items-center gap-2 rounded-[8px] bg-[#35c759] px-4 py-3 text-sm font-semibold text-white hover:bg-[#2db44f]"><Save className="h-4 w-4" /> Simpan</button>
            </>
          )}
        </div>
      </div>

      <section className="mt-7 rounded-[8px] border border-[#f1ede8] bg-white p-5 shadow-sm sm:p-6">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-t-[#ea8327]"></div></div>
        ) : notFound || !nota ? (
          <div className="py-12 text-center"><h2 className="text-lg font-semibold text-[#2c2c2c]">Nota tidak ditemukan</h2></div>
        ) : (
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,2.5fr)] items-start">
            
            {/* Foto Nota */}
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#8a561d] self-start">Bukti Fisik</p>
              {nota.imageUrl ? (
                <div className="overflow-hidden rounded-[8px] border border-[#f0e5d8] bg-[#1a1a1a] shadow-sm w-full">
                  <img src={nota.imageUrl} alt="Nota" className="max-h-[500px] w-full object-contain" />
                </div>
              ) : (
                <div className="flex h-48 w-full items-center justify-center rounded-[8px] border border-dashed border-[#e8ddd2] bg-[#fcfaf7]">
                  <p className="text-sm font-medium text-[#8d8d8d]">Gambar tidak tersedia.</p>
                </div>
              )}
            </div>

            {/* Area Informasi & Tabel */}
            <div className="min-w-0 w-full overflow-hidden">
              
              {/* --- KARTU INFO UTAMA --- */}
              {!isEditing ? (
                <div className="grid gap-3 sm:grid-cols-2 mb-6">
                  <div className="rounded-[8px] border border-[#f0e5d8] bg-[#fffdf9] p-4">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#aaa19a]">Nama Toko Supplier</p>
                    <p className="mt-2 text-base font-semibold text-[#2c2c2c]">{supplierName}</p>
                  </div>
                  <div className="rounded-[8px] border border-[#f0e5d8] bg-[#fffdf9] p-4">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#aaa19a]">Tanggal</p>
                    <p className="mt-2 text-base font-semibold text-[#2c2c2c]">{transactionDate}</p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 mb-6">
                  <label className="block">
                    <span className="mb-1.5 flex text-xs font-semibold text-[#6d6258]">Nama Toko Supplier</span>
                    <input type="text" name="toko" value={formData.toko} onChange={handleChange} className={inputClassName()} />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 flex text-xs font-semibold text-[#6d6258]">Tanggal</span>
                    <input type="date" name="tanggal" value={formData.tanggal} onChange={handleChange} className={inputClassName()} />
                  </label>
                </div>
              )}

              {/* --- TABEL BARANG --- */}
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-[#8a561d]">Daftar Barang</h2>
                {isEditing && (
                  <button onClick={addManualItem} className="inline-flex items-center gap-2 rounded-[8px] bg-[#ea8327] px-3 py-2 text-xs font-semibold text-white hover:bg-[#d57421]">
                    <Plus className="h-3 w-3" /> Tambah Item
                  </button>
                )}
              </div>

              <div className="overflow-x-auto rounded-[8px] border border-[#f4f0ea]">
                <table className="w-full min-w-[800px] border-collapse text-left text-sm text-[#2c2c2c]">
                  <thead className="bg-[#f7f7f7] text-[0.74rem] font-semibold uppercase tracking-[0.12em] text-[#909090]">
                    <tr>
                      <th className="px-4 py-3 border-b border-[#f4f0ea]">Nama Barang</th>
                      <th className="px-4 py-3 border-b border-[#f4f0ea]">Jumlah</th>
                      <th className="px-4 py-3 border-b border-[#f4f0ea]">Harga Satuan</th>
                      <th className="px-4 py-3 border-b border-[#f4f0ea]">Total Modal</th>
                      <th className="px-4 py-3 border-b border-[#f4f0ea]">Margin</th>
                      <th className="px-4 py-3 border-b border-[#f4f0ea]">Harga Jual</th>
                      {isEditing && <th className="px-4 py-3 border-b border-[#f4f0ea] text-center">Aksi</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {receiptItems.map((item) => (
                      <tr key={item.id} className="border-t border-[#f4f0ea] hover:bg-[#fafafa]">
                        {isEditing ? (
                          <>
                            <td className="px-2 py-3"><input type="text" value={item.itemName} onChange={(e) => handleItemChange(item.id, 'itemName', e.target.value)} className={inputClassName()} /></td>
                            <td className="px-2 py-3 w-20"><input type="number" min="1" value={item.quantity} onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)} className={inputClassName()} /></td>
                            <td className="px-2 py-3 w-32"><input type="number" min="0" value={item.unitPrice} onChange={(e) => handleItemChange(item.id, 'unitPrice', e.target.value)} className={inputClassName()} /></td>
                            <td className="px-2 py-3 w-32"><input type="number" min="0" value={item.totalItemCost} onChange={(e) => handleItemChange(item.id, 'totalItemCost', e.target.value)} className={inputClassName()} /></td>
                            <td className="px-2 py-3 w-24"><input type="number" value={item.marginPercent} onChange={(e) => handleItemChange(item.id, 'marginPercent', e.target.value)} className={inputClassName()} /></td>
                            <td className="px-2 py-3 w-32"><input type="number" min="0" value={item.sellingPrice} onChange={(e) => handleItemChange(item.id, 'sellingPrice', e.target.value)} className={inputClassName()} /></td>
                            <td className="px-2 py-3 text-center w-16">
                              <button onClick={() => removeItem(item.id)} className="inline-flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#fff1f0] text-[#d94835] hover:bg-[#ffe1dd]"><Trash2 className="h-4 w-4" /></button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-4 py-3.5 font-semibold">{item.itemName}</td>
                            <td className="px-4 py-3.5">{item.quantity}</td>
                            <td className="px-4 py-3.5">{formatCurrency(item.unitPrice)}</td>
                            <td className="px-4 py-3.5">{formatCurrency(item.totalItemCost)}</td>
                            <td className="px-4 py-3.5">{item.marginPercent ? formatPercent(item.marginPercent) : '-'}</td>
                            <td className="px-4 py-3.5 text-[#249a43] font-semibold">{item.sellingPrice ? formatCurrency(item.sellingPrice) : '-'}</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 🚨 KARTU RINGKASAN TRANSAKSI */}
              <div className="mt-8 rounded-[10px] border border-[#f0e2d5] bg-white p-4">
                <SectionHeader
                  icon={Banknote}
                  title="Ringkasan Transaksi"
                  description="Ringkasan dihitung otomatis dari item yang sudah diisi."
                />
                
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-[8px] border border-[#f0e2d5] bg-white p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#a99a8a]">Total Modal</p>
                    <p className="mt-1 text-base font-bold text-[#2d2d2d]">{receiptSummary.hasTotalModal ? formatCurrency(receiptSummary.totalModal) : 'Rp 0'}</p>
                  </div>
                  <div className="rounded-[8px] border border-[#f0e2d5] bg-white p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#a99a8a]">Total Harga Jual</p>
                    <p className="mt-1 text-base font-bold text-[#2d2d2d]">{receiptSummary.hasTotalHargaJual ? formatCurrency(receiptSummary.totalHargaJual) : 'Rp 0'}</p>
                  </div>
                  <div className="rounded-[8px] border border-[#f0e2d5] bg-white p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#a99a8a]">Total Profit</p>
                    <p className="mt-1 text-base font-bold text-[#249a43]">{receiptSummary.hasTotalProfit ? formatCurrency(receiptSummary.totalProfit) : 'Rp 0'}</p>
                  </div>
                  <div className="rounded-[8px] border border-[#f0e2d5] bg-white p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#a99a8a]">Rata-rata Margin</p>
                    <p className="mt-1 text-base font-bold text-[#2d2d2d]">{formatPercent(receiptSummary.averageMargin)}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
};

export default DetailNotaPage;