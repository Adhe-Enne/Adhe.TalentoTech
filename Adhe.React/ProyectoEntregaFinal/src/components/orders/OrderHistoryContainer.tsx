import React, { useCallback, useEffect, useState } from "react";
import { Badge, Container, ListGroup, Spinner } from "react-bootstrap";
import { FaBox, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Link } from "react-router-dom";

import type { Order } from "../../models";

import useAuth from "../../hooks/selectors/useAuth";
import useNotification from "../../hooks/selectors/useNotification";
import useOrders from "../../hooks/useOrders";
import { ORDER_STATUS_LABELS } from "../../models/Order";
import { ORDER_STATUS_VARIANT } from "../../utils/orderUtils";
import HelmetMeta from "../ui/HelmetMeta";
import styles from "./OrderHistory.module.css";
import OrderItemRow from "./OrderItemRow";

const OrderHistoryContainer: React.FC = () => {
  const { user } = useAuth();
  const { setNotification } = useNotification();
  const { error, fetchUserOrders, isLoading } = useOrders();
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect((): void => {
    if (error) {
      setNotification(error, 5000, "danger");
    }
  }, [error, setNotification]);

  useEffect((): void => {
    if (!user) {
      return;
    }
    fetchUserOrders(user.uid).then(setOrders);
  }, [user, fetchUserOrders]);

  const toggleExpand: (id: string) => void = useCallback((id: string): void => {
    setExpandedId((prev: string | null) => (prev === id ? null : id));
  }, []);

  if (!user) {
    return null;
  }

  return (
    <Container className="py-4">
      <HelmetMeta description="Historial de pedidos en Talento Tech." title="Talento Tech | Mis pedidos" />
      <h2>Mis pedidos</h2>

      {isLoading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando pedidos...</span>
          </Spinner>
        </div>
      ) : orders.length === 0 ? (
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
              <div
                aria-label={`Orden ${order.id.slice(-8).toUpperCase()} - ${ORDER_STATUS_LABELS[order.status]}`}
                className={`d-flex align-items-center justify-content-between ${styles.clickable}`}
                onClick={() => toggleExpand(order.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    toggleExpand(order.id);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div>
                  <strong>#{order.id.slice(-8).toUpperCase()}</strong>
                  <div className="text-muted small">
                    {new Date(order.createdAt).toLocaleDateString()} - {order.items.length} producto{order.items.length !== 1 ? "s" : ""}
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Badge bg={ORDER_STATUS_VARIANT[order.status] ?? "secondary"}>{ORDER_STATUS_LABELS[order.status]}</Badge>
                  <span>${order.total.toFixed(2)}</span>
                  {expandedId === order.id ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </div>

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
    </Container>
  );
};

export default OrderHistoryContainer;
