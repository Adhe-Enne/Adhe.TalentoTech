import React from "react";
import { Badge, Container, ListGroup } from "react-bootstrap";
import { FaBox, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Link } from "react-router-dom";

import type { Order } from "../../models";

import { ORDER_STATUS_LABELS } from "../../models";
import { formatPrice } from "../../utils/format";
import { ORDER_STATUS_VARIANT } from "../../utils/orderUtils";
import HelmetMeta from "../ui/HelmetMeta";
import ListStateDisplay from "../ui/ListStateDisplay";
import styles from "./OrderHistory.module.css";
import OrderItemRow from "./OrderItemRow";

interface OrderHistoryViewProps {
  expandedId: string | null;
  loading: boolean;
  orders: Order[];
  onToggleExpand: (id: string) => void;
}

const OrderHistoryView: React.FC<OrderHistoryViewProps> = (props) => {
  const { expandedId, loading, onToggleExpand, orders } = props;

  return (
    <Container className="py-4">
      <HelmetMeta description="Historial de pedidos en Talento Tech." title="Talento Tech | Mis pedidos" />
      <h2>Mis pedidos</h2>
      <ListStateDisplay error={null} loading={loading} loadingMessage="Cargando pedidos...">
        {orders.length === 0 ? (
          <div className="text-center py-5">
            <FaBox className="text-muted mb-3" size={48} />
            <h4>No tenés pedidos aún</h4>
            <p className="text-muted">Tus compras aparecerán aquí.</p>
            <Link className="btn btn-primary" to="/productos">
              Ver productos
            </Link>
          </div>
        ) : (
          <ListGroup>
            {orders.map((order: Order) => (
              <ListGroup.Item key={order.id}>
                <button
                  aria-label={`Orden ${order.id.slice(-8).toUpperCase()} - ${ORDER_STATUS_LABELS[order.status]}`}
                  className={`d-flex align-items-center justify-content-between w-100 btn p-0 border-0 text-start ${styles.clickable}`}
                  onClick={() => onToggleExpand(order.id)}
                  type="button"
                >
                  <div>
                    <strong>#{order.id.slice(-8).toUpperCase()}</strong>
                    <div className="text-muted small">
                      {new Date(order.createdAt).toLocaleDateString()} - {order.items.length} producto{order.items.length === 1 ? "" : "s"}
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <Badge bg={ORDER_STATUS_VARIANT[order.status] ?? "secondary"}>{ORDER_STATUS_LABELS[order.status]}</Badge>
                    <span>{formatPrice(order.total)}</span>
                    {expandedId === order.id ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                </button>

                {expandedId === order.id && (
                  <div className="mt-3 pt-3 border-top">
                    {order.items.map((item) => (
                      <OrderItemRow item={item} key={item.productId} />
                    ))}
                    {order.shippingInfo && (
                      <div className="small text-muted mt-2">
                        <strong>Envío:</strong> {order.shippingInfo.fullName} - {order.shippingInfo.address}, {order.shippingInfo.city}
                      </div>
                    )}
                  </div>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </ListStateDisplay>
    </Container>
  );
};

export default OrderHistoryView;
