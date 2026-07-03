import { useEffect, useState } from "react";

import { exchangeRateService, FALLBACK_RATES } from "../services/exchangeRateService";

interface UseAllExchangeRatesReturn {
  error: string | null;
  loading: boolean;
  rates: Record<string, number>;
}

export function useAllExchangeRates(): UseAllExchangeRatesReturn {
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    exchangeRateService
      .getAllRates()
      .then((data: Record<string, number>) => {
        setRates(data);
        setLoading(false);
      })
      .catch((): void => {
        setError("No se pudieron obtener las tasas de cambio");
        setLoading(false);
      });
  }, []);

  return { error, loading, rates };
}
