import React, { useMemo } from "react";

import { useAllExchangeRates } from "../../hooks/useAllExchangeRates";
import styles from "./ExchangeRatesBanner.module.css";

const DISPLAY_CURRENCIES: readonly string[] = ["ARS", "EUR", "BRL"];

const rateFormatter: Intl.NumberFormat = new Intl.NumberFormat("es-AR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatRelativeTime(timestamp: number): string {
  const minutes: number = Math.floor((Date.now() - timestamp) / 60000);
  if (minutes < 1) {return "recién actualizado";}
  if (minutes < 60) {return `hace ${minutes} min`;}
  const hours: number = Math.floor(minutes / 60);
  if (hours < 24) {return `hace ${hours}h`;}
  return `hace ${Math.floor(hours / 24)}d`;
}

const ExchangeRatesBanner: React.FC = () => {
  const { rates, loading, lastUpdated } = useAllExchangeRates();

  const timeStr: string = useMemo(
    () => (lastUpdated ? formatRelativeTime(lastUpdated) : ""),
    [lastUpdated],
  );

  if (loading) {
    return (
      <div aria-busy="true" aria-live="polite" className={styles.banner} role="status">
        <span className={styles.loading}>Cargando tipos de cambio...</span>
      </div>
    );
  }

  return (
    <div aria-label="Tipos de cambio actuales" aria-live="polite" className={styles.banner} role="status">
      <span className={styles.rates}>
        <strong aria-label="1 dólar estadounidense">1 USD</strong>
        {DISPLAY_CURRENCIES.map((currency: string, i: number) => {
          const rate: number | undefined = rates[currency];
          if (rate == null) {return null;}
          return (
            <React.Fragment key={currency}>
              {i > 0 && <span aria-hidden="true" className={styles.separator}>|</span>}
              <span>
                = {rateFormatter.format(rate)}{" "}
                <strong>{currency}</strong>
              </span>
            </React.Fragment>
          );
        })}
        {timeStr && (
          <span
            className={styles.updated}
            title={lastUpdated ? new Date(lastUpdated).toLocaleString("es-AR") : ""}
          >
            — {timeStr}
          </span>
        )}
      </span>
    </div>
  );
};

export default ExchangeRatesBanner;
