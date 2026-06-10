import React from "react";

import type { Coupon } from "../../../models";

import ConfirmDialog from "../../ui/ConfirmDialog";
import HelmetMeta from "../../ui/HelmetMeta";
import CouponForm from "./CouponForm";
import CouponList from "./CouponList";

interface CouponManagerPageProps {
  code: string;
  coupons: Coupon[];
  deleteTarget: { id: string; code: string } | null;
  deleting: boolean;
  discountValue: string;
  error: string | null;
  errors: { code?: string; discount?: string };
  loading: boolean;
  submitting: boolean;
  onCodeChange: (v: string) => void;
  onCreate: () => Promise<void>;
  onDeleteCancel: () => void;
  onDeleteConfirm: () => Promise<void>;
  onDeleteRequest: (id: string) => void;
  onDiscountChange: (v: string) => void;
  onRetry: () => void;
  onToggle: (id: string, current: boolean) => void;
}

const CouponManagerPage: React.FC<CouponManagerPageProps> = (props) => {
  const {
    code,
    coupons,
    deleteTarget,
    deleting,
    discountValue,
    error,
    errors,
    loading,
    submitting,
    onCodeChange,
    onCreate,
    onDeleteCancel,
    onDeleteConfirm,
    onDeleteRequest,
    onDiscountChange,
    onRetry,
    onToggle,
  } = props;

  return (
    <div>
      <HelmetMeta description="Gestiona tus cupones en Talento Tech." title="Admin | Cupones" />
      <h3 className="mb-4">Gestion de Cupones</h3>
      <CouponForm
        code={code}
        discountValue={discountValue}
        errors={errors}
        onCodeChange={onCodeChange}
        onDiscountChange={onDiscountChange}
        onSubmit={onCreate}
        submitting={submitting}
      />
      <CouponList coupons={coupons} error={error} loading={loading} onDelete={onDeleteRequest} onRetry={onRetry} onToggle={onToggle} />
      <ConfirmDialog
        confirmLabel="Eliminar"
        confirmVariant="danger"
        loading={deleting}
        message={`¿Eliminar el cupón ${deleteTarget?.code}? No se podrá deshacer.`}
        onCancel={onDeleteCancel}
        onConfirm={onDeleteConfirm}
        open={deleteTarget !== null}
        title="Eliminar cupón"
      />
    </div>
  );
};

export default CouponManagerPage;
