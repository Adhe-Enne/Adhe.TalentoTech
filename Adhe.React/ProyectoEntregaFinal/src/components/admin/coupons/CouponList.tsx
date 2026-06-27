import React from "react";
import { Alert, Table } from "react-bootstrap";

import useCoupons from "../../../hooks/selectors/useCoupons";
import ListStateDisplay from "../../ui/ListStateDisplay";
import CouponItem from "./CouponItem";

interface CouponListProps {
  onDeleteRequest: (id: string, label: string) => void;
}

const CouponList: React.FC<CouponListProps> = (props) => {
  const { onDeleteRequest } = props;
  const { coupons, loading, error, fetchCoupons } = useCoupons();

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
                <CouponItem coupon={c} key={c.id} onDeleteRequest={onDeleteRequest} />
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </ListStateDisplay>
  );
};

export default CouponList;
