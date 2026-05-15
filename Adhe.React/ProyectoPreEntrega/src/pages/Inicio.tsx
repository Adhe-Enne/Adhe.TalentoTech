import React, { type JSX } from "react";
import { Routes, Route } from "react-router-dom";

import Contacto from "../components/contact/Contacto";
import Layout from "../components/layout/Layout";
import CarritoContainer from "../containers/CarritoContainer";
import HomeContainer from "../containers/HomeContainer";
import NewProductContainerWrapper from "../containers/NewProductContainerWrapper";
import NotificationBar from "../containers/NotificationBar";
import ProductDetailContainer from "../containers/ProductDetailContainer";
import { FavoritesProvider } from "../contexts/FavoritesContext";
import { NotificationProvider } from "../contexts/NotificationContext";
import { ProductsProvider } from "../contexts/ProductsContext";
import { useCart } from "../hooks/useCart";

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
