import type { CartItem, Product } from "../../models";

export interface AppliedCoupon {
  code: string;
  discountValue: number;
  id: string;
}

export type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product, cantidad?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, cantidad: number) => void;
  clearCart: () => void;
  getCartQuantity: () => number;
  getCartTotal: () => number;
  getCantidadActual: (productId: string) => number;
  isInCart: (productId: string) => boolean;

  appliedCoupon: AppliedCoupon | null;
  discountedTotal: number;
  applyCoupon: (code: string) => Promise<{ success: boolean; error?: string }>;
  removeCoupon: () => void;
  isApplyingCoupon: boolean;
};
