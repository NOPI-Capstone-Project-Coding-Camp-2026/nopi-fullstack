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

// 🚨 FUNGSI BARU: Mengubah data database Prisma ke format Kalkulator
export const mapDbItemsToState = (items) => {
  if (!Array.isArray(items)) return [];
  return items.map((item, index) => ({
    id: item.id || `item-${Date.now()}-${index}`,
    itemName: String(item.namaBarang || item.name || item.itemName || ''),
    quantity: String(item.jumlahBarang || item.quantity || '1'),
    unitPrice: String(item.hargaSatuan || item.unitPrice || '0'),
    totalItemCost: String(item.totalHargaItem || item.totalItemCost || '0'),
    marginPercent: item.profitMargin !== null && item.profitMargin !== undefined ? String(item.profitMargin) : '',
    sellingPrice: item.hargaJual !== null && item.hargaJual !== undefined ? String(item.hargaJual) : '',
    isEdited: false
  }));
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

export const normalizeExtractedItems = (scanData) => {
  if (!scanData) return [];
  const aiData = scanData.data || scanData.result || scanData;
  let rawItems = [];

  if (aiData.parsed_items && Array.isArray(aiData.parsed_items.items)) {
    rawItems = aiData.parsed_items.items;
  } else if (Array.isArray(aiData.items)) {
    rawItems = aiData.items;
  }

  if (!rawItems || rawItems.length === 0) {
    return [];
  }

  const cleanNumber = (val) => {
    if (val === undefined || val === null || val === '') return '';
    if (typeof val === 'number') return String(val);
    return String(val).replace(/[^\d]/g, '');
  };

  return rawItems.map((item, index) => {
    const itemName = item.nama_barang || item.name || item.item_name || item.deskripsi || item.product || '';
    let quantity = cleanNumber(item.jumlah_barang || item.kuantitas || item.qty || item.quantity || item.jumlah) || '1';
    let unitPrice = cleanNumber(item.harga_satuan || item.price || item.unit_price || item.harga) || '';
    let totalItemCost = cleanNumber(item.total_harga_item || item.harga_total || item.total || item.total_price || item.subtotal) || '';

    if (!totalItemCost && unitPrice) {
      totalItemCost = String(Number(unitPrice) * Number(quantity));
    }
    else if (!unitPrice && totalItemCost && Number(quantity) > 0) {
      unitPrice = String(Number(totalItemCost) / Number(quantity));
    }

    return {
      id: `item-${Date.now()}-${index}`,
      itemName: String(itemName),
      quantity: quantity,
      unitPrice: unitPrice,
      totalItemCost: totalItemCost,
      marginPercent: '',
      sellingPrice: '',
      isEdited: false
    };
  });
};

export const calculateTotalItemCost = (unitPrice, quantity) => {
  const unitPriceNumber = parseNumber(unitPrice);
  const quantityNumber = parseNumber(quantity);
  if (unitPriceNumber === null || quantityNumber === null || quantityNumber < 1) return EMPTY_VALUE;
  return unitPriceNumber * quantityNumber;
};

export const calculateUnitPrice = (totalItemCost, quantity) => {
  const totalItemCostNumber = parseNumber(totalItemCost);
  const quantityNumber = parseNumber(quantity);
  if (totalItemCostNumber === null || quantityNumber === null || quantityNumber < 1) return EMPTY_VALUE;
  return totalItemCostNumber / quantityNumber;
};

export const calculateSellingPrice = (unitPrice, marginPercent) => {
  const unitPriceNumber = parseNumber(unitPrice);
  const marginNumber = parseNumber(marginPercent);
  if (unitPriceNumber === null || marginNumber === null) return EMPTY_VALUE;
  return unitPriceNumber + unitPriceNumber * (marginNumber / 100);
};

export const calculateMarginPercent = (unitPrice, sellingPrice) => {
  const unitPriceNumber = parseNumber(unitPrice);
  const sellingPriceNumber = parseNumber(sellingPrice);
  if (unitPriceNumber === null || unitPriceNumber <= 0 || sellingPriceNumber === null) return EMPTY_VALUE;
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
  const canCalculateSellingTotals = sellingPriceNumber !== null && quantityNumber !== null && quantityNumber >= 1;
  const canCalculateProfit = canCalculateSellingTotals && totalItemCostNumber !== null;

  return {
    ...item,
    unitPrice,
    totalItemCost,
    marginPercent,
    sellingPrice,
    totalSellingPrice: canCalculateSellingTotals ? sellingPriceNumber * quantityNumber : 0,
    totalProfit: canCalculateProfit ? sellingPriceNumber * quantityNumber - totalItemCostNumber : 0,
    unitCost: unitPriceNumber ?? EMPTY_VALUE,
  };
};

export const calculateReceiptSummary = (items) => {
  const summary = items.reduce(
    (accumulator, item) => {
      const totalItemCostNumber = parseNumber(item.totalItemCost);
      const marginNumber = parseNumber(item.marginPercent);
      const unitPriceNumber = parseNumber(item.unitPrice);
      const sellingPriceNumber = parseNumber(item.sellingPrice);

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

      if (marginNumber !== null && unitPriceNumber !== null && sellingPriceNumber !== null) {
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
    averageMargin: summary.marginCount > 0 ? summary.marginTotal / summary.marginCount : EMPTY_VALUE,
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