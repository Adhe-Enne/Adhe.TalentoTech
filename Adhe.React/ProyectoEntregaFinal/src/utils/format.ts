export function formatPrice(amount: number, currency?: string): string {
  const formatted: string = `$${amount.toFixed(2)}`;
  return currency ? `${currency} ${formatted}` : formatted;
}
