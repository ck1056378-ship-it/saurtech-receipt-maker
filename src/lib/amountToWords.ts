const ones = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function twoDigits(n: number): string {
  if (n < 20) return ones[n];
  return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
}

function threeDigits(n: number): string {
  if (n === 0) return '';
  if (n < 100) return twoDigits(n);
  return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + twoDigits(n % 100) : '');
}

export function amountToWords(amount: number): string {
  if (amount === 0) return 'Zero';
  if (amount < 0) return 'Minus ' + amountToWords(-amount);

  const intPart = Math.floor(amount);
  const paisePart = Math.round((amount - intPart) * 100);

  let words = '';
  const crore = Math.floor(intPart / 10000000);
  const lakh = Math.floor((intPart % 10000000) / 100000);
  const thousand = Math.floor((intPart % 100000) / 1000);
  const hundred = intPart % 1000;

  if (crore) words += threeDigits(crore) + ' Crore ';
  if (lakh) words += twoDigits(lakh) + ' Lakh ';
  if (thousand) words += twoDigits(thousand) + ' Thousand ';
  if (hundred) words += threeDigits(hundred);

  words = words.trim();

  if (paisePart > 0) {
    words += ' and ' + twoDigits(paisePart) + ' Paise';
  }

  return 'INR ' + words + ' Only';
}

export function formatIndianCurrency(amount: number): string {
  const fixed = amount.toFixed(2);
  const [intPart, decPart] = fixed.split('.');
  const lastThree = intPart.slice(-3);
  const otherDigits = intPart.slice(0, -3);
  const formatted = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ',') +
    (otherDigits ? ',' : '') + lastThree;
  return '₹ ' + formatted + '.' + decPart;
}
