export type Currency = "USD" | "ARS" | "EUR" | "BRL";

const VALID_CURRENCIES: readonly Currency[] = ["USD", "ARS", "EUR", "BRL"];

export function parseCurrency(value: string): Currency {
  const match: Currency | undefined = VALID_CURRENCIES.find((c) => c === value);
  return match ?? "USD";
}
