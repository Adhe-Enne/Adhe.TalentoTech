export type Currency = "USD" | "ARS" | "BTC";

const VALID_CURRENCIES: readonly Currency[] = ["USD", "ARS", "BTC"];

export function parseCurrency(value: string): Currency {
  const match: Currency | undefined = VALID_CURRENCIES.find((c) => c === value);
  return match ?? "USD";
}
