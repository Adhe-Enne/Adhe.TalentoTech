import React from "react";
import { Badge, Button, Container, Form, ListGroup } from "react-bootstrap";
import { FaCheck, FaChevronDown, FaChevronUp, FaTimes, FaTrash } from "react-icons/fa";

import { type Order, type OrderStatusValue, ORDER_STATUS_LABELS, OrderStatus } from "../../../models/Order";
import { formatPrice } from "../../../utils/format";
import { ORDER_STATUS_VARIANT } from "../../../utils/orderUtils";
import OrderItemRow from "../../orders/OrderItemRow";
import ConfirmDialog from "../../ui/ConfirmDialog";
import HelmetMeta from "../../ui/HelmetMeta";
import ListStateDisplay from "../../ui/ListStateDisplay";
import styles from "./AdminOrderList.module.css";

interface AdminOrderListProps {
  deleteTarget: string | null;
  deleting: boolean;
  expandedId: string | null;
  filter: string;
  isLoading: boolean;
  orders: Order[];
  statusOptions: OrderStatusValue[];
  onApprove: (id: string) => void;
  onDeleteCancel: () => void;
  onDeleteConfirm: () => void;
  onDeleteRequest: (id: string) => void;
  onReject: (id: string) => void;
  onStatusChange: (filter: string) => void;
  onToggleExpand: (id: string) => void;
}

const AdminOrderList: React.FC<AdminOrderListProps> = (props) => {
  const {
    orders,
    filter,
    isLoading,
    expandedId,
    deleteTarget,
    deleting,
    statusOptions,
    onStatusChange,
    onToggleExpand,
    onApprove,
    onReject,
    onDeleteRequest,
    onDeleteCancel,
    onDeleteConfirm,
  } = props;

  const filtered: Order[] = filter === "all" ? orders : orders.filter((o: Order) => o.status === filter);

  return (
    <Container className="py-4">
      <HelmetMeta description="Administración de pedidos en Talento Tech." title="Talento Tech | Admin Pedidos" />
      <h2>Pedidos</h2>

      <Form.Select aria-label="Filtrar por estado" className="mb-3 w-auto" onChange={(e) => onStatusChange(e.target.value)} value={filter}>
        <option value="all">Todos</option>
        {statusOptions.map((s) => (
          <option key={s} value={s}>
            {ORDER_STATUS_LABELS[s]}
          </option>
        ))}
      </Form.Select>

      <ListStateDisplay error={null} loading={isLoading} loadingMessage="Cargando pedidos...">
        {filtered.length === 0 ? (
          <p className="text-muted">No hay pedidos.</p>
        ) : (
          <ListGroup>
          {filtered.map((order: Order) => (
            <ListGroup.Item key={order.id}>
              <button
                aria-label={`Orden ${order.id.slice(-8).toUpperCase()} - ${ORDER_STATUS_LABELS[order.status]}`}
                className={`d-flex align-items-center justify-content-between ${styles.clickable}`}
                onClick={() => onToggleExpand(order.id)}
                type="button"
              >
                <div>
                  <strong>#{order.id.slice(-8).toUpperCase()}</strong>
                  <div className="text-muted small">
                    {order.userEmail} - {new Date(order.createdAt).toLocaleDateString()}
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
                      <strong>Envio:</strong> {order.shippingInfo.fullName} - {order.shippingInfo.address}, {order.shippingInfo.city}
                    </div>
                  )}
                  {order.discount > 0 && (
                    <div className="small text-success mt-1">
                      Descuento{order.discountCode ? ` (${order.discountCode})` : ""}: -{formatPrice(order.discount)}
                    </div>
                  )}
                  {order.status === OrderStatus.Pendiente && (
                    <div className="d-flex gap-2 mt-2">
                      <Button aria-label="Aprobar pedido" className="btn-sm" onClick={() => onApprove(order.id)} variant="success">
                        <FaCheck className="me-1" />
                        Aprobar
                      </Button>
                      <Button aria-label="Rechazar pedido" className="btn-sm" onClick={() => onReject(order.id)} variant="danger">
                        <FaTimes className="me-1" />
                        Rechazar
                      </Button>
                      <Button aria-label="Eliminar pedido" className="btn-sm" onClick={() => onDeleteRequest(order.id)} variant="outline-danger">
                        <FaTrash className="me-1" />
                        Eliminar
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
      </ListStateDisplay>

      <ConfirmDialog
        confirmLabel="Eliminar"
        confirmVariant="danger"
        loading={deleting}
        loadingLabel="Eliminando..."
        message="Esta accion no se puede deshacer."
        onCancel={onDeleteCancel}
        onConfirm={onDeleteConfirm}
        open={deleteTarget !== null}
        title="Eliminar pedido"
      />
    </Container>
  );
};

export default AdminOrderList;
