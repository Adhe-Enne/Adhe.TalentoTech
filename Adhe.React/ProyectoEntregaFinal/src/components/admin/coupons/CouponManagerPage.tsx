import React, { useCallback, useMemo } from "react";

import useCoupons from "../../../hooks/selectors/useCoupons";
import useNotification from "../../../hooks/selectors/useNotification";
import useConfirmDelete from "../../../hooks/useConfirmDelete";
import { couponService } from "../../../services/couponService";
import CouponManagerPageView from "./CouponManagerPageView";

const CouponManagerPage: React.FC = () => {
  const { fetchCoupons } = useCoupons();
  const { setNotification } = useNotification();
  const { deleteTarget: rawDeleteTarget, deleting, handleDeleteRequest: baseDeleteRequest, handleDeleteCancel, handleDeleteConfirm: baseDeleteConfirm } = useConfirmDelete();

  const deleteTarget: { id: string; code: string } | null = useMemo(() => (rawDeleteTarget ? { id: rawDeleteTarget.id, code: rawDeleteTarget.label } : null), [rawDeleteTarget]);

  const handleDeleteConfirm: () => Promise<void> = useCallback(async () => {
    const success: boolean = await baseDeleteConfirm(
      (id: string) => couponService.deleteCoupon(id),
      () => {
        fetchCoupons();
      },
    );
    if (success && deleteTarget) {
      setNotification(`Cupon ${deleteTarget.code} eliminado`, 3000, "success");
    } else if (!success) {
      setNotification("Error al eliminar cupon", 3000, "danger");
    }
  }, [baseDeleteConfirm, deleteTarget, fetchCoupons, setNotification]);

  return <CouponManagerPageView deleteTarget={deleteTarget} deleting={deleting} onDeleteCancel={handleDeleteCancel} onDeleteConfirm={handleDeleteConfirm} onDeleteRequest={baseDeleteRequest} />;
};

export default CouponManagerPage;
