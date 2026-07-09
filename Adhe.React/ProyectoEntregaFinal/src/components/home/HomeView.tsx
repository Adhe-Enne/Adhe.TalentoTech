import React from "react";
import { FaChevronUp, FaSearch, FaTimes } from "react-icons/fa";

import type { Product } from "../../models";

import ProductCard from "../product/product-card/ProductCard";
import HelmetMeta from "../ui/HelmetMeta";
import LoadingSpinner from "../ui/LoadingSpinner";
import PageHeader from "../ui/PageHeader";
import RefreshButton from "../ui/RefreshButton";

interface ProductCardData {
  currentQuantity: number;
  isFavorite: boolean;
  product: Product;
  onAddToCart: () => void;
  onDecrement: () => void;
  onIncrement: () => void;
  onNavigate: () => void;
  onToggleFavorite: () => void;
}

interface HomeViewProps {
  cardData: ProductCardData[];
  emptyMessage: string | undefined;
  hasLocalFilter: boolean;
  hasMore: boolean;
  loading: boolean;
  loadingMore: boolean;
  localQ: string;
  pageDescription: string | undefined;
  pageTitle: string | undefined;
  showLoadMore: boolean;
  showReset: boolean;
  onClearFilter: () => void;
  onLoadMore: () => void;
  onLocalQChange: (q: string) => void;
  onReload: () => void;
}

const HomeView: React.FC<HomeViewProps> = (props) => {
  const { cardData, emptyMessage, hasLocalFilter, hasMore, loading, loadingMore, localQ, pageDescription, pageTitle, showLoadMore, showReset, onClearFilter, onLoadMore, onLocalQChange, onReload } = props;

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <HelmetMeta description={pageDescription} title={pageTitle ? `Talento Tech | ${pageTitle}` : "Talento Tech"} />
      {loading ? (
        <LoadingSpinner message="Cargando productos..." minHeight="40vh" />
      ) : (
        <>
          <PageHeader headingTag="h3" title={pageTitle ?? "Productos"}>
            <RefreshButton loading={loading} onRefresh={onReload} />
          </PageHeader>
          <div className="mb-3">
            <div className="flex">
              <span className="flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg">
                <FaSearch aria-hidden="true" />
              </span>
              <input
                aria-label="Filtrar productos por nombre"
                className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-accent focus:border-accent -ml-px rounded-l-none"
                onChange={(e) => onLocalQChange(e.target.value)}
                placeholder="Filtrar resultados..."
                type="text"
                value={localQ}
              />
              {hasLocalFilter && (
                <button
                  aria-label="Limpiar filtro local"
                  className="bg-transparent border border-gray-400 text-gray-700 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-50 -ml-px rounded-r-lg rounded-l-none"
                  onClick={onClearFilter}
                >
                  <FaTimes aria-hidden="true" />
                  Limpiar
                </button>
              )}
            </div>
            {hasLocalFilter && (
              <small className="text-gray-500 mt-1 block">
                {cardData.length} producto{cardData.length === 1 ? "" : "s"} encontrado{cardData.length === 1 ? "" : "s"} para &quot;{localQ}&quot;
              </small>
            )}
          </div>

          {cardData.length === 0 ? (
            <div className="flex items-center gap-2 bg-info/10 border border-info/20 text-info p-4 rounded-lg" role="alert">
              <span>{hasLocalFilter ? `No se encontraron productos para "${localQ}".` : (emptyMessage ?? "No hay productos disponibles.")}</span>
              {hasLocalFilter && (
                <button aria-label="Limpiar filtro de búsqueda" className="ml-auto bg-transparent border border-gray-400 text-gray-700 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-50" onClick={onClearFilter}>
                  <FaTimes aria-hidden="true" />
                  Limpiar filtro
                </button>
              )}
            </div>
          ) : (
            <div className="fadeIn">
              <div className="grid grid-cols-12 gap-3">
                {cardData.map((cd) => (
                  <div className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3" key={cd.product.id}>
                    <ProductCard
                      currentQuantity={cd.currentQuantity}
                      isFavorite={cd.isFavorite}
                      onAddToCart={cd.onAddToCart}
                      onDecrement={cd.onDecrement}
                      onIncrement={cd.onIncrement}
                      onNavigate={cd.onNavigate}
                      onToggleFavorite={cd.onToggleFavorite}
                      product={cd.product}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {showLoadMore && (
            <div className="flex justify-center gap-2 mt-4">
              {showReset && (
                <button aria-label="Ver menos productos" className="bg-transparent border border-gray-400 text-gray-700 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-50" onClick={() => onReload()}>
                  <FaChevronUp aria-hidden="true" />
                  Ver menos
                </button>
              )}
              <button aria-label="Cargar más productos" className="bg-cta text-white px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50" disabled={loadingMore} onClick={() => onLoadMore()}>
                {loadingMore ? (
                  <>
                    <span aria-hidden="true" className="inline-block animate-spin rounded-full border-2 border-gray-300 border-t-accent w-4 h-4 mr-2" />
                    Cargando...
                  </>
                ) : (
                  "Cargar más"
                )}
              </button>
            </div>
          )}

          {!hasMore && cardData.length > 8 && (
            <div className="text-center mt-3">
              <output aria-live="polite" className="text-gray-500">
                No hay más productos para mostrar.
              </output>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomeView;
