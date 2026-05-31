import React, { type JSX } from "react";
import { Routes, Route } from "react-router-dom";

import CategoriesProvider from "../contexts/Categories/Categories.Provider";
import { FavoritesProvider } from "../contexts/Favorites/Favorites.Provider";
import { NotificationProvider } from "../contexts/Notification/Notification.Provider";
import { ProductsProvider } from "../contexts/Products/ProductsProvider";
import TagsProvider from "../contexts/Tags/TagsProvider";
import { useCart } from "../hooks/useCart";
import CartContainer from "./cart/CartContainer";
import Contacto from "./contact/Contact";
import DirectoryFullContainer from "./contact/full-view/DirectoryFullContainer";
import HomeContainer from "./home/HomeContainer";
import NotificationBar from "./home/NotificationBar";
import Layout from "./layout/Layout";
import NewProductContainerWrapper from "./product/new-product/NewProductContainerWrapper";
import ProductDetailContainer from "./product/product-detail/ProductDetailContainer";

const AppRoutes: React.FC = (): JSX.Element => {
  const { getCartQuantity } = useCart();

  return (
    <div>
      <NotificationProvider>
        <FavoritesProvider>
          <CategoriesProvider>
            <TagsProvider>
              <ProductsProvider>
                <NotificationBar />
                <Routes>
                  <Route element={<Layout cartCount={getCartQuantity()} />}>
                    <Route element={<HomeContainer />} index />
                    <Route element={<HomeContainer />} path="home" />
                    <Route element={<HomeContainer />} path="/" />
                    <Route element={<HomeContainer />} path="productos" />
                    <Route element={<Contacto />} path="contacto" />
                    <Route element={<CartContainer />} path="carrito" />
                    <Route element={<ProductDetailContainer />} path="producto/:id" />
                    <Route element={<NewProductContainerWrapper />} path="new" />
                    <Route element={<DirectoryFullContainer />} path="equipo" />
                  </Route>
                </Routes>
              </ProductsProvider>
            </TagsProvider>
          </CategoriesProvider>
        </FavoritesProvider>
      </NotificationProvider>
    </div>
  );
};

export default AppRoutes;
