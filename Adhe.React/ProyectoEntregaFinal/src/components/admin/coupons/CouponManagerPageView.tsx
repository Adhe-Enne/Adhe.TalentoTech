import React from "react";

import type { CouponUpdatePayload } from "../../../models";

import HelmetMeta from "../../ui/HelmetMeta";
import CouponForm from "./CouponForm";
import CouponList from "./CouponList";

interface CouponManagerPageViewProps {
  onDeleteRequest: (id: string, label: string) => void;
  onUpdateCoupon: (id: string, data: CouponUpdatePayload) => Promise<void>;
}

const CouponManagerPageView: React.FC<CouponManagerPageViewProps> = (props) => {
  const { onDeleteRequest, onUpdateCoupon } = props;

  return (
    <div>
      <HelmetMeta description="Gestiona tus cupones en Talento Tech." title="Admin | Cupones" />
      <h3 className="mb-4">Gestion de Cupones</h3>
      <CouponForm />
      <CouponList onDeleteRequest={onDeleteRequest} onUpdateCoupon={onUpdateCoupon} />
    </div>
  );
};

export default CouponManagerPageView;
