import React from "react";
import { Container, Spinner } from "react-bootstrap";
import { FaCheckCircle, FaClock, FaShoppingBag, FaTimesCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

import type { Order } from "../../models";

import { type OrderStatusValue, OrderStatus } from "../../models/Order";
import { formatPrice } from "../../utils/format";
import HelmetMeta from "../ui/HelmetMeta";
import OrderItemRow from "./OrderItemRow";

interface OrderConfirmationViewProps {
  loading: boolean;
  order: Order | null;
  onBack: () => void;
}

interface StatusConfig {
  color: string;
  helmet: string;
  icon: React.ReactNode;
  title: string;
}

const STATUS_CONFIG: Record<OrderStatusValue, StatusConfig> = {
  [OrderStatus.Completado]: {
    color: "text-success",
    helmet: "Compra exitosa",
    icon: <FaCheckCircle className="text-success mb-3" size={64} />,
    title: "Compra confirmada con éxito",
  },
  [OrderStatus.Pendiente]: {
    color: "text-warning",
    helmet: "Pedido pendiente",
    icon: <FaClock className="text-warning mb-3" size={64} />,
    title: "Tu pedido está pendiente de aprobación",
  },
  [OrderStatus.Cancelado]: {
    color: "text-danger",
    helmet: "Pedido cancelado",
    icon: <FaTimesCircle className="text-danger mb-3" size={64} />,
    title: "Tu pedido fue cancelado",
  },
};

const OrderConfirmationView: React.FC<OrderConfirmationViewProps> = (props) => {
  const { loading, onBack, order } = props;

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando orden...</span>
        </Spinner>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container className="py-5 text-center">
        <h4>Orden no encontrada</h4>
        <p className="text-muted">La orden que buscas no existe o fue eliminada.</p>
        <button className="btn btn-primary" onClick={onBack}>
          Volver al inicio
        </button>
      </Container>
    );
  }

  const config: StatusConfig = STATUS_CONFIG[order.status];
  const statusIcon: React.ReactNode = config.icon;
  const statusTitle: string = config.title;
  const statusColor: string = config.color;
  const helmetTitle: string = config.helmet;

  return (
    <Container className="py-4">
      <HelmetMeta description="Estado del pedido en Talento Tech." title={`Talento Tech | ${helmetTitle}`} />
      <div className="text-center mb-4">
        {statusIcon}
        <h2 className={statusColor}>{statusTitle}</h2>
        <p className="text-muted">Orden #{order.id.slice(-8).toUpperCase()}</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Resumen</h5>
              {order.items.map((item) => (
                <OrderItemRow imageSize={48} item={item} key={item.productId} />
              ))}
              <hr />
              <div className="d-flex justify-content-between small">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="d-flex justify-content-between small text-success">
                  <span>Descuento{order.discountCode ? ` (${order.discountCode})` : ""}</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Datos de envío</h5>
              <p className="mb-1">{order.shippingInfo.fullName}</p>
              <p className="mb-1">{order.shippingInfo.address}</p>
              <p className="mb-1">
                {order.shippingInfo.city} - CP {order.shippingInfo.postalCode}
              </p>
              <p className="mb-0">{order.shippingInfo.phone}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center gap-3 mt-3">
        <Link className="btn btn-primary" to="/mis-ordenes">
          <FaShoppingBag className="me-1" />
          Mis pedidos
        </Link>
        <button className="btn btn-outline-secondary" onClick={onBack}>
          Volver al inicio
        </button>
      </div>
    </Container>
  );
};

export default OrderConfirmationView;
