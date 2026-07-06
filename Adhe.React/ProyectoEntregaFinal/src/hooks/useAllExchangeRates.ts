import { useCallback } from "react";

import type { ExchangeRateDocument } from "../types/ExchangeRateTypes";

import { exchangeRateService } from "../services/exchangeRateService";
import useAsyncCollection from "./useAsyncCollection";

interface UseAllExchangeRatesReturn {
  lastUpdated: number | null;
  loading: boolean;
  rates: Record<string, number>;
  sources: Record<string, string>;
  refresh: () => Promise<void>;
}

export function useAllExchangeRates(): UseAllExchangeRatesReturn {
  const fetchRates: () => Promise<ExchangeRateDocument[]> = useCallback(async (): Promise<ExchangeRateDocument[]> => {
    const doc: ExchangeRateDocument = await exchangeRateService.getExchangeRates();
    return [doc];
  }, []);

  const { data, loading, reload } = useAsyncCollection(fetchRates);

  const refresh: () => Promise<void> = useCallback(async (): Promise<void> => {
    await exchangeRateService.forceRefreshExchangeRates();
    await reload();
  }, [reload]);

  const [entry]: ExchangeRateDocument[] = data;
  const rates: Record<string, number> = entry?.rates ?? {};
  const sources: Record<string, string> = entry?.sources ?? {};
  const lastUpdated: number | null = entry?.updatedAt ? new Date(entry.updatedAt).getTime() : null;

  return { loading, rates, refresh, sources, lastUpdated };
}
