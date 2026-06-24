import type { BaseEntity } from "./BaseEntity";

export interface Coupon extends BaseEntity {
  code: string;
  discountValue: number;
  isEnabled: boolean;
  usedCount: number;
  description?: string | null;
  expiresAt?: string | null;
  minPurchaseAmount?: number | null;
  usageLimit?: number | null;
}

export interface CouponCreatePayload extends Omit<Partial<Coupon>, "id" | "createdAt" | "updatedAt"> {
  code: string;
  discountValue: number;
}

export interface CouponUpdatePayload extends Omit<Partial<Coupon>, "id" | "createdAt"> {
  updatedAt?: string;
}

export interface CouponValidationResult {
  valid: boolean;
  discountValue?: number;
  error?: string;
  expiresAt?: string | null;
  id?: string;
}
