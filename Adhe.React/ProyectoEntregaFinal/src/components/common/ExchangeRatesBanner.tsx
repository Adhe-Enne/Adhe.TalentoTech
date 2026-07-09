import React, { useCallback, useMemo, useState } from "react";
import { FaSync } from "react-icons/fa";

import { useAllExchangeRates } from "../../hooks/useAllExchangeRates";
import ConfirmDialog from "../ui/ConfirmDialog";

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

  const barClasses: string = "bg-gray-900 text-white";

  if (loading) {
    return (
      <div aria-busy="true" aria-live="polite" className={`${barClasses} border-b border-white/10 py-2.5 px-4 text-sm text-center`} role="status">
        <span className="opacity-70 italic">Cargando tipos de cambio...</span>
      </div>
    );
  }

  return (
    <div aria-label="Tipos de cambio actuales" aria-live="polite" className={`${barClasses} border-b border-white/10 py-2.5 px-4 text-sm text-center`} role="status">
      <span className="inline-flex items-center flex-wrap gap-y-1.5 gap-x-3 justify-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1">
          <span aria-hidden="true" className="text-base font-bold">$</span>
          <strong aria-label="1 dólar estadounidense" className="text-base font-bold tracking-wide">1 USD</strong>
        </span>
        {DISPLAY_CURRENCIES.map((currency: string, i: number) => {
          const rate: number | undefined = rates[currency];
          const sourceUrl: string | undefined = sources[currency];

          if (rate == null) {
            return null;
          }

          return (
            <React.Fragment key={currency}>
              {i > 0 && (
                <span aria-hidden="true" className="opacity-30">
                  |
                </span>
              )}
              {sourceUrl ? (
                <a aria-label={`Ver conversión de USD a ${currency}`} className="text-white/90 underline decoration-dotted hover:text-white hover:decoration-solid transition-colors" href={sourceUrl} rel="noopener noreferrer" target="_blank">
                  = {rateFormatter.format(rate)} <strong className="text-white">{currency}</strong>
                </a>
              ) : (
                <span>
                  = {rateFormatter.format(rate)} <strong className="text-white">{currency}</strong>
                </span>
              )}
            </React.Fragment>
          );
        })}
        {timeStr && (
          <span className="opacity-60 text-xs whitespace-nowrap" title={lastUpdated ? new Date(lastUpdated).toLocaleString("es-AR") : ""}>
            — {timeStr}
          </span>
        )}
        {showRefresh && (
          <button aria-label="Forzar actualización de tasas de cambio" className="items-center bg-white/10 border border-white/20 rounded cursor-pointer inline-flex text-xs gap-1 leading-none py-1 px-2.5 opacity-80 hover:opacity-100 hover:bg-white/20 hover:border-warning hover:text-warning disabled:cursor-not-allowed disabled:opacity-40 transition-colors" disabled={refreshing} onClick={handleConfirmRequest} type="button">
            {refreshing ? <span aria-hidden="true" className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <FaSync aria-hidden="true" />}
            <span className="whitespace-nowrap">Forzar actualización</span>
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
