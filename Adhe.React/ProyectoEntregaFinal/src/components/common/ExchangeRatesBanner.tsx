import React, { useCallback, useMemo, useState } from "react";
import { Spinner } from "react-bootstrap";
import { FaSync } from "react-icons/fa";

import { useAllExchangeRates } from "../../hooks/useAllExchangeRates";
import ConfirmDialog from "../ui/ConfirmDialog";
import styles from "./ExchangeRatesBanner.module.css";

const DISPLAY_CURRENCIES: readonly string[] = ["ARS", "EUR", "BRL"];

const rateFormatter: Intl.NumberFormat = new Intl.NumberFormat("es-AR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatRelativeTime(timestamp: number): string {
  const minutes: number = Math.floor((Date.now() - timestamp) / 60000);
  if (minutes < 1) {
    return "recién actualizado";
  }
  if (minutes < 60) {
    return `hace ${minutes} min`;
  }
  const hours: number = Math.floor(minutes / 60);
  if (hours < 24) {
    return `hace ${hours}h`;
  }
  return `hace ${Math.floor(hours / 24)}d`;
}

interface ExchangeRatesBannerProps {
  showRefresh?: boolean;
}

const ExchangeRatesBanner: React.FC<ExchangeRatesBannerProps> = (props) => {
  const { showRefresh = false } = props;
  const { rates, sources, loading, lastUpdated, refresh } = useAllExchangeRates();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const timeStr: string = useMemo(() => (lastUpdated ? formatRelativeTime(lastUpdated) : ""), [lastUpdated]);

  const handleRefresh: () => Promise<void> = useCallback(async (): Promise<void> => {
    setRefreshing(true);
    try {
      await refresh();
    } finally {
      setRefreshing(false);
    }
  }, [refresh]);

  const handleConfirmRequest: () => void = useCallback((): void => {
    setShowConfirm(true);
  }, []);

  const handleConfirmCancel: () => void = useCallback((): void => {
    setShowConfirm(false);
  }, []);

  const handleConfirmAccept: () => void = useCallback((): void => {
    setShowConfirm(false);
    void handleRefresh();
  }, [handleRefresh]);

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
          const sourceUrl: string | undefined = sources[currency];

          if (rate == null) {
            return null;
          }

          return (
            <React.Fragment key={currency}>
              {i > 0 && (
                <span aria-hidden="true" className={styles.separator}>
                  |
                </span>
              )}
              {sourceUrl ? (
                <a aria-label={`Ver conversión de USD a ${currency}`} className={styles.sourceLink} href={sourceUrl} rel="noopener noreferrer" target="_blank">
                  = {rateFormatter.format(rate)} <strong>{currency}</strong>
                </a>
              ) : (
                <span>
                  = {rateFormatter.format(rate)} <strong>{currency}</strong>
                </span>
              )}
            </React.Fragment>
          );
        })}
        {timeStr && (
          <span className={styles.updated} title={lastUpdated ? new Date(lastUpdated).toLocaleString("es-AR") : ""}>
            — {timeStr}
          </span>
        )}
        {showRefresh && (
          <button aria-label="Forzar actualización de tasas de cambio" className={styles.refreshBtn} disabled={refreshing} onClick={handleConfirmRequest} type="button">
            {refreshing ? <Spinner animation="border" aria-hidden="true" size="sm" /> : <FaSync aria-hidden="true" />}
            <span className={styles.refreshLabel}>Forzar actualización</span>
          </button>
        )}
      </span>
      {showRefresh && (
        <ConfirmDialog
          cancelLabel="Cancelar"
          confirmLabel="Actualizar"
          confirmVariant="warning"
          loading={refreshing}
          loadingLabel="Actualizando..."
          message="Esto realizará una consulta a la API externa de divisas para actualizar las tasas de cambio en Firestore. El servicio tiene un límite de consultas diarias. ¿Desea continuar?"
          onCancel={handleConfirmCancel}
          onConfirm={handleConfirmAccept}
          open={showConfirm}
          title="Actualizar cotización"
        />
      )}
    </div>
  );
};

export default ExchangeRatesBanner;
