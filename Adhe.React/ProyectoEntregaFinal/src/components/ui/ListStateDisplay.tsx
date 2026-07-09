import React from "react";

interface ListStateDisplayProps {
  children: React.ReactNode;
  error: string | null;
  loading: boolean;
  loadingMessage?: string;
  onRetry?: () => void;
}

const ListStateDisplay: React.FC<ListStateDisplayProps> = (props: ListStateDisplayProps) => {
  const { children, error, loading, loadingMessage = "Cargando...", onRetry } = props;
  if (loading) {
    return (
      <div aria-busy="true" className="flex justify-center py-5">
        <span className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-blue-600 rounded-full" role="status" />
        <output aria-live="polite" className="sr-only">
          {loadingMessage}
        </output>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 bg-danger/10 border border-danger/20 text-danger p-4 rounded-lg" role="alert">
        <span>{error}</span>
        {onRetry && (
          <button
            aria-label="Reintentar"
            className="ml-auto bg-transparent border border-danger text-danger px-3 py-1.5 rounded-lg text-sm hover:bg-danger/10"
            onClick={onRetry}
            type="button"
          >
            Reintentar
          </button>
        )}
      </div>
    );
  }

  return <>{children}</>;
};

export default ListStateDisplay;
