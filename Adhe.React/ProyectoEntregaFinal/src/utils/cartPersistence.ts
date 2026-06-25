import type { CartItem } from "../models";

const CART_KEY_PREFIX: string = "tt_cart";
const COUPON_KEY_PREFIX: string = "tt_coupon";

function getCartKey(userId?: string): string {
  return userId ? `${CART_KEY_PREFIX}_${userId}` : CART_KEY_PREFIX;
}

function getCouponKey(userId?: string): string {
  return userId ? `${COUPON_KEY_PREFIX}_${userId}` : COUPON_KEY_PREFIX;
}

export function loadCart(userId?: string): CartItem[] {
  try {
    const key: string = getCartKey(userId);
    const raw: string | null = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw) as CartItem[];
    }
  } catch {
    /* ignore*/
  }
  return [];
}

export function persistCart(cart: CartItem[], userId?: string): void {
  try {
    const key: string = getCartKey(userId);
    localStorage.setItem(key, JSON.stringify(cart));
  } catch {
    /* ignore */
  }
}

export function loadSavedCouponCode(userId?: string): string | null {
  try {
    const key: string = getCouponKey(userId);
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function persistCouponCode(code: string | null, userId?: string): void {
  try {
    const key: string = getCouponKey(userId);
    if (code) {
      localStorage.setItem(key, code);
    } else {
      localStorage.removeItem(key);
    }
  } catch {
    /* ignore */
  }
}
