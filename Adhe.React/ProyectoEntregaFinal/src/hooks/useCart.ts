import { useContextSelector } from "use-context-selector";

import type { CartContextType } from "../contexts/Cart/CartType";

import CartContext from "../contexts/Cart/CartContext";

const useCart: () => CartContextType = (): CartContextType => {
  const cart: CartContextType["cart"] | undefined = useContextSelector(CartContext, (c) => c?.cart);
  const addToCart: CartContextType["addToCart"] | undefined = useContextSelector(CartContext, (c) => c?.addToCart);
  const removeFromCart: CartContextType["removeFromCart"] | undefined = useContextSelector(CartContext, (c) => c?.removeFromCart);
  const updateQuantity: CartContextType["updateQuantity"] | undefined = useContextSelector(CartContext, (c) => c?.updateQuantity);
  const clearCart: CartContextType["clearCart"] | undefined = useContextSelector(CartContext, (c) => c?.clearCart);
  const getCartQuantity: CartContextType["getCartQuantity"] | undefined = useContextSelector(CartContext, (c) => c?.getCartQuantity);
  const getCartTotal: CartContextType["getCartTotal"] | undefined = useContextSelector(CartContext, (c) => c?.getCartTotal);

  if (
    cart === undefined ||
    addToCart === undefined ||
    removeFromCart === undefined ||
    updateQuantity === undefined ||
    clearCart === undefined ||
    getCartQuantity === undefined ||
    getCartTotal === undefined
  ) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return { cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartQuantity, getCartTotal };
};

export default useCart;
