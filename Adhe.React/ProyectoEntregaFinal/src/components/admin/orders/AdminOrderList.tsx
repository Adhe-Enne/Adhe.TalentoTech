import React from "react";
import { Badge, Button, Container, Form, ListGroup, Spinner } from "react-bootstrap";
import { FaCheck, FaChevronDown, FaChevronUp, FaTimes } from "react-icons/fa";

import { type Order, ORDER_STATUS_LABELS, OrderStatus } from "../../../models/Order";
import { formatPrice } from "../../../utils/format";
import { ORDER_STATUS_OPTIONS, ORDER_STATUS_VARIANT } from "../../../utils/orderUtils";
import OrderItemRow from "../../orders/OrderItemRow";
import ConfirmDialog from "../../ui/ConfirmDialog";
import DeleteButton from "../../ui/DeleteButton";
import HelmetMeta from "../../ui/HelmetMeta";
import ListStateDisplay from "../../ui/ListStateDisplay";
import PageHeader from "../../ui/PageHeader";
import RefreshButton from "../../ui/RefreshButton";
import styles from "./AdminOrderList.module.css";

interface AdminOrderListProps {
  actionLoading: Map<string, string>;
  deleteTarget: string | null;
  deleting: boolean;
  expandedId: string | null;
  filter: string;
  isLoading: boolean;
  orders: Order[];
  onApprove: (id: string) => void;
  onDeleteCancel: () => void;
  onDeleteConfirm: () => void;
  onDeleteRequest: (id: string) => void;
  onRefresh: () => void;
  onReject: (id: string) => void;
  onStatusChange: (filter: string) => void;
  onToggleExpand: (id: string) => void;
}

const AdminOrderList: React.FC<AdminOrderListProps> = (props) => {
  const { actionLoading, orders, filter, isLoading, expandedId, deleteTarget, deleting, onStatusChange, onToggleExpand, onApprove, onReject, onDeleteRequest, onDeleteCancel, onDeleteConfirm, onRefresh } = props;

  const filtered: Order[] = filter === "all" ? orders : orders.filter((o: Order) => o.status === filter);

  return (
    <Container className="py-4">
      <HelmetMeta description="Administración de pedidos en Talento Tech." title="Talento Tech | Admin Pedidos" />
      <PageHeader title="Pedidos">
        <RefreshButton loading={isLoading} onRefresh={onRefresh} />
      </PageHeader>

      <Form.Select aria-label="Filtrar por estado" className="mb-3 w-auto" onChange={(e) => onStatusChange(e.target.value)} value={filter}>
        <option value="all">Todos</option>
        {ORDER_STATUS_OPTIONS.map((s) => (
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
                        <Button aria-label="Aprobar pedido" className="btn-sm" disabled={actionLoading.has(order.id)} onClick={() => onApprove(order.id)} variant="success">
                          {actionLoading.get(order.id) === "approve" ? (
                            <>
                              <Spinner animation="border" size="sm" /> Procesando...
                            </>
                          ) : (
                            <>
                              <FaCheck className="me-1" />
                              Aprobar
                            </>
                          )}
                        </Button>
                        <Button aria-label="Rechazar pedido" className="btn-sm" disabled={actionLoading.has(order.id)} onClick={() => onReject(order.id)} variant="danger">
                          {actionLoading.get(order.id) === "reject" ? (
                            <>
                              <Spinner animation="border" size="sm" /> Procesando...
                            </>
                          ) : (
                            <>
                              <FaTimes className="me-1" />
                              Rechazar
                            </>
                          )}
                        </Button>
                        <DeleteButton aria-label="Eliminar pedido" disabled={actionLoading.has(order.id)} onClick={() => onDeleteRequest(order.id)} />
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
        loading={deleting}
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
