import React from "react";

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
        <div aria-hidden="true" className="spinner-border" />
        <output aria-live="polite" className="visually-hidden">
          Cargando cupones...
        </output>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger d-flex align-items-center gap-2">
        <span>{error}</span>
        <button className="btn btn-sm btn-outline-danger ms-auto" onClick={onRetry}>
          Reintentar
        </button>
      </div>
    );
  }

  if (coupons.length === 0) {
    return <div className="alert alert-info text-center py-4">No hay cupones aun. Crea el primero usando el formulario de arriba.</div>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
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
      </table>
    </div>
  );
};

export default CouponList;
