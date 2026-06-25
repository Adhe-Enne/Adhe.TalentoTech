import React, { lazy, Suspense, type JSX } from "react";
import { Navigate, Routes, Route } from "react-router-dom";

import AppProviders from "./AppProviders";
import GuestRoute from "./auth/guards/GuestRoute";
import ProtectedRoute from "./auth/guards/ProtectedRoute";
import Cart from "./cart/Cart";
import CheckoutContainer from "./checkout/CheckoutContainer";
import Home from "./home/Home";
import Layout from "./layout/Layout";
import HelmetMeta from "./ui/HelmetMeta";
import NotificationStack from "./ui/NotificationStack";

const AdminLayout: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./admin/AdminLayout"));
const AdminDashboard: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./admin/AdminDashboard"));
const AdminOrderList: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./admin/orders/AdminOrderListContainer"));
const ContactPage: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./contact/ContactPage"));
const TeamFullViewContainer: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./team/full-view/TeamFullViewContainer"));
const CreateProductFlow: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./admin/products/CreateProductFlow"));
const ProductDetailContainer: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./product/product-detail/ProductDetailContainer"));
const CouponManager: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./admin/coupons/CouponManagerPage"));
const AdminProductList: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./admin/products/AdminProductList"));
const EditProductFlow: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./admin/products/EditProductFlow"));
const Login: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./auth/login/Login"));
const Register: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./auth/register/Register"));
const OrderConfirmationContainer: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./orders/OrderConfirmationContainer"));
const OrderHistoryContainer: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./orders/OrderHistoryContainer"));
const Profile: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./auth/profile/Profile"));

const adminFallback: JSX.Element = <div className="text-center p-4">Cargando panel admin...</div>;
const pageFallback: JSX.Element = <div className="text-center p-4">Cargando...</div>;

const AppRoutes: React.FC = (): JSX.Element => {
  return (
    <AppProviders>
      <HelmetMeta description="Tienda de productos tecnológicos." title="Talento Tech" />
      <NotificationStack />
      <Routes>
        <Route
          element={
            <GuestRoute>
              <Suspense fallback={pageFallback}>
                <Login />
              </Suspense>
            </GuestRoute>
          }
          path="login"
        />
        <Route
          element={
            <GuestRoute>
              <Suspense fallback={pageFallback}>
                <Register />
              </Suspense>
            </GuestRoute>
          }
          path="registro"
        />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route element={<Home />} index />
          <Route element={<Home />} path="/" />
          <Route element={<Home />} path="productos" />
          <Route
            element={
              <Suspense fallback={pageFallback}>
                <ContactPage />
              </Suspense>
            }
            path="contacto"
          />
          <Route element={<Cart />} path="carrito" />
          <Route element={<CheckoutContainer />} path="checkout" />
          <Route
            element={
              <Suspense fallback={pageFallback}>
                <OrderConfirmationContainer />
              </Suspense>
            }
            path="orden/:id"
          />
          <Route
            element={
              <Suspense fallback={pageFallback}>
                <OrderHistoryContainer />
              </Suspense>
            }
            path="mis-ordenes"
          />
          <Route
            element={
              <Suspense fallback={pageFallback}>
                <ProductDetailContainer />
              </Suspense>
            }
            path="producto/:id"
          />
          <Route
            element={
              <Suspense fallback={pageFallback}>
                <TeamFullViewContainer />
              </Suspense>
            }
            path="equipo"
          />
          <Route
            element={
              <Suspense fallback={pageFallback}>
                <Profile />
              </Suspense>
            }
            path="perfil"
          />
        </Route>

        <Route
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Suspense fallback={adminFallback}>
                <AdminLayout />
              </Suspense>
            </ProtectedRoute>
          }
          path="admin"
        >
          <Route element={<AdminDashboard />} index />
          <Route element={<AdminProductList />} path="productos" />
          <Route
            element={
              <Suspense fallback={pageFallback}>
                <CreateProductFlow />
              </Suspense>
            }
            path="productos/nuevo"
          />
          <Route element={<CouponManager />} path="cupones" />
          <Route element={<AdminOrderList />} path="ordenes" />
          <Route
            element={
              <Suspense fallback={pageFallback}>
                <EditProductFlow />
              </Suspense>
            }
            path="productos/:id/editar"
          />
        </Route>

        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </AppProviders>
  );
};

export default AppRoutes;
