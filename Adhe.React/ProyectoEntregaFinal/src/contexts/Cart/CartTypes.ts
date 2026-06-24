import type { CartItem, Product } from "../../models";

export interface AppliedCoupon {
  code: string;
  discountValue: number;
  id: string;
  expiresAt?: string | null;
}

export type CartContextType = {
  cart: CartItem[];
  appliedCoupon: AppliedCoupon | null;
  discountedTotal: number;
  isApplyingCoupon: boolean;
  addToCart: (product: Product, cantidad?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, cantidad: number) => void;
  clearCart: () => void;
  getCartQuantity: () => number;
  getCartTotal: () => number;
  getCantidadActual: (productId: string) => number;
  isInCart: (productId: string) => boolean;
  applyCoupon: (code: string) => Promise<{ success: boolean; error?: string }>;
  removeCoupon: () => void;
};
