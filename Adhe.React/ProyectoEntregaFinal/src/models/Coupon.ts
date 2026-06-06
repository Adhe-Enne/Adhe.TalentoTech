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
