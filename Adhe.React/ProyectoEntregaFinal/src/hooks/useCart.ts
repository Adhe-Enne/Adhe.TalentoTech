import { useContext } from "react";

import type { CartContextType } from "../contexts/Cart/Cart.Type";

import CartContext from "../contexts/Cart/CartContext";
export const useCart: () => CartContextType = (): CartContextType => {
  const context: CartContextType | undefined = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
