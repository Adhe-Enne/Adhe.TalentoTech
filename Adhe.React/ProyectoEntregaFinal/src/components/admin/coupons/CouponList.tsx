import React from "react";
import { Alert, Button, Spinner, Table } from "react-bootstrap";

import type { Coupon } from "../../../models";

import CouponItem from "./CouponItem";

interface CouponListProps {
  coupons: Coupon[];
  error: string | null;
  loading: boolean;
  onDelete: (id: string) => void;
  onRetry: () => void;
  onToggle: (id: string, current: boolean) => void;
}

const CouponList: React.FC<CouponListProps> = (props) => {
  const { coupons, loading, error, onDelete, onToggle, onRetry } = props;

  if (loading) {
    return (
      <div aria-busy="true" className="d-flex justify-content-center py-5">
        <Spinner animation="border" aria-hidden="true" />
        <output aria-live="polite" className="visually-hidden">
          Cargando cupones...
        </output>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="d-flex align-items-center gap-2" variant="danger">
        <span>{error}</span>
        <Button aria-label="Reintentar carga de cupones" className="ms-auto" onClick={onRetry} size="sm" variant="outline-danger">
          Reintentar
        </Button>
      </Alert>
    );
  }

  if (coupons.length === 0) {
    return (
      <Alert className="text-center py-4" variant="info">
        No hay cupones aun. Crea el primero usando el formulario de arriba.
      </Alert>
    );
  }

  return (
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
            <CouponItem coupon={c} key={c.id} onDelete={onDelete} onToggle={onToggle} />
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CouponList;
