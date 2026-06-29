const priceFormatter: Intl.NumberFormat = new Intl.NumberFormat("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function formatPrice(amount: number, currency?: string): string {
  const formatted: string = priceFormatter.format(amount);
  return currency ? `${currency} ${formatted}` : `$${formatted}`;
}
