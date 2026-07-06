import React, { useMemo } from "react";
import { FaFolder } from "react-icons/fa";

import type { Category } from "../../../models";

import useCategories from "../../../hooks/selectors/useCategories";
import useProducts from "../../../hooks/selectors/useProducts";
import DashboardCard from "./DashboardCard";
import ProgressBarRow from "./ProgressBarRow";

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

  return (
    <DashboardCard icon={<FaFolder />} iconColor="primary" title="Productos por Categoría">
      {categoryData.length === 0 ? (
        <div className="text-center text-muted py-4">No hay productos o categorías registrados</div>
      ) : (
        categoryData.map((row: CategoryRow, index: number) => {
          const { categoryName, count, percentage } = row;
          const color: string = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
          return (
            <ProgressBarRow
              ariaLabel={`${categoryName}: ${percentage.toFixed(1)}%`}
              color={color}
              key={categoryName}
              label={<strong>{categoryName}</strong>}
              percent={percentage}
              rightText={`${count} (${percentage.toFixed(1)}%)`}
            />
          );
        })
      )}
    </DashboardCard>
  );
};

export default ProductsByCategory;
