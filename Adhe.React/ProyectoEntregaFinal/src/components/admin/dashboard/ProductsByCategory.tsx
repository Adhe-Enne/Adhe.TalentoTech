import React, { useMemo } from "react";
import { FaFolder } from "react-icons/fa";

import type { Category, Product } from "../../../models";

interface CategoryRow {
  categoryName: string;
  count: number;
  percentage: number;
}

interface ProductsByCategoryProps {
  categories: Category[];
  products: Product[];
}

const CATEGORY_COLORS: string[] = ["primary", "success", "info", "warning", "danger", "secondary", "dark"];

const ProductsByCategory: React.FC<ProductsByCategoryProps> = (props) => {
  const { products, categories } = props;

  const categoryData: CategoryRow[] = useMemo(() => {
    const categoryMap: Map<string, string> = new Map(categories.map((c: Category) => [c.id, c.name]));
    const counts: Record<string, number> = {};
    let uncategorized: number = 0;

    for (const product of products) {
      const catId: string | undefined = product.categoryId;
      if (catId) {
        counts[catId] = (counts[catId] ?? 0) + 1;
      } else {
        uncategorized++;
      }
    }

    const total: number = products.length;
    const rows: CategoryRow[] = Object.entries(counts)
      .map(([catId, count]: [string, number]) => ({
        categoryName: categoryMap.get(catId) ?? "Sin categoría",
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
      }))
      .sort((a: CategoryRow, b: CategoryRow) => b.count - a.count);

    if (uncategorized > 0) {
      rows.push({
        categoryName: "Sin categoría",
        count: uncategorized,
        percentage: total > 0 ? (uncategorized / total) * 100 : 0,
      });
    }

    return rows;
  }, [products, categories]);

  if (categoryData.length === 0) {
    return (
      <div className="card shadow-sm h-100">
        <div className="card-header bg-white d-flex align-items-center gap-2">
          <FaFolder className="text-primary" />
          <h5 className="mb-0">Productos por Categoría</h5>
        </div>
        <div className="card-body text-center text-muted py-4">No hay productos o categorías registrados</div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm h-100">
      <div className="card-header bg-white d-flex align-items-center gap-2">
        <FaFolder className="text-primary" />
        <h5 className="mb-0">Productos por Categoría</h5>
      </div>
      <div className="card-body">
        {categoryData.map(({ categoryName, count, percentage }: CategoryRow, index: number) => {
          const color: string = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
          return (
            <div className="mb-3" key={categoryName}>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span>
                  <strong>{categoryName}</strong>
                </span>
                <span className="text-muted small">
                  {count} ({percentage.toFixed(1)}%)
                </span>
              </div>
              <div aria-valuemax={100} aria-valuemin={0} aria-valuenow={Math.round(percentage)} className="progress" role="progressbar" style={{ height: 20 }}>
                <div className={`progress-bar bg-${color}`} style={{ width: `${percentage}%` }}>
                  {percentage > 8 && `${percentage.toFixed(1)}%`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductsByCategory;
