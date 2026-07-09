import React from "react";
import { Link } from "react-router-dom";

import type { Coupon, Order, Product, Category } from "../../models";

import HelmetMeta from "../ui/HelmetMeta";
import LoadingSpinner from "../ui/LoadingSpinner";
import PageHeader from "../ui/PageHeader";
import RefreshButton from "../ui/RefreshButton";
import AverageTicketByCurrency from "./dashboard/AverageTicketByCurrency";
import CouponInsights from "./dashboard/CouponInsights";
import DiscountsByCurrency from "./dashboard/DiscountsByCurrency";
import InventoryByCurrency from "./dashboard/InventoryByCurrency";
import MonthlyTrends from "./dashboard/MonthlyTrends";
import OrderStatusBreakdown from "./dashboard/OrderStatusBreakdown";
import ProductsByCategory from "./dashboard/ProductsByCategory";
import RecentOrders from "./dashboard/RecentOrders";
import RevenueByCurrency from "./dashboard/RevenueByCurrency";
import StockAlerts from "./dashboard/StockAlerts";
import TopProducts from "./dashboard/TopProducts";

interface Metric {
  icon: React.ReactNode;
  label: string;
  value: string;
  link?: string;
  subtitle?: string;
  variant?: "primary" | "success" | "warning" | "danger" | "info";
}

interface AdminDashboardViewProps {
  categories: Category[];
  coupons: Coupon[];
  loading: boolean;
  metrics: Metric[];
  orders: Order[];
  products: Product[];
  rates: Record<string, number>;
  onRefresh: () => void;
}

const VARIANT_MAP: Record<string, { bg: string; text: string; border: string }> = {
  primary: { bg: "bg-cta/10", text: "text-cta", border: "border-cta" },
  success: { bg: "bg-success/10", text: "text-success", border: "border-success" },
  warning: { bg: "bg-warning/10", text: "text-warning", border: "border-warning" },
  danger: { bg: "bg-danger/10", text: "text-danger", border: "border-danger" },
  info: { bg: "bg-accent/10", text: "text-accent", border: "border-accent" },
};

const AdminDashboardView: React.FC<AdminDashboardViewProps> = (props) => {
  const { categories, coupons, loading, metrics, orders, products, rates, onRefresh } = props;

  if (loading) {
    return <LoadingSpinner message="Cargando dashboard..." />;
  }

  return (
    <div>
      <HelmetMeta description="Panel de administración de Talento Tech." title="Admin | Talento Tech" />
      <PageHeader className="mb-4" headingTag="h3" title="Dashboard">
        <RefreshButton loading={loading} onRefresh={onRefresh} />
      </PageHeader>
      <div className="grid grid-cols-12 gap-3 items-stretch">
        {metrics.map((m: Metric) => {
          const vs: { bg: string; text: string; border: string } | undefined = m.variant ? VARIANT_MAP[m.variant] : undefined;
          return (
            <div className="col-span-12 sm:col-span-6 lg:col-span-3" key={m.label}>
              <div className={`bg-white rounded-xl shadow-sm h-full flex items-center p-5 gap-5 relative overflow-hidden${vs ? " border " + vs.border : ""}`}>
                <div className={`flex items-center justify-center rounded-full shrink-0 w-16 h-16 text-3xl ${vs?.bg ?? "bg-accent/10"} ${vs?.text ?? "text-accent"}`}>{m.icon}</div>
                <div className="min-w-0">
                  <div className="text-2xl font-bold leading-none text-gray-900">{m.value}</div>
                  <div className="text-sm text-gray-500 mt-1.5">{m.label}</div>
                  {m.subtitle && <div className="text-xs text-gray-500/75 mt-1 line-clamp-2">{m.subtitle}</div>}
                </div>
                {m.link && <Link aria-label={`Ir a ${m.label}`} className="absolute inset-0" to={m.link} />}
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-12 gap-3 mt-4">
        <div className="col-span-12 lg:col-span-6">
          <RevenueByCurrency orders={orders} />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <OrderStatusBreakdown orders={orders} />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-3 mt-3">
        <div className="col-span-12 lg:col-span-6">
          <ProductsByCategory categories={categories} products={products} />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <RecentOrders orders={orders} />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-3 mt-3">
        <div className="col-span-12 lg:col-span-6">
          <StockAlerts products={products} />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <CouponInsights coupons={coupons} />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-3 mt-3">
        <div className="col-span-12 lg:col-span-6">
          <InventoryByCurrency products={products} rates={rates} />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <DiscountsByCurrency orders={orders} />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-3 mt-3">
        <div className="col-span-12 lg:col-span-6">
          <AverageTicketByCurrency orders={orders} />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-3 mt-3">
        <div className="col-span-12 lg:col-span-6">
          <TopProducts orders={orders} />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <MonthlyTrends orders={orders} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardView;
