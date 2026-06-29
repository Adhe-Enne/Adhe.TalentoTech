import React, { useCallback } from "react";
import { useNavigate, useParams, type NavigateFunction } from "react-router-dom";

import type { Product, Tag } from "../../../models";

import useCart from "../../../hooks/selectors/useCart";
import useCategories from "../../../hooks/selectors/useCategories";
import useNotification from "../../../hooks/selectors/useNotification";
import { useProduct } from "../../../hooks/selectors/useProduct";
import useProducts from "../../../hooks/selectors/useProducts";
import useTags from "../../../hooks/selectors/useTags";
import ProductDetail from "./ProductDetail";
import styles from "./ProductDetail.module.css";

const ProductDetailContainer: React.FC = () => {
  const { id } = useParams();
  const product: Product | undefined = useProduct(id);
  const { loading } = useProducts();
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

  if (loading) {
    return (
      <div aria-busy="true" className="container py-4">
        <div aria-hidden="true" className="card">
          <div className="card-body p-4">
            <div className="row gx-4 gy-3">
              <div className="col-12 col-md-5">
                <div className="placeholder-glow">
                  <span className={`placeholder col-12 ${styles.skeletonImg}`} />
                </div>
              </div>
              <div className="col-12 col-md-5">
                <div className="placeholder-glow mb-3">
                  <span className={`placeholder col-8 ${styles.skeletonTitle}`} />
                </div>
                <div className="placeholder-glow mb-2">
                  <span className={`placeholder col-4 ${styles.skeletonText}`} />
                </div>
                <div className="placeholder-glow mb-3">
                  <span className={`placeholder col-12 ${styles.skeletonDesc}`} />
                </div>
                <div className="placeholder-glow mb-3">
                  <span className={`placeholder col-3 ${styles.skeletonBadge}`} />
                </div>
                <div className="placeholder-glow">
                  <span className={`placeholder col-5 ${styles.skeletonBtn}`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning">Producto no encontrado.</div>
      </div>
    );
  }

  const categoryName: string | undefined = product?.categoryId ? findCategory(product.categoryId)?.name : undefined;
  const tags: Tag[] | undefined = product?.tagIds ? product.tagIds.map((t) => findTag(t)).filter((t): t is Tag => t != null) : undefined;

  return <ProductDetail categoryName={categoryName} onAddToCart={handleAddToCart} onBack={handleBack} product={product} tags={tags} />;
};

export default ProductDetailContainer;
