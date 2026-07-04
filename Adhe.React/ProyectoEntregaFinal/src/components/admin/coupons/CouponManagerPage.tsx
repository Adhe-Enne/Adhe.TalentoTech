import React, { useCallback, useMemo } from "react";

import useCoupons from "../../../hooks/selectors/useCoupons";
import useConfirmDelete from "../../../hooks/useConfirmDelete";
import { couponService } from "../../../services/couponService";
import { withToast } from "../../../utils/withToast";
import ConfirmDialog from "../../ui/ConfirmDialog";
import CouponManagerPageView from "./CouponManagerPageView";
import CouponList from "./item/CouponList";

const CouponManagerPage: React.FC = () => {
  const { fetchCoupons, loading: couponsLoading, updateCoupon } = useCoupons();
  const { deleteTarget: rawDeleteTarget, deleting, handleDeleteRequest: baseDeleteRequest, handleDeleteCancel, handleDeleteConfirm: baseDeleteConfirm } = useConfirmDelete();

  const deleteTarget: { id: string; code: string } | null = useMemo(() => (rawDeleteTarget ? { id: rawDeleteTarget.id, code: rawDeleteTarget.label } : null), [rawDeleteTarget]);

  const handleDeleteConfirm: () => Promise<void> = useCallback(async () => {
    await withToast(
      async () => {
        const success: boolean = await baseDeleteConfirm(
          (id: string) => couponService.deleteCoupon(id),
          () => {
            fetchCoupons();
          },
        );
        if (!success) {
          throw new Error("Error al eliminar cupón");
        }
      },
      "Eliminando cupón...",
      deleteTarget ? `Cupón ${deleteTarget.code} eliminado` : "Eliminado",
      "Error al eliminar cupón",
    );
  }, [baseDeleteConfirm, deleteTarget, fetchCoupons]);

  const handleRefresh: () => void = useCallback((): void => {
    fetchCoupons();
  }, [fetchCoupons]);

  return (
    <>
      <CouponManagerPageView onRefresh={handleRefresh} refreshLoading={couponsLoading}>
        <CouponList onDeleteRequest={baseDeleteRequest} onUpdateCoupon={updateCoupon} />
      </CouponManagerPageView>
      <ConfirmDialog loading={deleting} message={`¿Eliminar el cupon ${deleteTarget?.code}? No se podra deshacer.`} onCancel={handleDeleteCancel} onConfirm={handleDeleteConfirm} open={deleteTarget !== null} title="Eliminar cupon" />
    </>
  );
};

export default CouponManagerPage;
