const priceFormatter: Intl.NumberFormat = new Intl.NumberFormat("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const currencyFormatters: Record<string, Intl.NumberFormat> = {
  USD: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
  ARS: new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }),
  EUR: new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }),
  BRL: new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }),
};

export function formatPrice(amount: number, currency?: string): string {
  if (currency && currencyFormatters[currency]) {
    return `${currencyFormatters[currency].format(amount)} ${currency}`;
  }
  if (currency) {
    return `${currency} ${priceFormatter.format(amount)}`;
  }
  return `$${priceFormatter.format(amount)}`;
}
