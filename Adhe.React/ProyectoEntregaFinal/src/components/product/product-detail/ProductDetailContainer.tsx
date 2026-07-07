import React, { useCallback } from "react";
import { useNavigate, useParams, type NavigateFunction } from "react-router-dom";

import type { Product, Tag } from "../../../models";

import useCart from "../../../hooks/selectors/useCart";
import useCategories from "../../../hooks/selectors/useCategories";
import useNotification from "../../../hooks/selectors/useNotification";
import { useProduct } from "../../../hooks/selectors/useProduct";
import useProducts from "../../../hooks/selectors/useProducts";
import useTags from "../../../hooks/selectors/useTags";
import ProductDetailSkeleton from "./ProductDetailSkeleton";
import ProductDetailView from "./ProductDetailView";

const ProductDetailContainer: React.FC = () => {
  const { id } = useParams();
  const product: Product | undefined = useProduct(id);
  const { loading, reload } = useProducts();
  const { findById: findCategory } = useCategories();
  const { findById: findTag } = useTags();
  const { addToCart } = useCart();
  const { setNotification } = useNotification();
  const navigate: NavigateFunction = useNavigate();

  const handleAddToCart: (cantidad: number) => void = useCallback(
    (cantidad: number) => {
      if (!product) {
        return;
      }
      if (product.stock <= 0) {
        setNotification("Producto sin stock", 3000, "warning");
        return;
      }
      addToCart(product, cantidad);
      setNotification(`${product.name} fue agregado al carrito`, 3000, "success");
    },
    [addToCart, product, setNotification],
  );

  const handleBack: () => void = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const handleRefresh: () => void = useCallback((): void => {
    reload();
  }, [reload]);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning" role="alert">Producto no encontrado.</div>
      </div>
    );
  }

  const categoryName: string | undefined = product?.categoryId ? findCategory(product.categoryId)?.name : undefined;
  const tags: Tag[] | undefined = product?.tagIds ? product.tagIds.map((t) => findTag(t)).filter((t): t is Tag => t != null) : undefined;

  return <ProductDetailView categoryName={categoryName} loading={loading} onAddToCart={handleAddToCart} onBack={handleBack} onRefresh={handleRefresh} product={product} tags={tags} />;
};

export default ProductDetailContainer;
