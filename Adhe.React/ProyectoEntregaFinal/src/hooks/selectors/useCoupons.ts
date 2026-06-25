import { useContextSelector } from "use-context-selector";

import type { CouponsContextType } from "../../contexts/Coupons/CouponsTypes";

import CouponsContext from "../../contexts/Coupons/CouponsContext";

const useCoupons: () => CouponsContextType = (): CouponsContextType => {
  const coupons: CouponsContextType["coupons"] | undefined = useContextSelector(CouponsContext, (c) => c?.coupons);
  const loading: CouponsContextType["loading"] | undefined = useContextSelector(CouponsContext, (c) => c?.loading);
  const error: CouponsContextType["error"] | undefined = useContextSelector(CouponsContext, (c) => c?.error);
  const fetchCoupons: CouponsContextType["fetchCoupons"] | undefined = useContextSelector(CouponsContext, (c) => c?.fetchCoupons);
  const createCoupon: CouponsContextType["createCoupon"] | undefined = useContextSelector(CouponsContext, (c) => c?.createCoupon);
  const deleteCoupon: CouponsContextType["deleteCoupon"] | undefined = useContextSelector(CouponsContext, (c) => c?.deleteCoupon);
  const updateCoupon: CouponsContextType["updateCoupon"] | undefined = useContextSelector(CouponsContext, (c) => c?.updateCoupon);

  if (
    coupons === undefined ||
    loading === undefined ||
    error === undefined ||
    fetchCoupons === undefined ||
    createCoupon === undefined ||
    deleteCoupon === undefined ||
    updateCoupon === undefined
  ) {
    throw new Error("useCoupons must be used within a CouponsProvider");
  }

  return { coupons, loading, error, fetchCoupons, createCoupon, deleteCoupon, updateCoupon };
};

export default useCoupons;
