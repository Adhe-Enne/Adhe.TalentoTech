import React, { useMemo } from "react";
import { FaFolder } from "react-icons/fa";

import type { Category } from "../../../models";

import useCategories from "../../../hooks/selectors/useCategories";
import useProducts from "../../../hooks/selectors/useProducts";

interface CategoryRow {
  categoryName: string;
  count: number;
  percentage: number;
}

const CATEGORY_COLORS: string[] = ["primary", "success", "info", "warning", "danger", "secondary", "dark"];

const ProductsByCategory: React.FC = () => {
  const { products } = useProducts();
  const { categories } = useCategories();

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
        {categoryData.map((row: CategoryRow, index: number) => {
          const { categoryName, count, percentage } = row;
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
              <div className="progress" style={{ height: 20 }}>
                <div className={`progress-bar bg-${color}`} style={{ width: `${percentage}%` }}>
                  {percentage > 8 && `${percentage.toFixed(1)}%`}
                </div>
              </div>
              <progress aria-label={`${categoryName}: ${percentage.toFixed(1)}%`} className="visually-hidden" max={100} value={Math.round(percentage)} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductsByCategory;
