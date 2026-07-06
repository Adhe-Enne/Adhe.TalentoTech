import { doc, DocumentSnapshot, getDoc, setDoc, updateDoc, type DocumentData, type DocumentReference } from "firebase/firestore";

import type { ExchangeRateDocument } from "../types/ExchangeRateTypes";

import { db } from "../firebase";

const SETTINGS_COLLECTION: string = "settings";
const EXCHANGE_RATES_DOC: string = "exchangeRates";
const TRACKED_CURRENCIES: readonly string[] = ["ARS", "EUR", "BRL"] as const;

const REFRESH_INTERVAL_MS: number = 24 * 60 * 60 * 1000;

function buildVisualUrl(currency: string): string {
  return `https://currencyapi.net/currency-converter/usd-${currency.toLowerCase()}?amount=1`;
}

async function fetchFromAPI(): Promise<ExchangeRateDocument> {
  const apiKey: string = import.meta.env.VITE_CURRENCYAPI_KEY;

  const url: string = `https://currencyapi.net/api/v2/rates?key=${apiKey}&base=USD&output=json`;
  const response: Response = await fetch(url, { headers: { Accept: "application/json" } });
  const data: Record<string, unknown> = await response.json();

  if (!data.valid) {
    throw new Error("API response indicates invalid data");
  }

  const apiRates: Record<string, number> = data.rates as Record<string, number>;
  const now: string = new Date().toISOString();
  const rates: Record<string, number> = {};

  for (const c of TRACKED_CURRENCIES) {
    rates[c] = apiRates[c];
  }

  return {
    rates,
    sources: Object.fromEntries(TRACKED_CURRENCIES.map((c: string) => [c, buildVisualUrl(c)])),
    updatedAt: new Date((data.updated as number) * 1000).toISOString(),
    lastAutoRefresh: now,
  };
}

async function getExchangeRates(): Promise<ExchangeRateDocument> {
  const docRef: DocumentReference = doc(db, SETTINGS_COLLECTION, EXCHANGE_RATES_DOC);
  const docSnap: DocumentSnapshot<DocumentData, DocumentData> = await getDoc(docRef);

  if (docSnap.exists()) {
    const data: ExchangeRateDocument = docSnap.data() as ExchangeRateDocument;

    const lastRefresh: number = new Date(data.lastAutoRefresh).getTime();
    if (Date.now() - lastRefresh > REFRESH_INTERVAL_MS) {
      refreshFromAPI(docRef);
    }

    return data;
  }

  const fresh: ExchangeRateDocument = await fetchFromAPI();
  await setDoc(docRef, fresh);
  return fresh;
}

async function refreshFromAPI(docRef: DocumentReference): Promise<void> {
  try {
    const fresh: ExchangeRateDocument = await fetchFromAPI();
    await updateDoc(docRef, { ...fresh });
  } catch {
    /* Firestore data remains valid — fail silently */
  }
}

async function forceRefreshExchangeRates(): Promise<void> {
  const docRef: DocumentReference = doc(db, SETTINGS_COLLECTION, EXCHANGE_RATES_DOC);
  await refreshFromAPI(docRef);
}

export const exchangeRateService: {
  forceRefreshExchangeRates: () => Promise<void>;
  getExchangeRates: () => Promise<ExchangeRateDocument>;
  getRate: (from: string, to?: string) => Promise<number>;
} = {
  forceRefreshExchangeRates,
  getExchangeRates,

  getRate: async (from: string, to: string = "USD"): Promise<number> => {
    if (from === to) {
      return 1;
    }

    const { rates } = await getExchangeRates();
    const rate: number | undefined = rates[from];

    if (rate == null || rate === 0) {
      return 1;
    }

    return 1 / rate;
  },
};
