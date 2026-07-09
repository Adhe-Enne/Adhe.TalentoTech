import React, { useCallback, useState } from "react";
import { FaArrowLeft, FaShoppingCart } from "react-icons/fa";

import type { Product } from "../../../models";
import type { Tag } from "../../../models/Tag";

import { formatPrice } from "../../../utils/format";
import HelmetMeta from "../../ui/HelmetMeta";
import QuantityStepper from "../../ui/QuantityStepper";
import RefreshButton from "../../ui/RefreshButton";
import ProductImageCarousel from "./ProductImageCarousel";

interface ProductDetailViewProps {
  loading: boolean;
  product: Product;
  categoryName?: string;
  tags?: Tag[];
  onAddToCart: (cantidad: number) => void;
  onBack: () => void;
  onRefresh: () => void;
}

const ProductDetailView: React.FC<ProductDetailViewProps> = (props) => {
  const { categoryName, loading, onAddToCart, onBack, onRefresh, product, tags } = props;
  const [cantidad, setCantidad] = useState<number>(1);
  const { images, stock } = product;

  const handleIncrement: () => void = useCallback(() => {
    setCantidad((prev) => Math.min(prev + 1, stock));
  }, [stock]);

  const handleDecrement: () => void = useCallback(() => {
    setCantidad((prev) => Math.max(1, prev - 1));
  }, []);

  const handleAdd: () => void = useCallback(() => {
    onAddToCart(cantidad);
  }, [cantidad, onAddToCart]);

  return (
    <>
      <HelmetMeta description={`${product.name} — ${(product.description ?? "Producto disponible en Talento Tech").slice(0, 160)}`} title={`${product.name} | Talento Tech`} />
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-12 gap-3 justify-center product-detail">
          <div className="col-span-12 md:col-span-5">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <ProductImageCarousel alt={product.name} images={[product.image, ...(images ?? [])]} />
            </div>
          </div>
          <div className="col-span-12 md:col-span-5">
            <div className="flex justify-between items-start">
              <h2>{product.name}</h2>
              <RefreshButton loading={loading} onRefresh={onRefresh} />
            </div>
            {categoryName && (
              <div className="mb-2">
                <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium border border-gray-200">
                  <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 7h.01M7 3h5a1.99 1.99 0 011.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  {categoryName}
                </span>
              </div>
            )}

            <div className="h-48 overflow-y-auto mb-3 pr-2 text-gray-500 whitespace-pre-line">{product.description ?? "Sin descripción"}</div>

            <div className="mb-3">
              <div className="inline-flex items-baseline gap-1.5 bg-accent/10 text-accent px-4 py-2.5 rounded-xl border border-accent/20">
                <span className="text-sm font-medium opacity-80">Precio:</span>
                <span className="text-2xl font-bold tracking-tight">{formatPrice(product.price, product.currency)}</span>
              </div>
            </div>

            <div className="mb-2">
              {stock > 0 ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success text-white">{stock} en stock</span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-danger text-white">Sin stock</span>
              )}
            </div>

            {tags && tags.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1">
                {tags.map((t) => (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-600 text-white" key={t.id}>
                    {t.name}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 mt-3">
              <span className="mb-0">Cantidad:</span>
              <QuantityStepper max={stock} min={1} onDecrement={handleDecrement} onIncrement={handleIncrement} size="md" value={cantidad} />
              {stock <= 0 ? (
                <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50" disabled>
                  Sin stock
                </button>
              ) : (
                <button aria-label={`Agregar ${product.name} al carrito`} className="bg-accent text-white px-4 py-2 rounded-lg hover:opacity-90 inline-flex items-center gap-2" onClick={handleAdd}>
                  <FaShoppingCart /> Añadir al carrito
                </button>
              )}
            </div>

            <div className="mt-3">
              <button aria-label="Volver a productos" className="inline-flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg hover:opacity-90" onClick={onBack}>
                <FaArrowLeft /> Volver
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailView;
