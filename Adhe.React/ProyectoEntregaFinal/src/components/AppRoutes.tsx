import React, { lazy, Suspense, type JSX } from "react";
import { Navigate, Routes, Route } from "react-router-dom";

import AppProviders from "./AppProviders";
import AuthGuard from "./auth/guards/AuthGuard";
import Cart from "./cart/Cart";
import CheckoutContainer from "./checkout/CheckoutContainer";
import Home from "./home/Home";
import Layout from "./layout/Layout";
import HelmetMeta from "./ui/HelmetMeta";

const AdminLayout: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./admin/AdminLayout"));
const AdminDashboard: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./admin/AdminDashboard"));
const AdminOrderList: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./admin/orders/AdminOrderListContainer"));
const AdminProductList: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./admin/products/AdminProductList"));
const ContactPage: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./contact/ContactPage"));
const CouponManager: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./admin/coupons/CouponManagerPage"));
const Login: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./auth/login/Login"));
const OrderConfirmationContainer: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./orders/OrderConfirmationContainer"));
const OrderHistoryContainer: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./orders/OrderHistoryContainer"));
const ProductDetailContainer: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./product/product-detail/ProductDetailContainer"));
const ProductFormFlowContainer: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./admin/products/ProductFormFlowContainer"));
const Profile: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./auth/profile/Profile"));
const Register: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./auth/register/Register"));
const TeamFullView: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./team/full-view/TeamFullView"));

const pageFallback: JSX.Element = <div className="text-center p-4">Cargando...</div>;
const adminFallback: JSX.Element = <div className="text-center p-4">Cargando panel admin...</div>;

interface LazyRouteProps {
  component: React.LazyExoticComponent<React.ComponentType>;
  fallback?: JSX.Element;
}

const LazyRoute: React.FC<LazyRouteProps> = (props) => {
  const { component: Component, fallback = pageFallback } = props;
  return (
    <Suspense fallback={fallback}>
      <Component />
    </Suspense>
  );
};

const AppRoutes: React.FC = (): JSX.Element => {
  return (
    <AppProviders>
      <HelmetMeta description="Tienda de productos tecnológicos." title="Talento Tech" />
      <Routes>
        <Route
          element={
            <AuthGuard mode="guest">
              <LazyRoute component={Login} />
            </AuthGuard>
          }
          path="login"
        />
        <Route
          element={
            <AuthGuard mode="guest">
              <LazyRoute component={Register} />
            </AuthGuard>
          }
          path="registro"
        />

        <Route
          element={
            <AuthGuard mode="protected">
              <Layout />
            </AuthGuard>
          }
        >
          <Route element={<Home />} index />
          <Route element={<Home />} path="/" />
          <Route element={<Home />} path="productos" />
          <Route element={<LazyRoute component={ContactPage} />} path="contacto" />
          <Route element={<Cart />} path="carrito" />
          <Route element={<CheckoutContainer />} path="checkout" />
          <Route element={<LazyRoute component={OrderConfirmationContainer} />} path="orden/:id" />
          <Route element={<LazyRoute component={OrderHistoryContainer} />} path="mis-ordenes" />
          <Route element={<LazyRoute component={ProductDetailContainer} />} path="producto/:id" />
          <Route element={<LazyRoute component={TeamFullView} />} path="equipo" />
          <Route element={<LazyRoute component={Profile} />} path="perfil" />
        </Route>

        <Route
          element={
            <AuthGuard allowedRoles={["admin"]} mode="protected">
              <LazyRoute component={AdminLayout} fallback={adminFallback} />
            </AuthGuard>
          }
          path="admin"
        >
          <Route element={<AdminDashboard />} index />
          <Route element={<AdminProductList />} path="productos" />
          <Route element={<LazyRoute component={ProductFormFlowContainer} />} path="productos/nuevo" />
          <Route element={<CouponManager />} path="cupones" />
          <Route element={<AdminOrderList />} path="ordenes" />
          <Route element={<LazyRoute component={ProductFormFlowContainer} />} path="productos/:id/editar" />
        </Route>

        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </AppProviders>
  );
};

export default AppRoutes;
