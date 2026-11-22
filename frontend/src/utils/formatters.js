// Formatting utilities for crypto currency, percentages, and numbers

export const USD_TO_PKR_RATE = 278.50;

export const formatUSD = (val, maxDecimals = 2) => {
  if (val === undefined || val === null || isNaN(val)) return '$0.00';
  const num = Number(val);
  if (num >= 1) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: maxDecimals,
    }).format(num);
  }
  // For tiny coin prices like $0.0042
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  }).format(num);
};

// Formats amount in Pakistani Rupee displaying both "Rs." and "PKR"
export const formatPKR = (val) => {
  if (val === undefined || val === null || isNaN(val)) return 'Rs. 0 PKR';
  const pkrNum = Number(val) * USD_TO_PKR_RATE;
  if (pkrNum >= 1e9) {
    return `Rs. ${(pkrNum / 1e9).toFixed(2)}B PKR`;
  }
  if (pkrNum >= 1e6) {
    return `Rs. ${(pkrNum / 1e6).toFixed(2)}M PKR`;
  }
  return `Rs. ${Math.round(pkrNum).toLocaleString('en-PK')} PKR`;
};

// Formats displaying USD alongside both Rs. and PKR
export const formatDualCurrency = (usdVal, maxDecimals = 2) => {
  if (usdVal === undefined || usdVal === null || isNaN(usdVal)) return '$0.00 (Rs. 0 PKR)';
  return `${formatUSD(usdVal, maxDecimals)} (${formatPKR(usdVal)})`;
};

export const formatCompact = (val) => {
  if (val === undefined || val === null || isNaN(val)) return '0';
  const num = Number(val);
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
};

export const formatPercent = (val) => {
  if (val === undefined || val === null || isNaN(val)) return '0.00%';
  const sign = val > 0 ? '+' : '';
  return `${sign}${Number(val).toFixed(2)}%`;
};

export const formatNumber = (val, decimals = 2) => {
  if (val === undefined || val === null || isNaN(val)) return '0';
  return Number(val).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};
