import React, { useCallback } from "react";
import { useNavigate, useParams, type NavigateFunction } from "react-router-dom";

import type { Product } from "../../../models";

import { useCart } from "../../../hooks/useCart";
import { useNotification } from "../../../hooks/useNotification";
import { useProducts } from "../../../hooks/useProducts";
import DetalleProducto from "./DetalleProducto";

const ProductDetailContainer: React.FC = () => {
  const { addToCart } = useCart();
  const { setNotification } = useNotification();

  const { id } = useParams();
  const { findById } = useProducts();

  const handleAdd: (p: Product, cantidad?: number) => void = useCallback(
    (p: Product, cantidad = 1) => {
      addToCart(p, cantidad);
      setNotification(`${p.nombre} fue agregado al carrito`, 3000, "success");
    },
    [addToCart, setNotification],
  );

  const navigate: NavigateFunction = useNavigate();
  const handleBack: () => void | Promise<void> = useCallback(() => navigate(-1), [navigate]);

  const pid: number = Number(id);
  const product: Product | undefined = findById(pid);

  if (!product) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning">Producto no encontrado.</div>
      </div>
    );
  }

  return <DetalleProducto onAddToCart={handleAdd} onBack={handleBack} product={product} />;
};

export default ProductDetailContainer;
