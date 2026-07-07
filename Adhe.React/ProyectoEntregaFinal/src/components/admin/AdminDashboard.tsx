import React, { useCallback, useEffect, useState } from "react";

import type { Order } from "../../models";

import useCategories from "../../hooks/selectors/useCategories";
import useCoupons from "../../hooks/selectors/useCoupons";
import useProducts from "../../hooks/selectors/useProducts";
import { useAllExchangeRates } from "../../hooks/useAllExchangeRates";
import useDashboardMetrics from "../../hooks/useDashboardMetrics";
import { useErrorNotification } from "../../hooks/useErrorNotification";
import useOrders from "../../hooks/useOrders";
import AdminDashboardView from "./AdminDashboardView";

const AdminDashboard: React.FC = () => {
  const { products, loading: productsLoading, reload } = useProducts();
  const { categories } = useCategories();
  const { coupons, loading: couponsLoading, fetchCoupons } = useCoupons();
  const { error, fetchAllOrders } = useOrders();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { rates } = useAllExchangeRates();

  useErrorNotification(error);

  useEffect((): (() => void) => {
    let cancelled: boolean = false;
    fetchAllOrders()
      .then((data: Order[]) => {
        if (!cancelled) {
          setOrders(data);
          setOrdersLoading(false);
        }
      })
      .catch((): void => {
        if (!cancelled) {
          setOrdersLoading(false);
        }
      });
    return (): void => {
      cancelled = true;
    };
  }, [fetchAllOrders]);

  const handleRefresh: () => void = useCallback((): void => {
    setRefreshing(true);
    reload();
    void fetchCoupons();
    fetchAllOrders()
      .then(setOrders)
      .catch((): void => {
        /* error contemplado con useErrorNotification */
      })
      .finally((): void => {
        setRefreshing(false);
      });
  }, [reload, fetchCoupons, fetchAllOrders]);

  const loading: boolean = productsLoading || couponsLoading || ordersLoading || refreshing;

  const { metrics } = useDashboardMetrics(products, coupons, orders, rates);

  return (
    <AdminDashboardView
      categories={categories}
      coupons={coupons}
      loading={loading}
      metrics={metrics}
      onRefresh={handleRefresh}
      orders={orders}
      products={products}
      rates={rates}
    />
  );
};

export default AdminDashboard;
