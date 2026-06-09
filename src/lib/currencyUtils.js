/**
 * Formats a number as Brazilian Real currency (BRL).
 * @param {number} value - The numeric value to format.
 * @param {boolean} [showSymbol=true] - Whether to include the R$ symbol.
 * @returns {string} The formatted currency string.
 */
export function formatCurrency(value, showSymbol = true) {
  if (value === null || value === undefined) {
    return showSymbol ? 'R$ 0,00' : '0,00';
  }

  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Safe fallback for NaN
  if (isNaN(numericValue)) {
    return showSymbol ? 'R$ 0,00' : '0,00';
  }

  const formatted = numericValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return showSymbol ? `R$ ${formatted}` : formatted;
}