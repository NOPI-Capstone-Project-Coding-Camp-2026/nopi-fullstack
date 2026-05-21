import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { apiUrl } from '../utils/api';

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

const getValidDate = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDate = (value) => {
  const date = getValidDate(value);

  if (!date) {
    return '-';
  }

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  });
};

const formatPercent = (value) => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return '-';
  }

  return `${numericValue.toLocaleString('id-ID', { maximumFractionDigits: 2 })}%`;
};

const getFirstValue = (source, keys) => {
  if (!source || typeof source !== 'object') {
    return undefined;
  }

  for (const key of keys) {
    if (source[key] !== null && source[key] !== undefined && `${source[key]}`.trim() !== '') {
      return source[key];
    }
  }

  return undefined;
};

const getNotaItems = (nota) => {
  const candidateSources = [
    nota?.items,
    nota?.receiptItems,
    nota?.notaItems,
    nota?.detailItems,
    nota?.parsed_items?.items,
    nota?.parsedItems?.items,
  ];

  return candidateSources.find(Array.isArray) || [];
};

const normalizeItem = (item, index) => ({
  id: item?.id || item?._id || `detail-item-${index}`,
  name: getFirstValue(item, ['namaBarang', 'nama_barang', 'itemName', 'name', 'nama', 'product']),
  quantity: getFirstValue(item, ['jumlahBarang', 'jumlah_barang', 'quantity', 'qty', 'kuantitas', 'jumlah']),
  unitPrice: getFirstValue(item, ['hargaSatuan', 'harga_satuan', 'unitPrice', 'unit_price', 'price', 'harga']),
  totalItemCost: getFirstValue(item, [
    'totalHargaItem',
    'total_harga_item',
    'hargaTotal',
    'harga_total',
    'hargaTotalItem',
    'totalItemCost',
    'subtotal',
    'total',
  ]),
  profitMargin: getFirstValue(item, ['profitMargin', 'profit_margin', 'marginPercent', 'marginLaba', 'margin_laba', 'margin']),
  sellingPrice: getFirstValue(item, ['hargaJual', 'harga_jual', 'sellingPrice']),
  totalProfit: getFirstValue(item, ['totalProfit', 'total_profit']),
});

const DetailNotaPage = () => {
  const { notaId } = useParams();
  const location = useLocation();
  const stateNota = location.state?.nota;
  const stateNotaId = stateNota?.id || stateNota?._id;
  const hasStateNota = Boolean(stateNotaId && `${stateNotaId}` === `${notaId}`);
  const [fetchedNota, setFetchedNota] = useState(null);
  const [isLoading, setIsLoading] = useState(!hasStateNota);
  const [notFound, setNotFound] = useState(false);
  const nota = hasStateNota ? stateNota : fetchedNota;

  useEffect(() => {
    if (hasStateNota) {
      return;
    }

    const fetchNotaDetail = async () => {
      setIsLoading(true);
      setNotFound(false);
      setFetchedNota(null);

      try {
        const token = localStorage.getItem('token');
        const detailRes = await fetch(apiUrl(`/api/nota/${encodeURIComponent(notaId)}`), {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (detailRes.ok) {
          const detailResult = await detailRes.json();
          setFetchedNota(detailResult.data || detailResult);
          return;
        }

        const historyRes = await fetch(apiUrl('/api/nota/history'), {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!historyRes.ok) {
          setNotFound(true);
          return;
        }

        const result = await historyRes.json();
        const history = Array.isArray(result.data) ? result.data : [];
        const matchedNota = history.find((item) => `${item.id || item._id}` === `${notaId}`);

        if (matchedNota) {
          setFetchedNota(matchedNota);
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotaDetail();
  }, [hasStateNota, notaId]);

  const detailItems = useMemo(() => getNotaItems(nota).map(normalizeItem), [nota]);
  const supplierName = nota?.toko || nota?.merchant || 'Tidak Diketahui';
  const transactionDate = formatDate(nota?.tanggal || nota?.createdAt || nota?.date);
  const totalModal = formatCurrency(nota?.totalHarga ?? nota?.cost ?? nota?.rawCost);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[1.9rem] font-semibold tracking-[-0.06em] text-[#ea8327] sm:text-[2.3rem] lg:text-[2.8rem]">
            Detail Nota
          </h1>
          <p className="mt-2.5 text-[0.95rem] text-[#2d2d2d] sm:text-[1rem] lg:text-[1.02rem]">
            Ringkasan nota dan item hasil scan yang tersedia.
          </p>
        </div>

        <Link
          to="/history"
          className="inline-flex items-center justify-center rounded-[8px] border border-[#f0d8c1] bg-white px-4 py-3 text-sm font-semibold text-[#b85f12] transition hover:bg-[#fff6ed]"
        >
          Kembali ke History
        </Link>
      </div>

      <section className="mt-7 rounded-[8px] border border-[#f1ede8] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] sm:p-6">
        {!hasStateNota && isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#ea8327]"></div>
          </div>
        ) : (!hasStateNota && notFound) || !nota ? (
          <div className="py-12 text-center">
            <h2 className="text-lg font-semibold text-[#2c2c2c]">Nota tidak ditemukan</h2>
            <p className="mt-3 text-sm leading-6 text-[#8d8d8d]">
              Nota tidak ditemukan atau tidak dapat ditampilkan.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[8px] border border-[#f0e5d8] bg-[#fffdf9] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#aaa19a]">
                  Nama Toko Supplier
                </p>
                <p className="mt-2 text-base font-semibold text-[#2c2c2c]">{supplierName}</p>
              </div>
              <div className="rounded-[8px] border border-[#f0e5d8] bg-[#fffdf9] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#aaa19a]">
                  Tanggal
                </p>
                <p className="mt-2 text-base font-semibold text-[#2c2c2c]">{transactionDate}</p>
              </div>
              <div className="rounded-[8px] border border-[#f0e5d8] bg-[#fffdf9] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#aaa19a]">
                  Harga Beli / Total Modal
                </p>
                <p className="mt-2 text-base font-semibold text-[#249a43]">{totalModal}</p>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-[#8a561d]">
                Item Detail Nota
              </h2>

              {detailItems.length === 0 ? (
                <div className="mt-4 rounded-[8px] border border-dashed border-[#e8ddd2] bg-[#fcfaf7] px-5 py-10 text-center">
                  <p className="text-sm font-medium leading-6 text-[#8d8d8d]">
                    Detail item nota belum tersedia karena backend saat ini belum menyimpan item hasil scan.
                  </p>
                </div>
              ) : (
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-[980px] w-full border-collapse text-left text-sm text-[#2c2c2c]">
                    <thead className="bg-[#f7f7f7] text-[0.74rem] font-semibold uppercase tracking-[0.12em] text-[#909090]">
                      <tr>
                        <th className="px-4 py-3 whitespace-nowrap">Nama Barang</th>
                        <th className="px-4 py-3 whitespace-nowrap">Jumlah</th>
                        <th className="px-4 py-3 whitespace-nowrap">Harga Satuan</th>
                        <th className="px-4 py-3 whitespace-nowrap">Total Harga Item</th>
                        <th className="px-4 py-3 whitespace-nowrap">Profit Margin</th>
                        <th className="px-4 py-3 whitespace-nowrap">Harga Jual</th>
                        <th className="px-4 py-3 whitespace-nowrap">Total Profit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailItems.map((item) => (
                        <tr key={item.id} className="border-t border-[#f4f0ea]">
                          <td className="px-4 py-3.5 font-semibold">{item.name || '-'}</td>
                          <td className="px-4 py-3.5 whitespace-nowrap">{item.quantity || '-'}</td>
                          <td className="px-4 py-3.5 whitespace-nowrap">{formatCurrency(item.unitPrice)}</td>
                          <td className="px-4 py-3.5 whitespace-nowrap">{formatCurrency(item.totalItemCost)}</td>
                          <td className="px-4 py-3.5 whitespace-nowrap">{formatPercent(item.profitMargin)}</td>
                          <td className="px-4 py-3.5 whitespace-nowrap">{formatCurrency(item.sellingPrice)}</td>
                          <td className="px-4 py-3.5 whitespace-nowrap text-[#249a43]">
                            {formatCurrency(item.totalProfit)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </DashboardLayout>
  );
};

export default DetailNotaPage;
