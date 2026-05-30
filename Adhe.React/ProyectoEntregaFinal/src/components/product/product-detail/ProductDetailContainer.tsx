import React, { useCallback } from "react";
import { useNavigate, useParams, type NavigateFunction } from "react-router-dom";

import type { Product } from "../../../models";
import type { Tag } from "../../../models/Tag";

import { useCart } from "../../../hooks/useCart";
import useCategories from "../../../hooks/useCategories";
import { useNotification } from "../../../hooks/useNotification";
import { useProducts } from "../../../hooks/useProducts";
import useTags from "../../../hooks/useTags";
import ProductDetail from "./ProductDetail";

const ProductDetailContainer: React.FC = () => {
  const { addToCart } = useCart();
  const { setNotification } = useNotification();

  const { id } = useParams();
  const { findById } = useProducts();
  const { findById: findCategory } = useCategories();
  const { findById: findTag } = useTags();

  const handleAdd: (p: Product, cantidad?: number) => void = useCallback(
    (p: Product, cantidad = 1) => {
      addToCart(p, cantidad);
      setNotification(`${p.name} fue agregado al carrito`, 3000, "success");
    },
    [addToCart, setNotification],
  );

  const navigate: NavigateFunction = useNavigate();
  const handleBack: () => void | Promise<void> = useCallback(() => navigate(-1), [navigate]);

  const pid: string | undefined = id;
  const product: Product | undefined = pid ? findById(pid) : undefined;

  if (!product) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning">Producto no encontrado.</div>
      </div>
    );
  }

  const categoryName: string | undefined = product?.categoryId ? findCategory(product.categoryId)?.name : undefined;
  const tags: Tag[] | undefined = product?.tagIds ? (product.tagIds.map((t) => findTag(t)).filter(Boolean) as Tag[]) : undefined;

  return <ProductDetail categoryName={categoryName} onAddToCart={handleAdd} onBack={handleBack} product={product} tags={tags} />;
};

export default ProductDetailContainer;
