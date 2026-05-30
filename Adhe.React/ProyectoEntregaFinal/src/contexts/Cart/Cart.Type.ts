import type { CartItem, Product } from "../../models";

export type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product, cantidad?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, cantidad: number) => void;
  clearCart: () => void;
  getCartQuantity: () => number;
  getCartTotal: () => number;
};
