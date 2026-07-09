import React from "react";
import { FaCartPlus, FaEye, FaHeart, FaRegHeart } from "react-icons/fa";

import type { Product } from "../../../models";

import { formatPrice } from "../../../utils/format";
import QuantityStepper from "../../ui/QuantityStepper";

interface ProductCardProps {
  currentQuantity: number;
  isFavorite: boolean;
  product: Product;
  onAddToCart: () => void;
  onDecrement: () => void;
  onIncrement: () => void;
  onNavigate: () => void;
  onToggleFavorite: () => void;
}

const ProductCard: React.FC<ProductCardProps> = (props) => {
  const { currentQuantity, isFavorite, product, onAddToCart, onDecrement, onIncrement, onNavigate, onToggleFavorite } = props;

  const outOfStock: boolean = product.stock <= 0;
  const inCart: boolean = currentQuantity > 0;

  return (
    <div className={`bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 flex flex-col h-full transition-all duration-150 hover:-translate-y-1 hover:shadow-md ${outOfStock ? "opacity-75" : ""}`}>
      <div className="relative w-full h-[200px]">
        <button aria-label={`Ver detalles de ${product.name}`} className="block w-full h-full relative cursor-pointer appearance-none bg-transparent border-0 p-0 text-left overflow-hidden" onClick={onNavigate} type="button">
          <img alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover blur-xl scale-110" loading="lazy" src={product.image} />
          <img alt={product.name} className="relative z-10 w-full h-full object-contain p-2" loading="lazy" src={product.image} />
          <div aria-hidden="true" className="absolute inset-0 z-[15] pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_50%,white_100%)]" />
          <span className="absolute top-2.5 left-2.5 z-20 bg-accent text-white py-1 px-2.5 rounded-md text-sm font-bold">{formatPrice(product.price, product.currency)}</span>
          {outOfStock && <span className="absolute bottom-0 left-0 right-0 z-20 bg-danger/85 text-white text-center py-1 text-sm font-semibold">Sin stock</span>}
        </button>

        <button
          aria-label={isFavorite ? "Eliminar favorito" : "Marcar favorito"}
          aria-pressed={isFavorite}
          className={`absolute top-2.5 right-2.5 z-30 w-10 h-10 rounded-full bg-white border-none inline-flex items-center justify-center shadow-sm cursor-pointer text-accent hover:bg-accent/5 [&[aria-pressed='true']]:bg-accent [&[aria-pressed='true']]:text-white`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          title={isFavorite ? "Eliminar favorito" : "Marcar favorito"}
          type="button"
        >
          {isFavorite ? <FaHeart aria-hidden="true" /> : <FaRegHeart aria-hidden="true" />}
        </button>
      </div>

      <div className="p-4 flex flex-col">
        <div className="min-h-[5rem]">
          <h5 className="text-lg font-semibold text-center line-clamp-2">{product.name}</h5>
          <div className="flex justify-center mt-1.5">
            {outOfStock ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-danger text-white">Sin stock</span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success text-white">{product.stock} en stock</span>
            )}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-3 mt-auto flex gap-2 justify-center items-center max-sm:flex-col">
          <button
            aria-label={`Ver detalle de ${product.name}`}
            className="inline-flex items-center gap-2 whitespace-nowrap bg-transparent border border-accent/70 text-accent px-3 py-1.5 rounded-lg text-sm hover:bg-accent/10 transition-all duration-150 hover:-translate-y-0.5"
            onClick={onNavigate}
          >
            <FaEye aria-hidden="true" /> Ver detalle
          </button>

          {!outOfStock && !inCart && (
            <button
              aria-label={`Agregar ${product.name} al carrito`}
              className="inline-flex items-center gap-2 bg-accent text-white px-3 py-1.5 rounded-lg text-sm font-semibold border-0 shadow-sm hover:shadow-md transition-all duration-150 hover:-translate-y-0.5 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2"
              onClick={onAddToCart}
            >
              <FaCartPlus />
              Añadir
            </button>
          )}

          {!outOfStock && inCart && <QuantityStepper max={product.stock} onDecrement={onDecrement} onIncrement={onIncrement} size="sm" value={currentQuantity} />}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
