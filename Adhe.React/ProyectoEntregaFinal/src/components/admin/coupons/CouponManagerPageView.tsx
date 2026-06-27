import React from "react";

import ConfirmDialog from "../../ui/ConfirmDialog";
import HelmetMeta from "../../ui/HelmetMeta";
import CouponForm from "./CouponForm";
import CouponList from "./CouponList";

interface DeleteTarget {
  code: string;
  id: string;
}

interface CouponManagerPageViewProps {
  deleteTarget: DeleteTarget | null;
  deleting: boolean;
  onDeleteCancel: () => void;
  onDeleteConfirm: () => void;
  onDeleteRequest: (id: string, label: string) => void;
}

const CouponManagerPageView: React.FC<CouponManagerPageViewProps> = (props) => {
  const { deleting, deleteTarget, onDeleteCancel, onDeleteConfirm, onDeleteRequest } = props;

  return (
    <div>
      <HelmetMeta description="Gestiona tus cupones en Talento Tech." title="Admin | Cupones" />
      <h3 className="mb-4">Gestion de Cupones</h3>
      <CouponForm />
      <CouponList onDeleteRequest={onDeleteRequest} />
      <ConfirmDialog
        confirmLabel="Eliminar"
        confirmVariant="danger"
        loading={deleting}
        message={`¿Eliminar el cupon ${deleteTarget?.code}? No se podra deshacer.`}
        onCancel={onDeleteCancel}
        onConfirm={onDeleteConfirm}
        open={deleteTarget !== null}
        title="Eliminar cupon"
      />
    </div>
  );
};

export default CouponManagerPageView;
