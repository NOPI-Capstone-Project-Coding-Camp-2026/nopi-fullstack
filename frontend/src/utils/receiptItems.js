const EMPTY_VALUE = '';

const hasValue = (value) => value !== null && value !== undefined && `${value}`.trim() !== '';

const createItemId = () => {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `receipt-item-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const parseNumber = (value) => {
  if (!hasValue(value)) {
    return null;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  const compactValue = `${value}`.trim().replace(/[^\d,.-]/g, '');

  if (!compactValue || compactValue === '-') {
    return null;
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
  return Number.isFinite(parsedValue) ? parsedValue : null;
};

const formatNumberInput = (value) => {
  const numericValue = parseNumber(value);

  if (numericValue === null) {
    return EMPTY_VALUE;
  }

  return Number.isInteger(numericValue)
    ? `${numericValue}`
    : `${Number(numericValue.toFixed(2))}`;
};

const getFirstValue = (source, keys) => {
  if (!source || typeof source !== 'object') {
    return EMPTY_VALUE;
  }

  for (const key of keys) {
    if (hasValue(source[key])) {
      return source[key];
    }
  }

  return EMPTY_VALUE;
};

const unwrapAiResult = (aiResult) => {
  if (!aiResult || typeof aiResult !== 'object') {
    return {};
  }

  if (Array.isArray(aiResult)) {
    return { items: aiResult };
  }

  if (aiResult.data && typeof aiResult.data === 'object') {
    return aiResult.data;
  }

  return aiResult;
};

const getCandidateItemArrays = (aiContent) => {
  const directCandidates = [
    aiContent.items,
    aiContent.item_details,
    aiContent.itemDetails,
    aiContent.line_items,
    aiContent.lineItems,
    aiContent.details,
    aiContent.detail,
    aiContent.detail_items,
    aiContent.detailItems,
    aiContent.extracted_items,
    aiContent.extractedItems,
    aiContent.detected_items,
    aiContent.detectedItems,
    aiContent.ocr_items,
    aiContent.ocrItems,
    aiContent.products,
    aiContent.produk,
    aiContent.barang,
    aiContent.daftar_barang,
    aiContent.daftarBarang,
    aiContent.detail_barang,
    aiContent.detailBarang,
    aiContent.transactions,
    aiContent.transaksi,
  ];

  const nestedCandidates = [
    aiContent.result?.items,
    aiContent.result?.line_items,
    aiContent.result?.extracted_items,
    aiContent.result?.detected_items,
    aiContent.receipt?.items,
    aiContent.receipt?.line_items,
    aiContent.receipt?.extracted_items,
    aiContent.nota?.items,
    aiContent.nota?.detail_items,
  ];

  return [...directCandidates, ...nestedCandidates].find(Array.isArray) || [];
};

const formatDateValue = (value) => {
  if (!hasValue(value)) {
    return EMPTY_VALUE;
  }

  return `${value}`.trim();
};

export const createBlankReceiptItem = (overrides = {}) =>
  calculateItemTotals({
    id: createItemId(),
    date: EMPTY_VALUE,
    itemName: EMPTY_VALUE,
    quantity: EMPTY_VALUE,
    unitPrice: EMPTY_VALUE,
    totalItemCost: EMPTY_VALUE,
    marginPercent: EMPTY_VALUE,
    sellingPrice: EMPTY_VALUE,
    totalSellingPrice: 0,
    totalProfit: 0,
    isEdited: false,
    ...overrides,
  });

export const normalizeExtractedItems = (aiResult) => {
  const aiContent = unwrapAiResult(aiResult);
  const receiptDate = getFirstValue(aiContent, ['tanggal', 'date', 'transaction_date', 'transactionDate']);
  const itemCandidates = getCandidateItemArrays(aiContent);

  return itemCandidates
    .filter((item) => item && typeof item === 'object')
    .map((item) => {
      const quantity = getFirstValue(item, [
        'quantity',
        'qty',
        'jumlah',
        'jumlah_barang',
        'jumlahBarang',
        'kuantitas',
        'banyak',
        'count',
        'jumlah_item',
      ]);
      const unitPrice = getFirstValue(item, [
        'unitPrice',
        'unit_price',
        'harga_satuan',
        'hargaSatuan',
        'harga_modal',
        'harga_modal_satuan',
        'unit_cost',
        'unitCost',
        'price',
        'harga',
      ]);
      const totalItemCost = getFirstValue(item, [
        'totalItemCost',
        'total_item_cost',
        'totalCost',
        'total_cost',
        'total_harga_item',
        'totalHargaItem',
        'total_harga_beli',
        'totalHargaBeli',
        'harga_beli_total',
        'subtotal',
        'total',
        'amount',
        'total_price',
        'harga_total',
        'line_total',
      ]);

      return createBlankReceiptItem({
        date: formatDateValue(getFirstValue(item, ['date', 'tanggal', 'tgl']) || receiptDate),
        itemName: `${getFirstValue(item, [
          'itemName',
          'item_name',
          'namaBarang',
          'nama_barang',
          'nama_item',
          'namaItem',
          'nama_produk',
          'product_name',
          'productName',
          'item',
          'barang',
          'produk',
          'product',
          'name',
          'nama',
          'menu',
          'description',
          'deskripsi',
        ]) || ''}`.trim(),
        quantity: formatNumberInput(quantity),
        unitPrice: formatNumberInput(unitPrice),
        totalItemCost: formatNumberInput(totalItemCost),
        marginPercent: formatNumberInput(getFirstValue(item, [
          'marginPercent',
          'margin_percent',
          'profitMargin',
          'profit_margin',
          'profit_margin_percent',
          'margin',
        ])),
        sellingPrice: formatNumberInput(getFirstValue(item, [
          'sellingPrice',
          'selling_price',
          'hargaJual',
          'harga_jual',
          'sell_price',
        ])),
      });
    });
};

export const calculateTotalItemCost = (unitPrice, quantity) => {
  const unitPriceNumber = parseNumber(unitPrice);
  const quantityNumber = parseNumber(quantity);

  if (unitPriceNumber === null || quantityNumber === null || quantityNumber < 1) {
    return EMPTY_VALUE;
  }

  return unitPriceNumber * quantityNumber;
};

export const calculateUnitPrice = (totalItemCost, quantity) => {
  const totalItemCostNumber = parseNumber(totalItemCost);
  const quantityNumber = parseNumber(quantity);

  if (totalItemCostNumber === null || quantityNumber === null || quantityNumber < 1) {
    return EMPTY_VALUE;
  }

  return totalItemCostNumber / quantityNumber;
};

export const calculateSellingPrice = (unitPrice, marginPercent) => {
  const unitPriceNumber = parseNumber(unitPrice);
  const marginNumber = parseNumber(marginPercent);

  if (unitPriceNumber === null || marginNumber === null) {
    return EMPTY_VALUE;
  }

  return unitPriceNumber + unitPriceNumber * (marginNumber / 100);
};

export const calculateMarginPercent = (unitPrice, sellingPrice) => {
  const unitPriceNumber = parseNumber(unitPrice);
  const sellingPriceNumber = parseNumber(sellingPrice);

  if (unitPriceNumber === null || unitPriceNumber <= 0 || sellingPriceNumber === null) {
    return EMPTY_VALUE;
  }

  return ((sellingPriceNumber - unitPriceNumber) / unitPriceNumber) * 100;
};

export const calculateItemTotals = (item, changedField = '') => {
  const hasQuantity = hasValue(item.quantity);
  const hasUnitPrice = hasValue(item.unitPrice);
  const hasTotalItemCost = hasValue(item.totalItemCost);
  const hasMargin = hasValue(item.marginPercent);
  const hasSellingPrice = hasValue(item.sellingPrice);
  let unitPrice = item.unitPrice;
  let totalItemCost = item.totalItemCost;
  let marginPercent = item.marginPercent;
  let sellingPrice = item.sellingPrice;

  if (changedField === 'totalItemCost') {
    unitPrice = formatNumberInput(calculateUnitPrice(totalItemCost, item.quantity));
  } else if (changedField === 'unitPrice') {
    totalItemCost = formatNumberInput(calculateTotalItemCost(unitPrice, item.quantity));
  } else if (changedField === 'quantity') {
    if (hasUnitPrice) {
      totalItemCost = formatNumberInput(calculateTotalItemCost(unitPrice, item.quantity));
    } else if (hasTotalItemCost) {
      unitPrice = formatNumberInput(calculateUnitPrice(totalItemCost, item.quantity));
    }
  } else if (!hasUnitPrice && hasTotalItemCost && hasQuantity) {
    unitPrice = formatNumberInput(calculateUnitPrice(totalItemCost, item.quantity));
  } else if (!hasTotalItemCost && hasUnitPrice && hasQuantity) {
    totalItemCost = formatNumberInput(calculateTotalItemCost(unitPrice, item.quantity));
  }

  if (changedField === 'sellingPrice') {
    marginPercent = formatNumberInput(calculateMarginPercent(unitPrice, sellingPrice));
  } else if (changedField === 'marginPercent') {
    sellingPrice = formatNumberInput(calculateSellingPrice(unitPrice, marginPercent));
  } else if (hasMargin) {
    sellingPrice = formatNumberInput(calculateSellingPrice(unitPrice, marginPercent));
  } else if (hasSellingPrice) {
    marginPercent = formatNumberInput(calculateMarginPercent(unitPrice, sellingPrice));
  }

  const quantityNumber = parseNumber(item.quantity);
  const unitPriceNumber = parseNumber(unitPrice);
  const totalItemCostNumber = parseNumber(totalItemCost);
  const sellingPriceNumber = parseNumber(sellingPrice);
  const canCalculateSellingTotals =
    sellingPriceNumber !== null && quantityNumber !== null && quantityNumber >= 1;
  const canCalculateProfit =
    canCalculateSellingTotals && totalItemCostNumber !== null;

  return {
    ...item,
    unitPrice,
    totalItemCost,
    marginPercent,
    sellingPrice,
    totalSellingPrice: canCalculateSellingTotals ? sellingPriceNumber * quantityNumber : 0,
    totalProfit: canCalculateProfit
      ? sellingPriceNumber * quantityNumber - totalItemCostNumber
      : 0,
    unitCost: unitPriceNumber ?? EMPTY_VALUE,
  };
};

export const calculateReceiptSummary = (items) => {
  const summary = items.reduce(
    (accumulator, item) => {
      const totalItemCostNumber = parseNumber(item.totalItemCost);
      const marginNumber = parseNumber(item.marginPercent);

      if (totalItemCostNumber !== null && totalItemCostNumber >= 0) {
        accumulator.totalModal += totalItemCostNumber;
        accumulator.hasTotalModal = true;
      }

      if (hasValue(item.sellingPrice) && hasValue(item.quantity)) {
        accumulator.totalHargaJual += item.totalSellingPrice;
        accumulator.hasTotalHargaJual = true;
      }

      if (hasValue(item.sellingPrice) && hasValue(item.quantity) && totalItemCostNumber !== null) {
        accumulator.totalProfit += item.totalProfit;
        accumulator.hasTotalProfit = true;
      }

      if (marginNumber !== null) {
        accumulator.marginTotal += marginNumber;
        accumulator.marginCount += 1;
      }

      return accumulator;
    },
    {
      totalModal: 0,
      totalHargaJual: 0,
      totalProfit: 0,
      marginTotal: 0,
      marginCount: 0,
      hasTotalModal: false,
      hasTotalHargaJual: false,
      hasTotalProfit: false,
    },
  );

  return {
    totalModal: summary.totalModal,
    totalHargaJual: summary.totalHargaJual,
    totalProfit: summary.totalProfit,
    averageMargin:
      summary.marginCount > 0 ? summary.marginTotal / summary.marginCount : EMPTY_VALUE,
    hasTotalModal: summary.hasTotalModal,
    hasTotalHargaJual: summary.hasTotalHargaJual,
    hasTotalProfit: summary.hasTotalProfit,
  };
};

export const buildReceiptItemsPayload = (items) =>
  items
    .filter((item) => hasReceiptItemContent(item))
    .map((item) => ({
      tanggal: item.date || null,
      namaBarang: item.itemName || null,
      jumlahBarang: parseNumber(item.quantity),
      hargaSatuan: parseNumber(item.unitPrice),
      totalHargaItem: parseNumber(item.totalItemCost),
      profitMargin: parseNumber(item.marginPercent),
      hargaJual: parseNumber(item.sellingPrice),
      totalHargaJual: item.totalSellingPrice,
      totalProfit: item.totalProfit,
      isEdited: item.isEdited,
    }));

export const hasReceiptItemContent = (item) =>
  hasValue(item.date) ||
  hasValue(item.itemName) ||
  hasValue(item.quantity) ||
  hasValue(item.unitPrice) ||
  hasValue(item.totalItemCost) ||
  hasValue(item.marginPercent) ||
  hasValue(item.sellingPrice);

export const validateReceiptItem = (item) => {
  if (!hasReceiptItemContent(item)) {
    return { isValid: true, errors: {} };
  }

  const quantityNumber = parseNumber(item.quantity);
  const unitPriceNumber = parseNumber(item.unitPrice);
  const totalItemCostNumber = parseNumber(item.totalItemCost);
  const sellingPriceNumber = parseNumber(item.sellingPrice);
  const errors = {
    itemName: !hasValue(item.itemName),
    quantity: quantityNumber === null || quantityNumber < 1,
    unitPrice: unitPriceNumber !== null && unitPriceNumber < 0,
    totalItemCost: totalItemCostNumber !== null && totalItemCostNumber < 0,
    sellingPrice: sellingPriceNumber !== null && sellingPriceNumber < 0,
  };

  return {
    isValid: !Object.values(errors).some(Boolean),
    errors,
  };
};

export const receiptItemHasValue = hasValue;
