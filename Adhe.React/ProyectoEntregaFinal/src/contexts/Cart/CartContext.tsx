import type { CartItem, Product } from "../../models";

import { createTypedContext } from "../../utils/context";

export interface AppliedCoupon {
  code: string;
  discountValue: number;
  id: string;
  expiresAt?: string | null;
}

export type CartContextType = {
  cart: CartItem[];
  appliedCoupon: AppliedCoupon | null;
  discountedByCurrency: Record<string, number>;
  discountedTotal: number;
  rawTotal: number;
  totalsByCurrency: Record<string, number>;
  isApplyingCoupon: boolean;
  addToCart: (product: Product, cantidad?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, cantidad: number) => void;
  clearCart: () => void;
  getCartQuantity: () => number;
  getCantidadActual: (productId: string) => number;
  applyCoupon: (code: string) => Promise<{ success: boolean; error?: string }>;
  removeCoupon: () => void;
};

export default createTypedContext<CartContextType>();
