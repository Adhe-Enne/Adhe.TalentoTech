import React, { useCallback, useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import { FaCheckCircle, FaClock, FaShoppingBag, FaTimesCircle } from "react-icons/fa";
import { Link, useNavigate, useParams, type NavigateFunction } from "react-router-dom";

import type { Order } from "../../models";

import useAuth from "../../hooks/selectors/useAuth";
import useOrders from "../../hooks/useOrders";
import { OrderStatus } from "../../models/Order";
import HelmetMeta from "../ui/HelmetMeta";
import OrderItemRow from "./OrderItemRow";

const OrderConfirmationContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate: NavigateFunction = useNavigate();
  const { user } = useAuth();
  const { fetchOrderById } = useOrders();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect((): void => {
    if (!id) {
      return;
    }
    fetchOrderById(id).then((o: Order | null): void => {
      setOrder(o);
      setLoading(false);
      if (o && user && o.userId !== user.uid) {
        navigate("/", { replace: true });
      }
    });
  }, [id, fetchOrderById, user, navigate]);

  const handleBack: () => void = useCallback((): void => {
    navigate("/");
  }, [navigate]);

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
        <button className="btn btn-primary" onClick={handleBack}>
          Volver al inicio
        </button>
      </Container>
    );
  }

  const statusIcon: React.ReactNode =
    order.status === OrderStatus.Pendiente ? (
      <FaClock className="text-warning mb-3" size={64} />
    ) : order.status === OrderStatus.Completado ? (
      <FaCheckCircle className="text-success mb-3" size={64} />
    ) : (
      <FaTimesCircle className="text-danger mb-3" size={64} />
    );

  const statusTitle: string =
    order.status === OrderStatus.Pendiente
      ? "Tu pedido está pendiente de aprobación"
      : order.status === OrderStatus.Completado
        ? "Compra confirmada con éxito"
        : "Tu pedido fue rechazado";

  const statusColor: string = order.status === OrderStatus.Pendiente ? "text-warning" : order.status === OrderStatus.Completado ? "text-success" : "text-danger";

  const helmetTitle: string = order.status === OrderStatus.Pendiente ? "Pedido pendiente" : order.status === OrderStatus.Completado ? "Compra exitosa" : "Pedido cancelado";

  return (
    <Container className="py-4">
      <HelmetMeta description={`Estado del pedido en Talento Tech.`} title={`Talento Tech | ${helmetTitle}`} />
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
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="d-flex justify-content-between small text-success">
                  <span>Descuento{order.discountCode ? ` (${order.discountCode})` : ""}</span>
                  <span>-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
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
        <button className="btn btn-outline-secondary" onClick={handleBack}>
          Volver al inicio
        </button>
      </div>
    </Container>
  );
};

export default OrderConfirmationContainer;
