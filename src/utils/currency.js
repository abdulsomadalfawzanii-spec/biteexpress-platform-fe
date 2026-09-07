export const formatCurrency = (amount) => new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  minimumFractionDigits: 2,
}).format(Number(amount) || 0);
