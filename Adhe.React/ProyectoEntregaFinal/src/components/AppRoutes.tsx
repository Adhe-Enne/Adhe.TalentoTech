import React, { lazy, Suspense, type JSX } from "react";
import { Routes, Route } from "react-router-dom";

import CategoriesProvider from "../contexts/Categories/CategoriesProvider";
import { FavoritesProvider } from "../contexts/Favorites/FavoritesProvider";
import { NotificationProvider } from "../contexts/Notification/NotificationProvider";
import { ProductsProvider } from "../contexts/Products/ProductsProvider";
import TagsProvider from "../contexts/Tags/TagsProvider";
import TeamProvider from "../contexts/Team/TeamProvider";
import CartContainer from "./cart/CartContainer";
import HomeContainer from "./home/HomeContainer";
import NotificationStack from "./home/NotificationStack";
import Layout from "./layout/Layout";

const ContactPage: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./contact/Contact"));
const TeamFullViewContainer: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./contact/full-view/TeamFullViewContainer"));
const CreateProductFlow: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./product/new-product/CreateProductFlow"));
const ProductDetailContainer: React.LazyExoticComponent<React.ComponentType> = lazy(() => import("./product/product-detail/ProductDetailContainer"));

const AppRoutes: React.FC = (): JSX.Element => {
  return (
    <div>
      <NotificationProvider>
        <FavoritesProvider>
          <CategoriesProvider>
            <TagsProvider>
              <ProductsProvider>
                <TeamProvider>
                  <NotificationStack />
                  <Routes>
                    <Route element={<Layout />}>
                      <Route element={<HomeContainer />} index />
                      <Route element={<HomeContainer />} path="home" />
                      <Route element={<HomeContainer />} path="/" />
                      <Route element={<HomeContainer />} path="productos" />
                      <Route
                        element={
                          <Suspense fallback={<div className="text-center p-4">Cargando...</div>}>
                            <ContactPage />
                          </Suspense>
                        }
                        path="contacto"
                      />
                      <Route element={<CartContainer />} path="carrito" />
                      <Route
                        element={
                          <Suspense fallback={<div className="text-center p-4">Cargando...</div>}>
                            <ProductDetailContainer />
                          </Suspense>
                        }
                        path="producto/:id"
                      />
                      <Route
                        element={
                          <Suspense fallback={<div className="text-center p-4">Cargando...</div>}>
                            <CreateProductFlow />
                          </Suspense>
                        }
                        path="new"
                      />
                      <Route
                        element={
                          <Suspense fallback={<div className="text-center p-4">Cargando...</div>}>
                            <TeamFullViewContainer />
                          </Suspense>
                        }
                        path="equipo"
                      />
                    </Route>
                  </Routes>
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
