const MONTH_LABEL_FORMATTER = new Intl.DateTimeFormat('id-ID', {
  month: 'long',
  year: 'numeric',
});

const FULL_DATE_FORMATTER = new Intl.DateTimeFormat('id-ID', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const TIME_FORMATTER = new Intl.DateTimeFormat('id-ID', {
  hour: '2-digit',
  minute: '2-digit',
});

export const formatCurrency = (value = 0) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export const historyItems = [];

const getMonthKey = (dateValue) => {
  if (!dateValue) {
    return '';
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const getMonthLabel = (monthKey) => {
  if (!monthKey) {
    return '';
  }

  const [year, month] = monthKey.split('-');
  const date = new Date(Number(year), Number(month) - 1, 1);

  if (Number.isNaN(date.getTime())) {
    return monthKey;
  }

  return MONTH_LABEL_FORMATTER.format(date);
};

export const normalizeTransaction = (item, index) => {
  const rawDate = item.dateIso || item.createdAt || item.date || '';
  const parsedDate = rawDate ? new Date(rawDate) : null;
  const buyPrice = Number(item.buyPrice ?? item.costValue ?? item.cost ?? 0) || 0;
  const sellPrice = Number(item.sellPriceValue ?? item.sellPrice ?? 0) || 0;
  const marginValue = sellPrice > 0 ? (((sellPrice - buyPrice) / sellPrice) * 100).toFixed(1) : '0.0';
  const marginLabel = item.margin || `${marginValue}%`;
  const monthKey = item.monthKey || getMonthKey(rawDate);

  return {
    id: item.id || `${monthKey || 'transaction'}-${index}`,
    merchant: item.merchant || item.storeName || 'Merchant belum tersedia',
    type: item.type || 'lainnya',
    dateIso: rawDate,
    dateLabel:
      item.dateLabel ||
      (parsedDate && !Number.isNaN(parsedDate.getTime()) ? FULL_DATE_FORMATTER.format(parsedDate) : '-'),
    timeLabel:
      item.timeLabel ||
      (parsedDate && !Number.isNaN(parsedDate.getTime()) ? TIME_FORMATTER.format(parsedDate) : '-'),
    monthKey,
    monthLabel: item.monthLabel || getMonthLabel(monthKey),
    buyPriceValue: buyPrice,
    sellPriceValue: sellPrice,
    cost: item.cost || formatCurrency(buyPrice),
    sellPrice: item.sellPriceLabel || item.sellPrice || formatCurrency(sellPrice),
    margin: marginLabel,
    receiptPhotoUrl: item.receiptPhotoUrl || item.receiptImage || item.photoUrl || '',
  };
};

export const normalizedHistoryItems = historyItems.map(normalizeTransaction);

export const getMonthOptions = (items = []) => {
  const optionMap = new Map();
  const today = new Date();

  for (let offset = 0; offset < 12; offset += 1) {
    const optionDate = new Date(today.getFullYear(), today.getMonth() - offset, 1);
    const monthKey = getMonthKey(optionDate);
    optionMap.set(monthKey, {
      value: monthKey,
      label: getMonthLabel(monthKey),
    });
  }

  items.forEach((item) => {
    if (item.monthKey && !optionMap.has(item.monthKey)) {
      optionMap.set(item.monthKey, {
        value: item.monthKey,
        label: item.monthLabel || getMonthLabel(item.monthKey),
      });
    }
  });

  return Array.from(optionMap.values()).sort((a, b) => b.value.localeCompare(a.value));
};

export const calculateDashboardMetrics = (items = [], activeMonthKey) => {
  const monthItems = activeMonthKey ? items.filter((item) => item.monthKey === activeMonthKey) : items;
  const totalCapital = monthItems.reduce((sum, item) => sum + item.buyPriceValue, 0);

  return {
    totalCapital,
    processedReceipts: monthItems.length,
    activeMonthLabel: activeMonthKey ? getMonthLabel(activeMonthKey) : 'Semua bulan',
  };
};

