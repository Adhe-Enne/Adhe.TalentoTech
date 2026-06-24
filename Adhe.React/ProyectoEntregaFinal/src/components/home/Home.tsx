import React, { useMemo, useState, type JSX } from "react";
import { Alert, Button, Container } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import { useLocation } from "react-router-dom";

import type { Product } from "../../models";

import useFavorites from "../../hooks/useFavorites";
import usePaginatedProducts from "../../hooks/usePaginatedProducts";
import ProductGrid from "../product/ProductGrid";
import HelmetMeta from "../ui/HelmetMeta";
import styles from "./Home.module.css";
import LoadMoreSection from "./LoadMoreSection";
import SearchBar from "./SearchBar";

const ITEMS_PER_PAGE: number = 8;

const Home: React.FC = () => {
  const { products: paginatedProducts, loading, loadingMore, hasMore, loadNextPage, reload: reloadProducts } = usePaginatedProducts();
  const { favorites } = useFavorites();

  const location: ReturnType<typeof useLocation> = useLocation();
  const params: URLSearchParams = new URLSearchParams(location.search);
  const q: string = (params.get("q") ?? "").toLowerCase();
  const filter: string | null = params.get("filter");

  const [localQ, setLocalQ] = useState<string>("");

  const filteredProducts: Product[] = useMemo(() => {
    let list: Product[] = paginatedProducts ?? [];
    if (q) {
      list = list.filter((p) => {
        const name: string = p.name?.toLowerCase() ?? "";
        const desc: string = p.description?.toLowerCase() ?? "";
        return name.includes(q) || desc.includes(q);
      });
    }
    if (filter === "favorites") {
      list = list.filter((p) => Boolean(favorites?.[p.id]));
    }
    if (localQ) {
      const lq: string = localQ.toLowerCase();
      list = list.filter((p) => {
        const name: string = p.name?.toLowerCase() ?? "";
        const desc: string = p.description?.toLowerCase() ?? "";
        return name.includes(lq) || desc.includes(lq);
      });
    }
    return list;
  }, [paginatedProducts, q, filter, favorites, localQ]);

  const pageTitle: string | undefined = filter === "favorites" ? "Favoritos" : "Productos";
  const pageDescription: string | undefined = filter === "favorites" ? "Tus productos favoritos en Talento Tech." : "Explora nuestro catálogo de productos tecnológicos.";
  const emptyMessage: string | undefined = filter === "favorites" ? "No tienes productos favoritos aún." : undefined;
  const hasLocalFilter: boolean = localQ.trim().length > 0;

  const renderProductList: () => JSX.Element = () => {
    if (filteredProducts.length === 0) {
      const message: string = hasLocalFilter ? `No se encontraron productos para "${localQ}".` : (emptyMessage ?? "No hay productos disponibles.");
      return (
        <Alert className="d-flex align-items-center gap-2" variant="info">
          <span>{message}</span>
          {hasLocalFilter && (
            <Button aria-label="Limpiar filtro de búsqueda" className="ms-auto" onClick={() => setLocalQ("")} size="sm" variant="outline-secondary">
              <FaTimes aria-hidden="true" className="me-1" />
              Limpiar filtro
            </Button>
          )}
        </Alert>
      );
    }
    return (
      <div className={styles.fadeIn}>
        <ProductGrid products={filteredProducts} />
      </div>
    );
  };

  return (
    <Container className="py-4">
      <HelmetMeta description={pageDescription ?? undefined} title={pageTitle ? `Talento Tech | ${pageTitle}` : "Talento Tech"} />
      {loading ? (
        <div aria-busy="true" className="d-flex justify-content-center py-5">
          <div aria-hidden="true" className="spinner-border" />
          <output aria-live="polite" className="visually-hidden">
            Cargando...
          </output>
        </div>
      ) : (
        <>
          <SearchBar localQ={localQ ?? ""} onLocalQChange={setLocalQ} productCount={filteredProducts.length} />
          {renderProductList()}

          <LoadMoreSection hasMore={hasMore} itemsPerPage={ITEMS_PER_PAGE} loadingMore={loadingMore} onLoadMore={loadNextPage} onReload={reloadProducts} productCount={filteredProducts.length} />
        </>
      )}
    </Container>
  );
};

export default Home;