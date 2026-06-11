import React, { lazy, Suspense, type JSX } from "react";
import { Navigate, Routes, Route } from "react-router-dom";

import { AuthProvider } from "../contexts/Auth/AuthProvider";
import CategoriesProvider from "../contexts/Categories/CategoriesProvider";
import CouponsProvider from "../contexts/Coupons/CouponsProvider";
import { FavoritesProvider } from "../contexts/Favorites/FavoritesProvider";
import { NotificationProvider } from "../contexts/Notification/NotificationProvider";
import { ProductsProvider } from "../contexts/Products/ProductsProvider";
import TagsProvider from "../contexts/Tags/TagsProvider";
import TeamProvider from "../contexts/Team/TeamProvider";
import GuestRoute from "./auth/GuestRoute";
import ProtectedRoute from "./auth/ProtectedRoute";
import CartContainer from "./cart/CartContainer";
import HomeContainer from "./home/HomeContainer";
import Layout from "./layout/Layout";
import HelmetMeta from "./ui/HelmetMeta";
import NotificationStack from "./ui/NotificationStack";

const AdminLayout: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./admin/AdminLayout"));
const AdminDashboardContainer: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./admin/AdminDashboardContainer"));
const ContactContainer: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./contact/ContactContainer"));
const TeamFullViewContainer: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./team/full-view/TeamFullViewContainer"));
const CreateProductFlow: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./admin/products/CreateProductFlow"));
const ProductDetailContainer: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./product/product-detail/ProductDetailContainer"));
const CouponManager: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./admin/coupons/CouponManagerContainer"));
const AdminProductListContainer: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./admin/products/AdminProductListContainer"));
const EditProductFlow: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./admin/products/EditProductFlow"));
const LoginContainer: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./auth/LoginContainer"));
const RegisterContainer: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./auth/RegisterContainer"));
const ProfileContainer: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./auth/ProfileContainer"));

const adminFallback: JSX.Element = <div className="text-center p-4">Cargando panel admin...</div>;
const pageFallback: JSX.Element = <div className="text-center p-4">Cargando...</div>;
const authFallback: JSX.Element = <div className="text-center p-4">Cargando...</div>;

const AppRoutes: React.FC = (): JSX.Element => {
  return (
    <div>
      <AuthProvider>
        <NotificationProvider>
          <FavoritesProvider>
            <CategoriesProvider>
              <TagsProvider>
                <ProductsProvider>
                  <TeamProvider>
                    <CouponsProvider>
                      <HelmetMeta description="Tienda de productos tecnológicos." title="Talento Tech" />
                      <NotificationStack />
                      <Routes>
                        <Route
                          element={
                            <GuestRoute>
                              <Suspense fallback={authFallback}>
                                <LoginContainer />
                              </Suspense>
                            </GuestRoute>
                          }
                          path="login"
                        />
                        <Route
                          element={
                            <GuestRoute>
                              <Suspense fallback={authFallback}>
                                <RegisterContainer />
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
                          <Route element={<HomeContainer />} index />
                          <Route element={<HomeContainer />} path="/" />
                          <Route element={<HomeContainer />} path="productos" />
                          <Route
                            element={
                              <Suspense fallback={pageFallback}>
                                <ContactContainer />
                              </Suspense>
                            }
                            path="contacto"
                          />
                          <Route element={<CartContainer />} path="carrito" />
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
                                <ProfileContainer />
                              </Suspense>
                            }
                            path="perfil"
                          />
                        </Route>

                        <Route
                          element={
                            <ProtectedRoute rolesPermitidos={["admin"]}>
                              <Suspense fallback={adminFallback}>
                                <AdminLayout />
                              </Suspense>
                            </ProtectedRoute>
                          }
                          path="admin"
                        >
                          <Route element={<AdminDashboardContainer />} index />
                          <Route element={<AdminProductListContainer />} path="productos" />
                          <Route
                            element={
                              <Suspense fallback={pageFallback}>
                                <CreateProductFlow />
                              </Suspense>
                            }
                            path="productos/nuevo"
                          />
                          <Route element={<CouponManager />} path="cupones" />
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
                    </CouponsProvider>
                  </TeamProvider>
                </ProductsProvider>
              </TagsProvider>
            </CategoriesProvider>
          </FavoritesProvider>
        </NotificationProvider>
      </AuthProvider>
    </div>
  );
};

export default AppRoutes;
