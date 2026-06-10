import React, { useCallback, useState } from "react";

import type { Coupon } from "../../../models";

import useAsyncCollection from "../../../hooks/useAsyncCollection";
import useNotification from "../../../hooks/useNotification";
import { couponService } from "../../../services/couponService";
import CouponManagerPage from "./CouponManagerPage";

const CouponManagerContainer: React.FC = () => {
  const { data: coupons, loading, error, reload: fetchCoupons, setData: setCoupons } = useAsyncCollection<Coupon>(() => couponService.fetchCoupons());
  const { setNotification } = useNotification();
  const [code, setCode] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ code?: string; discount?: string }>({});
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; code: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const validate: () => boolean = useCallback((): boolean => {
    const errs: { code?: string; discount?: string } = {};
    const trimmed: string = code.trim();
    if (!trimmed || trimmed.length < 3) {
      errs.code = "El codigo debe tener al menos 3 caracteres";
    }
    if (!trimmed) {
      errs.code = "El codigo es requerido";
    }
    if (/\s/.test(trimmed)) {
      errs.code = "El codigo no puede contener espacios";
    }
    const discountNum: number = Number(discountValue);
    if (!discountValue || Number.isNaN(discountNum) || discountNum < 1 || discountNum > 100) {
      errs.discount = "El descuento debe ser un numero entre 1 y 100";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [code, discountValue]);

  const handleCreate: () => Promise<void> = useCallback(async () => {
    if (!validate()) {
      return;
    }
    setSubmitting(true);
    try {
      const created: Coupon = await couponService.createCoupon({
        code: code.trim(),
        discountValue: Number(discountValue),
      });
      setCoupons((prev) => [created, ...prev]);
      setNotification(`Cupon ${created.code} creado!`, 3000, "success");
      setCode("");
      setDiscountValue("");
      setErrors({});
    } catch {
      setNotification("Error al crear cupon", 3000, "danger");
    } finally {
      setSubmitting(false);
    }
  }, [validate, code, discountValue, setNotification, setCoupons]);

  const handleDeleteRequest: (id: string) => void = useCallback(
    (id: string) => {
      const coupon: Coupon | undefined = coupons.find((c) => c.id === id);
      if (coupon) {
        setDeleteTarget({ id: coupon.id, code: coupon.code });
      }
    },
    [coupons],
  );

  const handleDeleteConfirm: () => Promise<void> = useCallback(async () => {
    if (!deleteTarget) {
      return;
    }
    setDeleting(true);
    try {
      await couponService.deleteCoupon(deleteTarget.id);
      setCoupons((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setNotification(`Cupon ${deleteTarget.code} eliminado`, 3000, "success");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }, [deleteTarget, setNotification, setCoupons]);

  const handleToggle: (id: string, current: boolean) => void = useCallback(
    (id: string, current: boolean) => {
      couponService.updateCoupon(id, { isEnabled: !current });
      setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, isEnabled: !current } : c)));
      setNotification(current ? "Cupon desactivado" : "Cupon activado", 2000, "info");
    },
    [setNotification, setCoupons],
  );

  return (
    <CouponManagerPage
      code={code}
      coupons={coupons}
      deleteTarget={deleteTarget}
      deleting={deleting}
      discountValue={discountValue}
      error={error}
      errors={errors}
      loading={loading}
      onCodeChange={setCode}
      onCreate={handleCreate}
      onDeleteCancel={() => setDeleteTarget(null)}
      onDeleteConfirm={handleDeleteConfirm}
      onDeleteRequest={handleDeleteRequest}
      onDiscountChange={setDiscountValue}
      onRetry={fetchCoupons}
      onToggle={handleToggle}
      submitting={submitting}
    />
  );
};

export default CouponManagerContainer;
