import { useCallback } from "react";

import { exchangeRateService, FALLBACK_RATES } from "../services/exchangeRateService";
import useAsyncCollection from "./useAsyncCollection";

interface RateEntry {
  lastUpdated: number;
  rates: Record<string, number>;
}

interface UseAllExchangeRatesReturn {
  error: string | null;
  lastUpdated: number | null;
  loading: boolean;
  rates: Record<string, number>;
}

export function useAllExchangeRates(): UseAllExchangeRatesReturn {
  const fetchRates: () => Promise<RateEntry[]> = useCallback(async (): Promise<RateEntry[]> => {
    const rates: Record<string, number> = await exchangeRateService.getAllRates();
    return [{ rates, lastUpdated: Date.now() }];
  }, []);

  const { data, error, loading } = useAsyncCollection(fetchRates);

  const [entry]: RateEntry[] = data;
  const rates: Record<string, number> = entry?.rates ?? FALLBACK_RATES;
  const lastUpdated: number | null = entry?.lastUpdated ?? null;

  return { error, loading, rates, lastUpdated };
}
