import React, { useCallback, useMemo } from "react";

import useConfirmDelete from "../../../hooks/useConfirmDelete";
import useCoupons from "../../../hooks/useCoupons";
import useNotification from "../../../hooks/useNotification";
import { couponService } from "../../../services/couponService";
import ConfirmDialog from "../../ui/ConfirmDialog";
import HelmetMeta from "../../ui/HelmetMeta";
import CouponForm from "./CouponForm";
import CouponList from "./CouponList";

const CouponManagerPage: React.FC = () => {
  const { fetchCoupons } = useCoupons();
  const { setNotification } = useNotification();
  const { deleteTarget: rawDeleteTarget, deleting, handleDeleteRequest: baseDeleteRequest, handleDeleteCancel, handleDeleteConfirm: baseDeleteConfirm } = useConfirmDelete();

  const deleteTarget: { id: string; code: string } | null = useMemo(
    () => (rawDeleteTarget ? { id: rawDeleteTarget.id, code: rawDeleteTarget.label } : null),
    [rawDeleteTarget],
  );

  const handleDeleteConfirm: () => Promise<void> = useCallback(async () => {
    const success: boolean = await baseDeleteConfirm(
      (id: string) => couponService.deleteCoupon(id),
      () => { fetchCoupons(); },
    );
    if (success && deleteTarget) {
      setNotification(`Cupon ${deleteTarget.code} eliminado`, 3000, "success");
    } else if (!success) {
      setNotification("Error al eliminar cupon", 3000, "danger");
    }
  }, [baseDeleteConfirm, deleteTarget, fetchCoupons, setNotification]);

  return (
    <div>
      <HelmetMeta description="Gestiona tus cupones en Talento Tech." title="Admin | Cupones" />
      <h3 className="mb-4">Gestion de Cupones</h3>
      <CouponForm />
      <CouponList onDeleteRequest={baseDeleteRequest} />
      <ConfirmDialog
        confirmLabel="Eliminar"
        confirmVariant="danger"
        loading={deleting}
        message={`¿Eliminar el cupon ${deleteTarget?.code}? No se podra deshacer.`}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        open={deleteTarget !== null}
        title="Eliminar cupon"
      />
    </div>
  );
};

export default CouponManagerPage;
