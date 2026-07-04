import React, { type ReactNode } from "react";

import HelmetMeta from "../../ui/HelmetMeta";
import PageHeader from "../../ui/PageHeader";
import RefreshButton from "../../ui/RefreshButton";
import CouponForm from "./form/CouponForm";

interface CouponManagerPageViewProps {
  refreshLoading: boolean;
  children?: ReactNode;
  onRefresh: () => void;
}

const CouponManagerPageView: React.FC<CouponManagerPageViewProps> = (props) => {
  const { children, onRefresh, refreshLoading } = props;

  return (
    <div>
      <HelmetMeta description="Gestiona tus cupones en Talento Tech." title="Admin | Cupones" />
      <PageHeader className="mb-4" headingTag="h3" title="Gestion de Cupones">
        <RefreshButton loading={refreshLoading} onRefresh={onRefresh} />
      </PageHeader>
      <CouponForm />
      {children}
    </div>
  );
};

export default CouponManagerPageView;
