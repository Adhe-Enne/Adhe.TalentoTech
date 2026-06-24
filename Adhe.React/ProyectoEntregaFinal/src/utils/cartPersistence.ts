import type { CartItem } from "../models";

const CART_KEY: string = "tt_cart";
const COUPON_KEY: string = "tt_coupon";
export function loadCart(): CartItem[] {
  try {
    const raw: string | null = localStorage.getItem(CART_KEY);
    if (raw) {
      return JSON.parse(raw) as CartItem[];
    }
  } catch {
    /* ignore*/
  }
  return [];
}

export function persistCart(cart: CartItem[]): void {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    /* ignore */
  }
}

export function loadSavedCouponCode(): string | null {
  try {
    return localStorage.getItem(COUPON_KEY);
  } catch {
    return null;
  }
}

export function persistCouponCode(code: string | null): void {
  try {
    if (code) {
      localStorage.setItem(COUPON_KEY, code);
    } else {
      localStorage.removeItem(COUPON_KEY);
    }
  } catch {
    /* ignore */
  }
}
