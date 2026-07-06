import type { CartItem, Product } from "../../models";

import { createTypedContext } from "../../utils/context";

export interface AppliedCoupon {
  code: string;
  discountValue: number;
  id: string;
  expiresAt?: string | null;
}

export interface CartContextType {
  appliedCoupon: AppliedCoupon | null;
  cart: CartItem[];
  discountedByCurrency: Record<string, number>;
  discountedTotal: number;
  isApplyingCoupon: boolean;
  rawTotal: number;
  totalsByCurrency: Record<string, number>;
  addToCart: (product: Product, cantidad?: number) => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; error?: string }>;
  clearCart: () => void;
  getCantidadActual: (productId: string) => number;
  getCartQuantity: () => number;
  removeCoupon: () => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, cantidad: number) => void;
}

export default createTypedContext<CartContextType>();
