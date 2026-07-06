export interface ExchangeRateDocument {
  lastAutoRefresh: string;
  rates: Record<string, number>;
  sources: Record<string, string>;
  updatedAt: string;
}
