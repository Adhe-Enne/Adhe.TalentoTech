import React, { useCallback, useMemo } from "react";

import type { Coupon, CouponCreatePayload, CouponUpdatePayload } from "../../models";
import type { ProviderProps } from "../../types/ProviderProps";
import type { CouponsContextType } from "./CouponsContext";

import useAsyncCollection from "../../hooks/useAsyncCollection";
import { couponService } from "../../services/couponService";
import { extractErrorMessage } from "../../utils/errorUtils";
import CouponsContext from "./CouponsContext";

export const CouponsProvider: React.FC<ProviderProps> = (props) => {
  const { children } = props;
  const fetchAll: () => Promise<Coupon[]> = useCallback(() => couponService.fetchCoupons(), []);
  const { data: coupons, loading, error, setData: setCoupons, setError, reload: fetchCoupons } = useAsyncCollection<Coupon>(fetchAll);

  const createCoupon: (data: CouponCreatePayload) => Promise<Coupon | undefined> = useCallback(
    async (data: CouponCreatePayload): Promise<Coupon | undefined> => {
      try {
        const created: Coupon = await couponService.createCoupon(data);
        setCoupons((prev) => [created, ...prev]);
        return created;
      } catch (err: unknown) {
        setError(extractErrorMessage(err, "Error al crear cupon"));
        return undefined;
      }
    },
    [setCoupons, setError],
  );

  const deleteCoupon: (id: string) => Promise<void> = useCallback(
    async (id: string): Promise<void> => {
      try {
        await couponService.deleteCoupon(id);
        setCoupons((prev) => prev.filter((c) => c.id !== id));
      } catch (err: unknown) {
        setError(extractErrorMessage(err, "Error al eliminar cupon"));
      }
    },
    [setCoupons, setError],
  );

  const updateCoupon: (id: string, data: CouponUpdatePayload) => Promise<void> = useCallback(
    async (id: string, data: CouponUpdatePayload): Promise<void> => {
      try {
        await couponService.updateCoupon(id, data);
        setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
      } catch (err: unknown) {
        setError(extractErrorMessage(err, "Error al actualizar cupon"));
        throw err;
      }
    },
    [setCoupons, setError],
  );

  const value: CouponsContextType = useMemo(() => ({ coupons, loading, error, fetchCoupons, createCoupon, deleteCoupon, updateCoupon }), [coupons, loading, error, fetchCoupons, createCoupon, deleteCoupon, updateCoupon]);

  return <CouponsContext.Provider value={value}>{children}</CouponsContext.Provider>;
};
