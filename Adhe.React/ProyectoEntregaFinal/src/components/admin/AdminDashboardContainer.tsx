import React from "react";

import useAsyncCollection from "../../hooks/useAsyncCollection";
import useProducts from "../../hooks/useProducts";
import { couponService } from "../../services/couponService";
import AdminDashboard from "./AdminDashboard";

const AdminDashboardContainer: React.FC = () => {
  const { products, loading: productsLoading } = useProducts();
  const { data: coupons, loading: couponsLoading } = useAsyncCollection(() => couponService.fetchCoupons());

  const totalProducts: number = products?.length ?? 0;
  const activeProducts: number = products?.filter((p) => p.isEnabled).length ?? 0;
  const totalCoupons: number = coupons.length;
  const activeCoupons: number = coupons.filter((c) => c.isEnabled).length;

  return (
    <AdminDashboard
      activeCoupons={activeCoupons}
      activeProducts={activeProducts}
      loading={productsLoading || couponsLoading}
      totalCoupons={totalCoupons}
      totalProducts={totalProducts}
    />
  );
};

export default AdminDashboardContainer;
