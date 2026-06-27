import type { Coupon, CouponCreatePayload, CouponUpdatePayload } from "../../models";

import { createTypedContext } from "../../utils/context";

export interface CouponsContextType {
  coupons: Coupon[];
  error: string | null;
  loading: boolean;
  createCoupon: (data: CouponCreatePayload) => Promise<Coupon | undefined>;
  deleteCoupon: (id: string) => Promise<void>;
  fetchCoupons: () => Promise<void>;
  updateCoupon: (id: string, data: CouponUpdatePayload) => Promise<void>;
}

export default createTypedContext<CouponsContextType>();
