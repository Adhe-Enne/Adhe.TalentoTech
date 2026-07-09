import React from "react";

import type { Coupon, CouponUpdatePayload } from "../../../../models";

import useCouponsSelective from "../../../../hooks/selectors/useCouponsSelective";
import ListStateDisplay from "../../../ui/ListStateDisplay";
import CouponItem from "./CouponItem";

interface CouponListProps {
  onDeleteRequest: (id: string, label: string) => void;
  onUpdateCoupon: (id: string, data: CouponUpdatePayload) => Promise<void>;
}

const CouponList: React.FC<CouponListProps> = (props) => {
  const { onDeleteRequest, onUpdateCoupon } = props;
  const coupons: Coupon[] = useCouponsSelective((c) => c.coupons);
  const loading: boolean = useCouponsSelective((c) => c.loading);
  const error: string | null = useCouponsSelective((c) => c.error);
  const fetchCoupons: () => Promise<void> = useCouponsSelective((c) => c.fetchCoupons);
  return (
    <ListStateDisplay error={error} loading={loading} loadingMessage="Cargando cupones..." onRetry={fetchCoupons}>
      {coupons.length === 0 ? (
        <div className="bg-info/10 border border-info/20 text-info text-center py-4 rounded-lg" role="alert">
          No hay cupones aun. Crea el primero usando el formulario de arriba.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Codigo</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descuento</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usos</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vencimiento</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activo</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {coupons.map((c) => (
                <CouponItem coupon={c} key={c.id} onDeleteRequest={onDeleteRequest} onUpdateCoupon={onUpdateCoupon} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ListStateDisplay>
  );
};

export default CouponList;
