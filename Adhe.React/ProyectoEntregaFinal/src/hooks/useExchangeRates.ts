import { useState } from "react";

import { exchangeRateService } from "../services/exchangeRateService";

interface UseExchangeRatesReturn {
  error: string | null;
  loading: boolean;
  getRate: (from: string, to?: string) => Promise<number>;
}

const useExchangeRates: () => UseExchangeRatesReturn = (): UseExchangeRatesReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getRate: (from: string, to?: string) => Promise<number> = async (from: string, to: string = "USD"): Promise<number> => {
    setLoading(true);
    setError(null);
    try {
      return await exchangeRateService.getRate(from, to);
    } catch {
      setError("Error al obtener tasa de cambio");
      return 1;
    } finally {
      setLoading(false);
    }
  };

  return { error, loading, getRate };
};

export default useExchangeRates;
