import React, { type JSX } from "react";
import { Routes, Route } from "react-router-dom";

import { FavoritesProvider } from "../contexts/Favorites/Favorites.Provider";
import { NotificationProvider } from "../contexts/Notification/Notification.Provider";
import { ProductsProvider } from "../contexts/Products/Products.Provider";
import { useCart } from "../hooks/useCart";
import CartContainer from "./cart/CartContainer";
import Contacto from "./contact/Contact";
import HomeContainer from "./home/HomeContainer";
import NotificationBar from "./home/NotificationBar";
import Layout from "./layout/Layout";
import ProductDetailContainer from "./product/product-detail/ProductDetailContainer";
import NewProductContainerWrapper from "./product/product-form/NewProductContainerWrapper";

const Inicio: React.FC = (): JSX.Element => {
  const { getCartQuantity } = useCart();

  return (
    <div>
      <NotificationProvider>
        <FavoritesProvider>
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
              </Route>
            </Routes>
          </ProductsProvider>
        </FavoritesProvider>
      </NotificationProvider>
    </div>
  );
};

export default Inicio;
