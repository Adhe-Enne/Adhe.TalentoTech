import React from "react";

import type { CouponUpdatePayload } from "../../../models";

import HelmetMeta from "../../ui/HelmetMeta";
import RefreshButton from "../../ui/RefreshButton";
import CouponForm from "./CouponForm";
import CouponList from "./CouponList";

interface CouponManagerPageViewProps {
  refreshLoading: boolean;
  onDeleteRequest: (id: string, label: string) => void;
  onRefresh: () => void;
  onUpdateCoupon: (id: string, data: CouponUpdatePayload) => Promise<void>;
}

const CouponManagerPageView: React.FC<CouponManagerPageViewProps> = (props) => {
  const { onDeleteRequest, onRefresh, onUpdateCoupon, refreshLoading } = props;

  return (
    <div>
      <HelmetMeta description="Gestiona tus cupones en Talento Tech." title="Admin | Cupones" />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Gestion de Cupones</h3>
        <RefreshButton loading={refreshLoading} onRefresh={onRefresh} />
      </div>
      <CouponForm />
      <CouponList onDeleteRequest={onDeleteRequest} onUpdateCoupon={onUpdateCoupon} />
    </div>
  );
};

export default CouponManagerPageView;
