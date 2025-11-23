// Currency conversion rates (updated periodically)
// Base currency: USD
export const CURRENCY_RATES = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.12,
  JPY: 149.50,
  CNY: 7.24,
  CAD: 1.36,
  AUD: 1.52
};

// Convert amount from one currency to another
export const convertCurrency = (amount, fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) return amount;
  
  // Convert to USD first (base currency)
  const amountInUSD = amount / CURRENCY_RATES[fromCurrency];
  
  // Convert from USD to target currency
  const convertedAmount = amountInUSD * CURRENCY_RATES[toCurrency];
  
  return convertedAmount;
};

// Convert all transactions when currency changes
export const convertAllTransactions = (transactions, oldCurrency, newCurrency) => {
  return transactions.map(transaction => ({
    ...transaction,
    amount: convertCurrency(transaction.amount, oldCurrency, newCurrency)
  }));
};

// Convert all investments when currency changes
export const convertAllInvestments = (investments, oldCurrency, newCurrency) => {
  return investments.map(investment => ({
    ...investment,
    amount: convertCurrency(investment.amount, oldCurrency, newCurrency),
    nominalReturn: convertCurrency(parseFloat(investment.nominalReturn), oldCurrency, newCurrency).toFixed(2),
    realReturn: convertCurrency(parseFloat(investment.realReturn), oldCurrency, newCurrency).toFixed(2),
    nominalGain: convertCurrency(parseFloat(investment.nominalGain), oldCurrency, newCurrency).toFixed(2),
    realGain: convertCurrency(parseFloat(investment.realGain), oldCurrency, newCurrency).toFixed(2)
  }));
};

// Get conversion rate between two currencies
export const getConversionRate = (fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) return 1;
  return CURRENCY_RATES[toCurrency] / CURRENCY_RATES[fromCurrency];
};

// Format currency with proper symbol
export const formatCurrency = (amount, currencyCode) => {
  const symbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥',
    CNY: '¥',
    CAD: 'C$',
    AUD: 'A$'
  };
  
  return `${symbols[currencyCode] || '$'}${amount.toFixed(2)}`;
};
