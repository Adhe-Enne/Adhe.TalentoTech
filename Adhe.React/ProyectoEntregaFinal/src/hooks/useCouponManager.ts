import { useCallback, useEffect, useMemo, useState } from "react";

import type { AppliedCoupon } from "../contexts/Cart/CartTypes";
import type { CouponValidationResult } from "../models";

import { couponService } from "../services/couponService";
import { loadSavedCouponCode, persistCouponCode } from "../utils/cartPersistence";

interface UseCouponManagerReturn {
  appliedCoupon: AppliedCoupon | null;
  discountedTotal: number;
  isApplyingCoupon: boolean;
  applyCoupon: (code: string) => Promise<{ success: boolean; error?: string }>;
  removeCoupon: () => void;
}

const useCouponManager: (rawTotal: number, userId?: string) => UseCouponManagerReturn = (rawTotal: number, userId?: string): UseCouponManagerReturn => {
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  useEffect((): void => {
    const savedCode: string | null = loadSavedCouponCode(userId);
    if (savedCode) {
      couponService.validateCoupon(savedCode).then((result: CouponValidationResult) => {
        if (result.valid && result.discountValue != null) {
          setAppliedCoupon({
            code: savedCode,
            discountValue: result.discountValue,
            id: result.id ?? "",
            expiresAt: result.expiresAt ?? null,
          });
        } else {
          persistCouponCode(null, userId);
        }
      });
    }
  }, [userId]);

  const applyCoupon: (code: string) => Promise<{ success: boolean; error?: string }> = useCallback(async (code: string): Promise<{ success: boolean; error?: string }> => {
    setIsApplyingCoupon(true);
    try {
      const result: CouponValidationResult = await couponService.validateCoupon(code);
      if (!result.valid || result.discountValue == null) {
        return { success: false, error: result.error ?? "Cupon invalido" };
      }
      const couponData: AppliedCoupon = {
        code: code.trim().toUpperCase(),
        discountValue: result.discountValue,
        id: result.id ?? "",
        expiresAt: result.expiresAt ?? null,
      };
      setAppliedCoupon(couponData);
      persistCouponCode(couponData.code, userId);
      return { success: true };
    } finally {
      setIsApplyingCoupon(false);
    }
  }, [userId]);

  const removeCoupon: () => void = useCallback((): void => {
    setAppliedCoupon(null);
    persistCouponCode(null, userId);
  }, [userId]);

  const discountedTotal: number = useMemo((): number => {
    if (!appliedCoupon) {
      return rawTotal;
    }
    const discount: number = rawTotal * (appliedCoupon.discountValue / 100);
    return Math.max(0, rawTotal - discount);
  }, [rawTotal, appliedCoupon]);

  return { appliedCoupon, isApplyingCoupon, discountedTotal, applyCoupon, removeCoupon };
};

export default useCouponManager;
