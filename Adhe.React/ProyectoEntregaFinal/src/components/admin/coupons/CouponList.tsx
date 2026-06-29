import React from "react";
import { Alert, Table } from "react-bootstrap";

import type { Coupon, CouponUpdatePayload } from "../../../models";

import useCouponsSelective from "../../../hooks/selectors/useCouponsSelective";
import ListStateDisplay from "../../ui/ListStateDisplay";
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
        <Alert className="text-center py-4" variant="info">
          No hay cupones aun. Crea el primero usando el formulario de arriba.
        </Alert>
      ) : (
        <div className="table-responsive">
          <Table className="align-middle" hover>
            <thead>
              <tr>
                <th>Codigo</th>
                <th>Descuento</th>
                <th>Estado</th>
                <th>Usos</th>
                <th>Vencimiento</th>
                <th>Activo</th>
                <th>Accion</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <CouponItem coupon={c} key={c.id} onDeleteRequest={onDeleteRequest} onUpdateCoupon={onUpdateCoupon} />
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </ListStateDisplay>
  );
};

export default CouponList;
