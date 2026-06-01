import React from "react";
import { useParams } from "react-router-dom";

import type { Product } from "../../../models";
import type { Tag } from "../../../models/Tag";

import useCategories from "../../../hooks/useCategories";
import { useProduct } from "../../../hooks/useProduct";
import useTags from "../../../hooks/useTags";
import ProductDetail from "./ProductDetail";

const ProductDetailContainer: React.FC = () => {
  const { id } = useParams();
  const product: Product | undefined = useProduct(id);
  const { findById: findCategory } = useCategories();
  const { findById: findTag } = useTags();

  if (!product) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning">Producto no encontrado.</div>
      </div>
    );
  }

  const categoryName: string | undefined = product?.categoryId ? findCategory(product.categoryId)?.name : undefined;
  const tags: Tag[] | undefined = product?.tagIds ? (product.tagIds.map((t) => findTag(t)).filter(Boolean) as Tag[]) : undefined;

  return <ProductDetail categoryName={categoryName} product={product} tags={tags} />;
};

export default ProductDetailContainer;
