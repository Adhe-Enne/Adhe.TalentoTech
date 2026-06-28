import React, { useCallback, useMemo } from "react";
import { toast } from "react-toastify";

import useCoupons from "../../../hooks/selectors/useCoupons";
import useConfirmDelete from "../../../hooks/useConfirmDelete";
import { couponService } from "../../../services/couponService";
import CouponManagerPageView from "./CouponManagerPageView";

const CouponManagerPage: React.FC = () => {
  const { fetchCoupons } = useCoupons();
  const { deleteTarget: rawDeleteTarget, deleting, handleDeleteRequest: baseDeleteRequest, handleDeleteCancel, handleDeleteConfirm: baseDeleteConfirm } = useConfirmDelete();

  const deleteTarget: { id: string; code: string } | null = useMemo(() => (rawDeleteTarget ? { id: rawDeleteTarget.id, code: rawDeleteTarget.label } : null), [rawDeleteTarget]);

  const handleDeleteConfirm: () => Promise<void> = useCallback(async () => {
    const toastId: string | number = toast.loading("Eliminando cupón...");
    const success: boolean = await baseDeleteConfirm(
      (id: string) => couponService.deleteCoupon(id),
      () => {
        fetchCoupons();
      },
    );
    if (success && deleteTarget) {
      toast.update(toastId, { autoClose: 3000, isLoading: false, render: `Cupón ${deleteTarget.code} eliminado`, type: "success" });
    } else if (!success) {
      toast.update(toastId, { autoClose: 3000, isLoading: false, render: "Error al eliminar cupón", type: "error" });
    }
  }, [baseDeleteConfirm, deleteTarget, fetchCoupons]);

  return <CouponManagerPageView deleteTarget={deleteTarget} deleting={deleting} onDeleteCancel={handleDeleteCancel} onDeleteConfirm={handleDeleteConfirm} onDeleteRequest={baseDeleteRequest} />;
};

export default CouponManagerPage;
