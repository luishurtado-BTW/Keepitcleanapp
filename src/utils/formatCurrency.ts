/**
 * Formats a numeric value into the MXN currency format: $1,234.56 MXN
 * @param amount Number to format
 */
export const formatCurrency = (amount: number): string => {
  const formatter = new Intl.NumberFormat('es-MX', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return `$${formatter.format(amount)} MXN`;
};
