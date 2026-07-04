import { useCallback } from "react";

import type { Product } from "../models";

import useCart from "./selectors/useCart";
import useNotification from "./selectors/useNotification";

const useCartActions: () => { increment: (product: Product) => void; decrement: (product: Product) => void } = () => {
  const { getCantidadActual, updateQuantity, removeFromCart } = useCart();
  const { setNotification } = useNotification();

  const increment: (product: Product) => void = useCallback(
    (product: Product): void => {
      const current: number = getCantidadActual(product.id);
      if (current >= product.stock) {
        setNotification(`Stock maximo alcanzado para ${product.name}`, 3000, "warning");
        return;
      }
      updateQuantity(product.id, current + 1);
      setNotification(`${product.name}: +1 unidad`, 2000, "info");
    },
    [getCantidadActual, setNotification, updateQuantity],
  );

  const decrement: (product: Product) => void = useCallback(
    (product: Product): void => {
      const current: number = getCantidadActual(product.id);
      if (current <= 1) {
        removeFromCart(product.id);
        setNotification(`${product.name} eliminado del carrito`, 2000, "info");
        return;
      }
      updateQuantity(product.id, current - 1);
      setNotification(`${product.name}: -1 unidad`, 2000, "info");
    },
    [getCantidadActual, removeFromCart, setNotification, updateQuantity],
  );

  return { increment, decrement };
};

export default useCartActions;
