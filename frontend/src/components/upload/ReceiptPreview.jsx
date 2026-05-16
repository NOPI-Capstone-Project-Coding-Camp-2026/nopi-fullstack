import { useState } from 'react';
import {
  Banknote,
  Calendar,
  CheckCircle2,
  Plus,
  Save,
  Scan,
  Store,
  Trash2,
} from 'lucide-react';
import { apiUrl } from '../../utils/api';
import {
  buildReceiptItemsPayload,
  calculateItemTotals,
  calculateReceiptSummary,
  createBlankReceiptItem,
  hasReceiptItemContent,
  normalizeExtractedItems,
  receiptItemHasValue,
  validateReceiptItem,
} from '../../utils/receiptItems';
import Swal from 'sweetalert2';

const formatCurrency = (value, fallback = 'Belum diisi') => {
  if (!receiptItemHasValue(value)) {
    return fallback;
  }

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value));
};

const formatPercent = (value) => {
  if (!receiptItemHasValue(value)) {
    return 'Belum diisi';
  }

  return `${Number(value).toLocaleString('id-ID', {
    maximumFractionDigits: 2,
  })}%`;
};

const inputClassName = (isInvalid = false) =>
  `w-full rounded-[8px] border bg-white px-3 py-2.5 text-sm text-[#2d2d2d] outline-none transition placeholder:text-[#b8b0a7] focus:border-[#ea8327] focus:ring-1 focus:ring-[#ea8327] ${
    isInvalid ? 'border-[#f2a38f] bg-[#fff8f4]' : 'border-[#eadfd4]'
  }`;

const subsectionTitleClassName = 'text-sm font-bold uppercase tracking-[0.12em] text-[#8a561d]';

const hasValue = (value) => value !== null && value !== undefined && `${value}`.trim() !== '';

const getFirstValue = (source, keys) => {
  if (!source || typeof source !== 'object') {
    return '';
  }

  for (const key of keys) {
    if (hasValue(source[key])) {
      return source[key];
    }
  }

  return '';
};

const getNestedAiContent = (scanData) => {
  if (!scanData || typeof scanData !== 'object') {
    return {};
  }

  return scanData.data || scanData.result || scanData.receipt || scanData.nota || scanData;
};

const normalizeNumberText = (value) => {
  if (!hasValue(value)) {
    return '';
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? `${value}` : '';
  }

  const compactValue = `${value}`.trim().replace(/[^\d,.-]/g, '');

  if (!compactValue) {
    return '';
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

  const numericValue = Number(normalizedValue);

  if (!Number.isFinite(numericValue)) {
    return '';
  }

  return Number.isInteger(numericValue)
    ? `${numericValue}`
    : `${Number(numericValue.toFixed(2))}`;
};

const EditableLabel = ({ children, className = '' }) => (
  <span className={`mb-1.5 flex min-h-[18px] items-center gap-1.5 text-xs font-semibold text-[#6d6258] ${className}`}>
    {children}
  </span>
);

const EditableColumnLabel = ({ children }) => (
  <span>{children}</span>
);

const MoneyLabel = ({ children }) => (
  <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#6d6258]">
    <Banknote className="h-3.5 w-3.5 text-[#249a43]" aria-hidden="true" />
    {children}
  </span>
);

const SectionHeader = ({ icon: Icon, title, description, action }) => (
  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
    <div className="flex min-w-0 items-start gap-2.5">
      {Icon ? (
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#ea8327]" aria-hidden="true" />
      ) : null}
      <div className="min-w-0">
        <h3 className={subsectionTitleClassName}>{title}</h3>
        {description ? (
          <p className="mt-1 text-xs leading-5 text-[#8d8d8d]">{description}</p>
        ) : null}
      </div>
    </div>
    {action ? <div className="shrink-0">{action}</div> : null}
  </div>
);

const buildScanPreviewState = (scanData) => {
  if (!scanData) {
    return {
      formData: { toko: '', tanggal: '', totalHarga: '' },
      receiptItems: [],
    };
  }

  let extractedToko = '';
  let extractedTanggal = '';
  let extractedTotal = '';
  const aiContent = getNestedAiContent(scanData);
  const nestedReceipt = aiContent.receipt || aiContent.nota || aiContent.result || {};
  const receiptItems = normalizeExtractedItems(scanData);
  const itemSummary = calculateReceiptSummary(receiptItems);

  extractedToko = getFirstValue(aiContent, [
    'nama_toko',
    'namaToko',
    'nama_supplier',
    'namaSupplier',
    'supplier',
    'vendor',
    'merchant',
    'merchant_name',
    'merchantName',
    'store',
    'store_name',
    'storeName',
    'toko',
    'outlet',
  ]) || getFirstValue(nestedReceipt, [
    'nama_toko',
    'namaToko',
    'supplier',
    'vendor',
    'merchant',
    'store_name',
    'storeName',
    'toko',
  ]);
  extractedTanggal = getFirstValue(aiContent, [
    'tanggal',
    'tgl',
    'date',
    'transaction_date',
    'transactionDate',
    'receipt_date',
    'receiptDate',
  ]) || getFirstValue(nestedReceipt, [
    'tanggal',
    'tgl',
    'date',
    'transaction_date',
    'transactionDate',
  ]);
  extractedTotal = getFirstValue(aiContent, [
    'total_harga',
    'totalHarga',
    'total_transaksi',
    'totalTransaksi',
    'grand_total',
    'grandTotal',
    'total_amount',
    'totalAmount',
    'total',
    'amount',
    'subtotal',
  ]) || getFirstValue(nestedReceipt, [
    'total_harga',
    'totalHarga',
    'total_transaksi',
    'grand_total',
    'grandTotal',
    'total',
  ]);

  if ((!extractedToko || !extractedTanggal || !extractedTotal) && aiContent.raw_text) {
    const text = aiContent.raw_text;
    const dateMatch = text.match(/TANGGAL\s*:\s*(\d{4}-\d{2}-\d{2})/i);
    const totalMatch = text.match(/TOTAL\s*[;:]\s*Rp\s*([\d,.]+)/i);
    const tokoMatch = text.match(/KIOS\s+[A-Z\s]+/i);

    if (!extractedTanggal && dateMatch) extractedTanggal = dateMatch[1];
    if (!extractedTotal && totalMatch) extractedTotal = totalMatch[1];
    if (!extractedToko && tokoMatch) extractedToko = tokoMatch[0].split(',')[0].trim();
  }

  const fallbackTotal = itemSummary.hasTotalModal ? itemSummary.totalModal : '';

  return {
    formData: {
      toko: extractedToko,
      tanggal: extractedTanggal,
      totalHarga: normalizeNumberText(extractedTotal || fallbackTotal),
    },
    receiptItems,
  };
};

const ReceiptItemFields = ({ item, validation, onChange }) => (
  <>
    <label className="block">
      <EditableLabel>Nama Barang</EditableLabel>
      <input
        type="text"
        value={item.itemName}
        onChange={(event) => onChange(item.id, 'itemName', event.target.value)}
        placeholder="Belum diisi"
        className={inputClassName(validation.errors.itemName)}
      />
    </label>
    <label className="block">
      <EditableLabel>Jumlah Barang</EditableLabel>
      <input
        type="number"
        min="1"
        value={item.quantity}
        onChange={(event) => onChange(item.id, 'quantity', event.target.value)}
        placeholder="Belum diisi"
        className={inputClassName(validation.errors.quantity)}
      />
    </label>
    <label className="block">
      <EditableLabel>Harga Satuan</EditableLabel>
      <input
        type="number"
        min="0"
        value={item.unitPrice}
        onChange={(event) => onChange(item.id, 'unitPrice', event.target.value)}
        placeholder="Belum diisi"
        className={inputClassName(validation.errors.unitPrice)}
      />
    </label>
    <label className="block">
      <EditableLabel>Total Harga Item</EditableLabel>
      <input
        type="number"
        min="0"
        value={item.totalItemCost}
        onChange={(event) => onChange(item.id, 'totalItemCost', event.target.value)}
        placeholder="Belum diisi"
        className={inputClassName(validation.errors.totalItemCost)}
      />
    </label>
    <label className="block">
      <EditableLabel>Profit Margin (%)</EditableLabel>
      <input
        type="number"
        value={item.marginPercent}
        onChange={(event) => onChange(item.id, 'marginPercent', event.target.value)}
        placeholder="Belum diisi"
        className={inputClassName()}
      />
    </label>
    <label className="block">
      <EditableLabel>Harga Jual</EditableLabel>
      <input
        type="number"
        min="0"
        value={item.sellingPrice}
        onChange={(event) => onChange(item.id, 'sellingPrice', event.target.value)}
        placeholder="Belum diisi"
        className={inputClassName(validation.errors.sellingPrice)}
      />
    </label>
  </>
);

const ReceiptPreview = ({ file, previewUrl, isScanning, onScan, onClear, scanData }) => {
  const initialScanState = buildScanPreviewState(scanData);
  const [appliedScanData, setAppliedScanData] = useState(scanData);
  const [formData, setFormData] = useState(initialScanState.formData);
  const [receiptItems, setReceiptItems] = useState(initialScanState.receiptItems);

  if (scanData !== appliedScanData) {
    const nextScanState = buildScanPreviewState(scanData);
    setAppliedScanData(scanData);
    setFormData(nextScanState.formData);
    setReceiptItems(nextScanState.receiptItems);
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (itemId, field, value) => {
    setReceiptItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId
          ? calculateItemTotals({ ...item, [field]: value, isEdited: true }, field)
          : item,
      ),
    );
  };

  const addManualItem = () => {
    setReceiptItems((currentItems) => [
      ...currentItems,
      createBlankReceiptItem({ date: formData.tanggal, quantity: '1', isEdited: true }),
    ]);
  };

  const removeItem = (itemId) => {
    setReceiptItems((currentItems) => currentItems.filter((item) => item.id !== itemId));
  };

  const receiptSummary = calculateReceiptSummary(receiptItems);
  const invalidReceiptItems = receiptItems.filter((item) => {
    const validation = validateReceiptItem(item);
    return !validation.isValid;
  });

  const handleSaveToDatabase = async () => {
    if (invalidReceiptItems.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Lengkapi Item',
        text: 'Periksa item yang ditandai sebelum menyimpan final.',
        confirmButtonColor: '#ea8327',
      });
      return;
    }

    Swal.fire({
      title: 'Menyimpan Nota...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      formDataToSend.append('toko', formData.toko);
      formDataToSend.append('tanggal', formData.tanggal);
      formDataToSend.append('totalHarga', formData.totalHarga);
      
      if (file) {
        formDataToSend.append('image', file);
      }

      const receiptItemsPayload = buildReceiptItemsPayload(receiptItems);
      // TODO: Kirim receiptItemsPayload ke endpoint NotaItem saat backend sudah mendukung item detail.
      console.log('Draft payload item nota:', receiptItemsPayload);

      const res = await fetch(apiUrl('/api/nota/save'), {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const result = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Nota Tersimpan!',
          text: 'Data dan gambar berhasil diamankan di database.',
          confirmButtonColor: '#35c759',
        }).then(() => onClear());
      } else {
        Swal.fire({ icon: 'error', title: 'Gagal', text: result.message });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Gagal terhubung.' });
    }
  };

  if (!file && !previewUrl) {
    return (
      <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-[12px] border-2 border-dashed border-[#e6ddd2] bg-[#faf8f5] p-6 text-center">
        <Scan className="mb-4 h-12 w-12 text-[#c1b5a5]" />
        <h3 className="text-lg font-medium text-[#7a6f61]">Belum ada nota</h3>
        <p className="mt-1 max-w-[250px] text-sm text-[#9f9485]">
          Pilih file foto di samping untuk melihat pratinjau dan mulai memindai.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-[12px] border border-[#f2e4d7] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.07)]">
      <div className="relative flex max-h-[300px] items-center justify-center overflow-hidden bg-[#1a1a1a] p-4">
        <img
          src={previewUrl}
          alt="Preview"
          className={`max-h-[260px] w-auto object-contain transition-opacity duration-300 ${isScanning ? 'opacity-40 blur-[2px]' : 'opacity-100'}`}
        />
        
        {isScanning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-[#ea8327]"></div>
            <p className="mt-4 animate-pulse text-sm font-medium tracking-wider">AI MEMBACA DATA...</p>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-6">
        {!scanData ? (
          <div className="flex gap-3">
            <button
              onClick={onScan}
              disabled={isScanning}
              className="flex flex-1 items-center justify-center gap-2 rounded-[8px] bg-[#ea8327] py-4 text-sm font-bold text-white transition hover:bg-[#d57421] disabled:opacity-50"
            >
              <Scan className="h-5 w-5" />
              {isScanning ? 'MEMPROSES...' : 'SCAN DENGAN AI'}
            </button>
            <button
              onClick={onClear}
              disabled={isScanning}
              className="flex items-center justify-center rounded-[8px] bg-[#fff1e1] px-5 py-4 text-[#ea8327] transition hover:bg-[#ffe6ca] disabled:opacity-50"
              title="Hapus gambar"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <section className="animate-in fade-in slide-in-from-bottom-4 rounded-[12px] border border-[#f0e2d5] bg-[#fffdf9] p-4 duration-500 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="flex items-center gap-2 text-[#249a43]">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <h2 className="text-lg font-bold text-[#249a43]">Validasi Hasil AI</h2>
              </div>
            </div>
            <p className="mt-2 text-sm leading-6 text-[#6f6a64]">
              Periksa data hasil scan, koreksi bila perlu, lalu lengkapi harga jual sebelum menyimpan.
            </p>

            <div className="mt-6 rounded-[10px] border border-[#f0e2d5] bg-white p-4">
              <SectionHeader
                icon={Store}
                title="Informasi Nota"
                description="Data utama nota akan terisi otomatis dari hasil scan AI dan tetap bisa dikoreksi."
              />
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(160px,0.8fr)_minmax(180px,0.9fr)]">
                <label className="block">
                  <EditableLabel>Nama Toko Supplier</EditableLabel>
                  <input
                    type="text"
                    name="toko"
                    value={formData.toko}
                    onChange={handleChange}
                    placeholder="Belum diisi"
                    className={inputClassName()}
                  />
                </label>
                <label className="block">
                  <EditableLabel>
                    <Calendar className="h-3.5 w-3.5 shrink-0 text-[#ea8327]" aria-hidden="true" />
                    Tanggal
                  </EditableLabel>
                  <input
                    type="text"
                    name="tanggal"
                    value={formData.tanggal}
                    onChange={handleChange}
                    placeholder="Belum diisi"
                    className={inputClassName()}
                  />
                </label>
                <label className="block">
                  <MoneyLabel>
                    Total Transaksi
                  </MoneyLabel>
                  <input
                    type="number"
                    name="totalHarga"
                    value={formData.totalHarga}
                    onChange={handleChange}
                    placeholder="Belum diisi"
                    className={inputClassName()}
                  />
                </label>
              </div>
            </div>

            <div className="mt-5 rounded-[10px] border border-[#f0e2d5] bg-white p-4">
              <SectionHeader
                title="Item Hasil Scan"
                description="Koreksi data item, isi margin atau harga jual, lalu simpan final."
              />

              {receiptItems.length === 0 ? (
                <div className="rounded-[10px] border border-dashed border-[#e6ddd2] bg-white px-4 py-7 text-center">
                  <p className="text-sm font-medium text-[#7a6f61]">
                    Belum ada item terdeteksi. Tambahkan item secara manual.
                  </p>
                  <button
                    type="button"
                    onClick={addManualItem}
                    className="mt-4 inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#ea8327] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#d57421]"
                  >
                    <Plus className="h-4 w-4" />
                    Tambah Item
                  </button>
                </div>
              ) : (
                <>
                  <div className="hidden overflow-x-auto lg:block">
                    <table className="min-w-[1040px] w-full border-separate border-spacing-0 text-left text-sm">
                      <thead>
                        <tr className="bg-[#fff6ed] text-xs uppercase tracking-[0.08em] text-[#8a561d]">
                          <th className="rounded-l-[8px] px-3 py-3 font-semibold">
                            <EditableColumnLabel>Nama Barang</EditableColumnLabel>
                          </th>
                          <th className="px-3 py-3 font-semibold">
                            <EditableColumnLabel>Jumlah Barang</EditableColumnLabel>
                          </th>
                          <th className="px-3 py-3 font-semibold">
                            <EditableColumnLabel>Harga Satuan</EditableColumnLabel>
                          </th>
                          <th className="px-3 py-3 font-semibold">
                            <EditableColumnLabel>Total Harga Item</EditableColumnLabel>
                          </th>
                          <th className="px-3 py-3 font-semibold">
                            <EditableColumnLabel>Profit Margin (%)</EditableColumnLabel>
                          </th>
                          <th className="px-3 py-3 font-semibold">
                            <EditableColumnLabel>Harga Jual</EditableColumnLabel>
                          </th>
                          <th className="rounded-r-[8px] px-3 py-3 text-center font-semibold">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {receiptItems.map((item) => {
                          const validation = validateReceiptItem(item);
                          const hasContent = hasReceiptItemContent(item);

                          return (
                            <tr key={item.id} className="align-top">
                              <td className="border-b border-[#f3e7dc] px-3 py-3">
                                <input
                                  type="text"
                                  value={item.itemName}
                                  onChange={(event) => handleItemChange(item.id, 'itemName', event.target.value)}
                                  placeholder="Belum diisi"
                                  className={inputClassName(validation.errors.itemName)}
                                />
                              </td>
                              <td className="border-b border-[#f3e7dc] px-3 py-3">
                                <input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(event) => handleItemChange(item.id, 'quantity', event.target.value)}
                                  placeholder="Belum diisi"
                                  className={inputClassName(validation.errors.quantity)}
                                />
                              </td>
                              <td className="border-b border-[#f3e7dc] px-3 py-3">
                                <input
                                  type="number"
                                  min="0"
                                  value={item.unitPrice}
                                  onChange={(event) => handleItemChange(item.id, 'unitPrice', event.target.value)}
                                  placeholder="Belum diisi"
                                  className={inputClassName(validation.errors.unitPrice)}
                                />
                              </td>
                              <td className="border-b border-[#f3e7dc] px-3 py-3">
                                <input
                                  type="number"
                                  min="0"
                                  value={item.totalItemCost}
                                  onChange={(event) => handleItemChange(item.id, 'totalItemCost', event.target.value)}
                                  placeholder="Belum diisi"
                                  className={inputClassName(validation.errors.totalItemCost)}
                                />
                              </td>
                              <td className="border-b border-[#f3e7dc] px-3 py-3">
                                <input
                                  type="number"
                                  value={item.marginPercent}
                                  onChange={(event) => handleItemChange(item.id, 'marginPercent', event.target.value)}
                                  placeholder="Belum diisi"
                                  className={inputClassName()}
                                />
                              </td>
                              <td className="border-b border-[#f3e7dc] px-3 py-3">
                                <input
                                  type="number"
                                  min="0"
                                  value={item.sellingPrice}
                                  onChange={(event) => handleItemChange(item.id, 'sellingPrice', event.target.value)}
                                  placeholder="Belum diisi"
                                  className={inputClassName(validation.errors.sellingPrice)}
                                />
                              </td>
                              <td className="border-b border-[#f3e7dc] px-3 py-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => removeItem(item.id)}
                                  className="inline-flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#fff1f0] text-[#d94835] transition hover:bg-[#ffe1dd]"
                                  title="Hapus item"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                                {!validation.isValid && hasContent ? (
                                  <p className="mt-1 text-[0.7rem] font-semibold text-[#d94835]">Belum lengkap</p>
                                ) : null}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="grid gap-4 lg:hidden">
                    {receiptItems.map((item, index) => {
                      const validation = validateReceiptItem(item);
                      const hasContent = hasReceiptItemContent(item);

                      return (
                        <article key={item.id} className="rounded-[10px] border border-[#f0e2d5] bg-white p-4">
                          <div className="mb-4 flex items-center justify-between gap-3">
                            <p className="text-sm font-bold text-[#2d2d2d]">Item {index + 1}</p>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#fff1f0] text-[#d94835] transition hover:bg-[#ffe1dd]"
                              title="Hapus item"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="grid gap-3 sm:grid-cols-2">
                            <ReceiptItemFields item={item} validation={validation} onChange={handleItemChange} />
                          </div>
                          {!validation.isValid && hasContent ? (
                            <p className="mt-3 text-xs font-semibold text-[#d94835]">
                              Lengkapi nama barang dan pastikan angka tidak negatif.
                            </p>
                          ) : null}
                        </article>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <div className="mt-5 rounded-[10px] border border-[#f0e2d5] bg-white p-4">
              <SectionHeader
                icon={Banknote}
                title="Ringkasan Transaksi"
                description="Ringkasan dihitung otomatis dari item yang sudah diisi."
              />
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-[8px] border border-[#f0e2d5] bg-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#a99a8a]">Total Modal</p>
                  <p className="mt-1 text-base font-bold text-[#2d2d2d]">
                    {receiptSummary.hasTotalModal ? formatCurrency(receiptSummary.totalModal) : 'Belum diisi'}
                  </p>
                </div>
                <div className="rounded-[8px] border border-[#f0e2d5] bg-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#a99a8a]">Total Harga Jual</p>
                  <p className="mt-1 text-base font-bold text-[#2d2d2d]">
                    {receiptSummary.hasTotalHargaJual ? formatCurrency(receiptSummary.totalHargaJual) : 'Belum diisi'}
                  </p>
                </div>
                <div className="rounded-[8px] border border-[#f0e2d5] bg-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#a99a8a]">Total Profit</p>
                  <p className="mt-1 text-base font-bold text-[#249a43]">
                    {receiptSummary.hasTotalProfit ? formatCurrency(receiptSummary.totalProfit) : 'Belum diisi'}
                  </p>
                </div>
                <div className="rounded-[8px] border border-[#f0e2d5] bg-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#a99a8a]">Rata-rata Margin</p>
                  <p className="mt-1 text-base font-bold text-[#2d2d2d]">
                    {formatPercent(receiptSummary.averageMargin)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#f3e7dc] pt-5 sm:flex-row">
              <button
                onClick={onClear}
                className="flex items-center justify-center rounded-[8px] bg-gray-100 px-5 py-3.5 text-sm font-medium text-gray-500 transition hover:bg-gray-200 sm:w-auto"
              >
                BATAL
              </button>
              <button
                onClick={handleSaveToDatabase}
                className="flex flex-1 items-center justify-center gap-2 rounded-[8px] bg-[#35c759] py-3.5 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition hover:bg-[#2db44f]"
              >
                <Save className="h-5 w-5" />
                SIMPAN FINAL
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ReceiptPreview;
