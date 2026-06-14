import React, { useState, useCallback, useMemo } from "react";

import type { Coupon, CouponCreatePayload, CouponUpdatePayload } from "../../models";
import type { ProviderProps } from "../../types/ProviderProps";
import type { CouponsContextType } from "./CouponsTypes";

import { couponService } from "../../services/couponService";
import CouponsContext from "./CouponsContext";

const CouponsProvider: React.FC<ProviderProps> = (props) => {
  const { children } = props;
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCoupons: () => Promise<void> = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data: Coupon[] = await couponService.fetchCoupons();
      setCoupons(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al cargar cupones");
    } finally {
      setLoading(false);
    }
  }, []);

  const createCoupon: (data: CouponCreatePayload) => Promise<Coupon | undefined> = useCallback(async (data: CouponCreatePayload): Promise<Coupon | undefined> => {
    try {
      const created: Coupon = await couponService.createCoupon(data);
      setCoupons((prev) => [created, ...prev]);
      return created;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al crear cupón");
      return undefined;
    }
  }, []);

  const deleteCoupon: (id: string) => Promise<void> = useCallback(async (id: string): Promise<void> => {
    try {
      await couponService.deleteCoupon(id);
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al eliminar cupón");
    }
  }, []);

  const updateCoupon: (id: string, data: CouponUpdatePayload) => Promise<void> = useCallback(async (id: string, data: CouponUpdatePayload): Promise<void> => {
    try {
      await couponService.updateCoupon(id, data);
      setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al actualizar cupón");
    }
  }, []);

  const value: CouponsContextType = useMemo(
    () => ({ coupons, loading, error, fetchCoupons, createCoupon, deleteCoupon, updateCoupon }),
    [coupons, loading, error, fetchCoupons, createCoupon, deleteCoupon, updateCoupon],
  );

  return <CouponsContext.Provider value={value}>{children}</CouponsContext.Provider>;
};

export default CouponsProvider;
