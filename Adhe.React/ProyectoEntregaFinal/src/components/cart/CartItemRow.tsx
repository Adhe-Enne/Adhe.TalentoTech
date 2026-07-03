import React from "react";
import { Button, ListGroup } from "react-bootstrap";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";

import type { CartItem } from "../../models";

import { formatPrice } from "../../utils/format";
import styles from "./CartItemRow.module.css";

interface CartItemRowProps {
  item: CartItem;
  onDecrement: () => void;
  onIncrement: () => void;
  onRemove: () => void;
}

const CartItemRow: React.FC<CartItemRowProps> = (props) => {
  const { item, onDecrement, onIncrement, onRemove } = props;

  return (
    <ListGroup.Item className="d-flex align-items-center gap-3">
      <img alt={item.product.name} className={`rounded ${styles.thumb}`} src={item.product.image} />
      <div className="flex-grow-1">
        <strong>{item.product.name}</strong>
        <div className="text-muted">{formatPrice(item.product.price, item.product.currency)}</div>
      </div>
      <div className="d-flex align-items-center gap-2">
        <Button aria-label="Reducir cantidad" onClick={onDecrement} size="sm" variant="outline-secondary">
          <FaMinus />
        </Button>
        <span>{item.quantity}</span>
        <Button aria-label="Aumentar cantidad" onClick={onIncrement} size="sm" variant="outline-secondary">
          <FaPlus />
        </Button>
      </div>
      <div className={styles.totalPrice}>{formatPrice(item.product.price * item.quantity, item.product.currency)}</div>
      <div>
        <Button aria-label={`Eliminar ${item.product.name}`} onClick={onRemove} size="sm" variant="danger">
          <FaTrash />
        </Button>
      </div>
    </ListGroup.Item>
  );
};

export default CartItemRow;
