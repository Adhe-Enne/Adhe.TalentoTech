import { useContextSelector } from "use-context-selector";

import type { CartContextType } from "../contexts/Cart/CartTypes";

import CartContext from "../contexts/Cart/CartContext";

const useCart: () => CartContextType = (): CartContextType => {
  const cart: CartContextType["cart"] | undefined = useContextSelector(CartContext, (c) => c?.cart);
  const appliedCoupon: CartContextType["appliedCoupon"] | undefined = useContextSelector(CartContext, (c) => c?.appliedCoupon);
  const discountedTotal: CartContextType["discountedTotal"] | undefined = useContextSelector(CartContext, (c) => c?.discountedTotal);
  const isApplyingCoupon: CartContextType["isApplyingCoupon"] | undefined = useContextSelector(CartContext, (c) => c?.isApplyingCoupon);
  const addToCart: CartContextType["addToCart"] | undefined = useContextSelector(CartContext, (c) => c?.addToCart);
  const removeFromCart: CartContextType["removeFromCart"] | undefined = useContextSelector(CartContext, (c) => c?.removeFromCart);
  const updateQuantity: CartContextType["updateQuantity"] | undefined = useContextSelector(CartContext, (c) => c?.updateQuantity);
  const clearCart: CartContextType["clearCart"] | undefined = useContextSelector(CartContext, (c) => c?.clearCart);
  const getCartQuantity: CartContextType["getCartQuantity"] | undefined = useContextSelector(CartContext, (c) => c?.getCartQuantity);
  const getCartTotal: CartContextType["getCartTotal"] | undefined = useContextSelector(CartContext, (c) => c?.getCartTotal);
  const getCantidadActual: CartContextType["getCantidadActual"] | undefined = useContextSelector(CartContext, (c) => c?.getCantidadActual);
  const isInCart: CartContextType["isInCart"] | undefined = useContextSelector(CartContext, (c) => c?.isInCart);
  const applyCoupon: CartContextType["applyCoupon"] | undefined = useContextSelector(CartContext, (c) => c?.applyCoupon);
  const removeCoupon: CartContextType["removeCoupon"] | undefined = useContextSelector(CartContext, (c) => c?.removeCoupon);

  if (
    cart === undefined ||
    addToCart === undefined ||
    removeFromCart === undefined ||
    updateQuantity === undefined ||
    clearCart === undefined ||
    getCartQuantity === undefined ||
    getCartTotal === undefined ||
    getCantidadActual === undefined ||
    isInCart === undefined ||
    appliedCoupon === undefined ||
    discountedTotal === undefined ||
    applyCoupon === undefined ||
    removeCoupon === undefined ||
    isApplyingCoupon === undefined
  ) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartQuantity,
    getCartTotal,
    getCantidadActual,
    isInCart,
    appliedCoupon,
    discountedTotal,
    applyCoupon,
    removeCoupon,
    isApplyingCoupon,
  };
};

export default useCart;
