import { loadFromStorage, saveToStorage } from "../utils/storage";

interface ExchangeRates {
  [currency: string]: number;
}

interface RateCache {
  base: string;
  rates: ExchangeRates;
  timestamp: number;
}

const CACHE_KEY: string = "tt_exchange_rates";
const CACHE_TTL: number = 60 * 60 * 1000;

export const FALLBACK_RATES: ExchangeRates = {
  USD: 1,
  ARS: 1395,
  EUR: 0.92,
  BRL: 5.05,
};

async function fetchRates(base: string = "USD"): Promise<ExchangeRates> {
  const cached: RateCache | null = loadFromStorage<RateCache | null>(CACHE_KEY, null);
  if (cached && cached.base === base && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.rates;
  }

  try {
    const response: Response = await fetch(`https://cdn.jsdelivr.net/npm/@irfanokr/currency-api@latest/v1/rates/${base}.json`);
    if (!response.ok) {
      return { ...FALLBACK_RATES };
    }
    const data: { date: string; rates: ExchangeRates } = await response.json();
    const rates: ExchangeRates = data.rates;
    saveToStorage(CACHE_KEY, { base, rates, timestamp: Date.now() });
    return rates;
  } catch {
    return { ...FALLBACK_RATES };
  }
}

export const exchangeRateService: {
  clearCache: () => void;
  getAllRates: (base?: string) => Promise<ExchangeRates>;
  getRate: (from: string, to?: string) => Promise<number>;
} = {
  getRate: async (from: string, to: string = "USD"): Promise<number> => {
    if (from === to) {
      return 1;
    }
    const rates: ExchangeRates = await fetchRates(to);
    const rate: number | undefined = rates[from];
    if (rate == null || rate === 0) {
      return 1;
    }
    return 1 / rate;
  },

  getAllRates: async (base: string = "USD"): Promise<ExchangeRates> => {
    return fetchRates(base);
  },

  clearCache: (): void => {
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch {
      /* ignore */
    }
  },
};
