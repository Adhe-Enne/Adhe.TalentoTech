import React, { type JSX } from "react";
import { Routes, Route } from "react-router-dom";

import { FavoritesProvider } from "../contexts/FavoritesContext";
import { NotificationProvider } from "../contexts/NotificationContext";
import { ProductsProvider } from "../contexts/ProductsContext";
import { useCart } from "../hooks/useCart";
import CarritoContainer from "./cart/CarritoContainer";
import Contacto from "./contact/Contacto";
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
                <Route element={<HomeContainer />} path="productos" />
                <Route element={<Contacto />} path="contacto" />
                <Route element={<CarritoContainer />} path="carrito" />
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
