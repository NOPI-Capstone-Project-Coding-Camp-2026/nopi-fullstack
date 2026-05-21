import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const actionButtonClassName =
  'inline-flex min-h-10 items-center justify-center rounded-[8px] px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-45';

const HistoryTable = ({ items = [], hasActiveFilters = false, pagination = null, onEditNota }) => {
  const navigate = useNavigate();
  const isEmpty = items.length === 0;
  const totalItems = pagination?.totalItems ?? items.length;
  const totalPages = pagination?.totalPages ?? 1;
  const currentPage = pagination?.currentPage ?? 1;
  const displayStart = pagination?.displayStart ?? (totalItems > 0 ? 1 : 0);
  const displayEnd = pagination?.displayEnd ?? items.length;
  const showPagination = totalPages > 1;
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  const handlePageChange = (page) => {
    if (!pagination?.onPageChange || page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    pagination.onPageChange(page);
  };

  const handleEditNota = (item) => {
    if (onEditNota) {
      onEditNota(item);
    }
  };

  const handleDetailNota = (item) => {
    const notaId = item.id || item._id;

    if (!notaId) {
      Swal.fire({
        icon: 'warning',
        title: 'Detail belum tersedia',
        text: 'Detail nota tidak dapat dibuka karena ID nota tidak tersedia.',
        confirmButtonColor: '#ea8327',
      });
      return;
    }

    navigate(`/history/detail/${encodeURIComponent(notaId)}`, {
      state: {
        nota: item.rawNota || item,
      },
    });
  };

  const InfoRow = ({ label, value, strong = false }) => (
    <div className="min-w-0">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#aaa19a]">{label}</p>
      <p className={`mt-1 truncate text-sm text-[#2c2c2c] ${strong ? 'font-semibold' : 'font-medium'}`}>
        {value || '-'}
      </p>
    </div>
  );

  const ActionButtons = ({ item }) => (
    <div className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
      <button
        type="button"
        onClick={() => handleEditNota(item)}
        className={`${actionButtonClassName} border border-[#f0d8c1] bg-white text-[#b85f12] hover:bg-[#fff6ed]`}
      >
        Edit Nota
      </button>
      <button
        type="button"
        onClick={() => handleDetailNota(item)}
        disabled={!(item.id || item._id)}
        className={`${actionButtonClassName} bg-[#35c759] text-white shadow-[0_10px_20px_rgba(53,199,89,0.16)] hover:bg-[#2db44f]`}
        title={!(item.id || item._id) ? 'Detail nota tidak dapat dibuka karena ID nota tidak tersedia.' : 'Buka detail nota'}
      >
        Detail Nota
      </button>
    </div>
  );

  return (
    <div className="overflow-hidden rounded-[8px] border border-[#f1ede8] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
      {isEmpty ? (
        <div className="px-5 py-12 text-center sm:px-8 sm:py-16">
          <h3 className="text-lg font-semibold text-[#2c2c2c] sm:text-xl">
            {hasActiveFilters ? 'Tidak ada data yang cocok' : 'Belum ada riwayat transaksi'}
          </h3>
          <p className="mt-3 text-[0.94rem] leading-7 text-[#8d8d8d] sm:text-[0.98rem]">
            {hasActiveFilters
              ? 'Coba ubah kata kunci atau filter tanggal untuk melihat hasil lainnya.'
              : 'Riwayat nota akan muncul setelah Anda mengunggah dan menyimpan hasil scan pertama.'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-3 p-3 lg:hidden">
            {items.map((item, index) => (
              <article
                key={item.id || `${item.dateLabel}-${index}`}
                className="rounded-[8px] border border-[#f1ede8] bg-[#fffdf9] p-4"
              >
                <div className="grid gap-3 sm:grid-cols-3">
                  <InfoRow
                    label="Tanggal"
                    value={item.dateLabel || item.date || '-'}
                  />
                  <InfoRow label="Nama Toko" value={item.merchant} strong />
                  <InfoRow label="Harga Beli" value={item.cost} strong />
                </div>

                <div className="mt-4">
                  <ActionButtons item={item} />
                </div>
              </article>
            ))}
          </div>

          <div className="hidden overflow-x-auto lg:block">
            <table className="min-w-[780px] w-full border-collapse text-left text-[0.9rem] text-[#2c2c2c]">
              <thead className="bg-[#f7f7f7] text-[0.74rem] font-semibold uppercase tracking-[0.12em] text-[#909090]">
                <tr>
                  <th className="px-4 py-3 whitespace-nowrap sm:px-5">Tanggal</th>
                  <th className="px-4 py-3 whitespace-nowrap sm:px-5">Nama Toko</th>
                  <th className="px-4 py-3 whitespace-nowrap sm:px-5">Harga Beli</th>
                  <th className="px-4 py-3 whitespace-nowrap sm:px-5">Edit Nota</th>
                  <th className="px-4 py-3 whitespace-nowrap sm:px-5">Detail Nota</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id || `${item.dateLabel}-${index}`} className="border-t border-[#f4f0ea] align-top">
                    <td className="px-4 py-3.5 whitespace-nowrap sm:px-5">
                      <div className="font-semibold">{item.dateLabel || item.date || '-'}</div>
                    </td>
                    <td className="px-4 py-3.5 sm:px-5">
                      <div className="font-semibold">{item.merchant || '-'}</div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap font-semibold sm:px-5">{item.cost || '-'}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap sm:px-5">
                      <button
                        type="button"
                        onClick={() => handleEditNota(item)}
                        className={`${actionButtonClassName} border border-[#f0d8c1] bg-white text-[#b85f12] hover:bg-[#fff6ed]`}
                      >
                        Edit Nota
                      </button>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap sm:px-5">
                      <button
                        type="button"
                        onClick={() => handleDetailNota(item)}
                        disabled={!(item.id || item._id)}
                        className={`${actionButtonClassName} bg-[#35c759] text-white shadow-[0_10px_20px_rgba(53,199,89,0.16)] hover:bg-[#2db44f]`}
                        title={!(item.id || item._id) ? 'Detail nota tidak dapat dibuka karena ID nota tidak tersedia.' : 'Buka detail nota'}
                      >
                        Detail Nota
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="flex flex-col gap-3 px-5 py-4 text-[0.86rem] text-[#909090] sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          {totalItems === 0
            ? 'Tidak ada transaksi'
            : `Menampilkan ${displayStart}-${displayEnd} dari ${totalItems} transaksi`}
        </p>
        {showPagination ? (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-[8px] border border-[#e6ddd2] bg-white px-3 py-2 text-sm font-semibold text-[#6d6258] transition hover:bg-[#fff6ed] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            {pageNumbers.map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => handlePageChange(page)}
                className={`h-9 min-w-9 rounded-[8px] px-3 text-sm font-semibold transition ${
                  page === currentPage
                    ? 'bg-[#ea8327] text-white'
                    : 'border border-[#e6ddd2] bg-white text-[#6d6258] hover:bg-[#fff6ed]'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-[8px] border border-[#e6ddd2] bg-white px-3 py-2 text-sm font-semibold text-[#6d6258] transition hover:bg-[#fff6ed] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default HistoryTable;
