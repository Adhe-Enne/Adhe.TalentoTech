import React, { useCallback } from "react";
import { useNavigate, useParams, type NavigateFunction } from "react-router-dom";

import type { Product } from "../../../models";
import type { Tag } from "../../../models/Tag";

import useCart from "../../../hooks/useCart";
import useCategories from "../../../hooks/useCategories";
import useNotification from "../../../hooks/useNotification";
import { useProduct } from "../../../hooks/useProduct";
import useProducts from "../../../hooks/useProducts";
import useTags from "../../../hooks/useTags";
import ProductDetail from "./ProductDetail";

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
                  <span className="placeholder col-12" style={{ height: 300, borderRadius: 8 }} />
                </div>
              </div>
              <div className="col-12 col-md-5">
                <div className="placeholder-glow mb-3">
                  <span className="placeholder col-8" style={{ height: 28 }} />
                </div>
                <div className="placeholder-glow mb-2">
                  <span className="placeholder col-4" style={{ height: 16 }} />
                </div>
                <div className="placeholder-glow mb-3">
                  <span className="placeholder col-12" style={{ height: 48 }} />
                </div>
                <div className="placeholder-glow mb-3">
                  <span className="placeholder col-3" style={{ height: 32, borderRadius: 999 }} />
                </div>
                <div className="placeholder-glow">
                  <span className="placeholder col-5" style={{ height: 38 }} />
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
  const tags: Tag[] | undefined = product?.tagIds ? (product.tagIds.map((t) => findTag(t)).filter(Boolean) as Tag[]) : undefined;

  return <ProductDetail categoryName={categoryName} onAddToCart={handleAddToCart} onBack={handleBack} product={product} tags={tags} />;
};

export default ProductDetailContainer;
