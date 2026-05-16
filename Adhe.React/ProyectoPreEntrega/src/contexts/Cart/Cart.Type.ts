import type { CartItem, Product } from "../../models";

export type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product, cantidad?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, cantidad: number) => void;
  clearCart: () => void;
  getCartQuantity: () => number;
  getCartTotal: () => number;
};
