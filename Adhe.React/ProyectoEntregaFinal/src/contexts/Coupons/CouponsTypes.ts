import type { Coupon } from "../../models";
import type { CouponCreatePayload, CouponUpdatePayload } from "../../services/couponService";

export interface CouponsContextType {
  coupons: Coupon[];
  error: string | null;
  loading: boolean;
  createCoupon: (data: CouponCreatePayload) => Promise<Coupon | undefined>;
  deleteCoupon: (id: string) => Promise<void>;
  fetchCoupons: () => Promise<void>;
  updateCoupon: (id: string, data: CouponUpdatePayload) => Promise<void>;
}
