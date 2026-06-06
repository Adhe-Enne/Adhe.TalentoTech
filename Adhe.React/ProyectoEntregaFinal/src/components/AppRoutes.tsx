import React, { lazy, Suspense, type JSX } from "react";
import { Routes, Route } from "react-router-dom";

import CategoriesProvider from "../contexts/Categories/CategoriesProvider";
import CouponsProvider from "../contexts/Coupons/CouponsProvider";
import { FavoritesProvider } from "../contexts/Favorites/FavoritesProvider";
import { NotificationProvider } from "../contexts/Notification/NotificationProvider";
import { ProductsProvider } from "../contexts/Products/ProductsProvider";
import TagsProvider from "../contexts/Tags/TagsProvider";
import TeamProvider from "../contexts/Team/TeamProvider";
import CartContainer from "./cart/CartContainer";
import HomeContainer from "./home/HomeContainer";
import NotificationStack from "./home/NotificationStack";
import Layout from "./layout/Layout";

const AdminLayout: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./admin/AdminLayout"));
const AdminDashboardContainer: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./admin/AdminDashboardContainer"));
const ContactPage: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./contact/Contact"));
const TeamFullViewContainer: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./contact/full-view/TeamFullViewContainer"));
const CreateProductFlow: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./product/new-product/CreateProductFlow"));
const ProductDetailContainer: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./product/product-detail/ProductDetailContainer"));
const CouponManager: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./admin/coupons/CouponManager"));
const AdminProductListContainer: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./admin/products/AdminProductListContainer"));
const EditProductFlow: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./product/edit-product/EditProductFlow"));

const adminFallback: JSX.Element = <div className="text-center p-4">Cargando panel admin...</div>;
const pageFallback: JSX.Element = <div className="text-center p-4">Cargando...</div>;

const AppRoutes: React.FC = (): JSX.Element => {
  return (
    <div>
      <NotificationProvider>
        <FavoritesProvider>
          <CategoriesProvider>
            <TagsProvider>
              <ProductsProvider>
                <TeamProvider>
                  <CouponsProvider>
                    <NotificationStack />
                    <Routes>
                      <Route element={<Layout />}>
                        <Route element={<HomeContainer />} index />
                        <Route element={<HomeContainer />} path="home" />
                        <Route element={<HomeContainer />} path="/" />
                        <Route element={<HomeContainer />} path="productos" />
                        <Route
                          element={
                            <Suspense fallback={pageFallback}>
                              <ContactPage />
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
                              <CreateProductFlow />
                            </Suspense>
                          }
                          path="new"
                        />
                        <Route
                          element={
                            <Suspense fallback={pageFallback}>
                              <TeamFullViewContainer />
                            </Suspense>
                          }
                          path="equipo"
                        />
                      </Route>

                      <Route
                        element={
                          <Suspense fallback={adminFallback}>
                            <AdminLayout />
                          </Suspense>
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
                    </Routes>
                  </CouponsProvider>
                </TeamProvider>
              </ProductsProvider>
            </TagsProvider>
          </CategoriesProvider>
        </FavoritesProvider>
      </NotificationProvider>
    </div>
  );
};

export default AppRoutes;
