import React from "react";
import { Button, ListGroup } from "react-bootstrap";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";

import type { CartItem } from "../../models";

import useCart from "../../hooks/selectors/useCart";
import useNotification from "../../hooks/selectors/useNotification";
import styles from "./CartItemRow.module.css";

interface CartItemRowProps {
  item: CartItem;
}

const CartItemRow: React.FC<CartItemRowProps> = (props) => {
  const { item } = props;
  const { updateQuantity, removeFromCart } = useCart();
  const { setNotification } = useNotification();

  const handleIncrement: () => void = (): void => {
    if (item.quantity >= item.product.stock) {
      setNotification(`Stock maximo alcanzado para ${item.product.name}`, 3000, "warning");
      return;
    }
    updateQuantity(item.product.id, item.quantity + 1);
    setNotification(`${item.product.name}: +1 unidad`, 2000, "info");
  };

  const handleDecrement: () => void = (): void => {
    if (item.quantity <= 1) {
      removeFromCart(item.product.id);
      setNotification(`${item.product.name} eliminado del carrito`, 2000, "info");
      return;
    }
    updateQuantity(item.product.id, item.quantity - 1);
    setNotification(`${item.product.name}: -1 unidad`, 2000, "info");
  };

  const handleRemove: () => void = (): void => {
    removeFromCart(item.product.id);
    setNotification(`${item.product.name} eliminado del carrito`, 2000, "info");
  };

  return (
    <ListGroup.Item className="d-flex align-items-center gap-3">
      <img alt={item.product.name} className={`rounded ${styles.thumb}`} src={item.product.image} />
      <div className="flex-grow-1">
        <strong>{item.product.name}</strong>
        <div className="text-muted">${item.product.price.toFixed(2)}</div>
      </div>
      <div className="d-flex align-items-center gap-2">
        <Button aria-label="Reducir cantidad" onClick={handleDecrement} size="sm" variant="outline-secondary">
          <FaMinus />
        </Button>
        <span>{item.quantity}</span>
        <Button aria-label="Aumentar cantidad" onClick={handleIncrement} size="sm" variant="outline-secondary">
          <FaPlus />
        </Button>
      </div>
      <div className={styles.totalPrice}>${(item.product.price * item.quantity).toFixed(2)}</div>
      <div>
        <Button aria-label={`Eliminar ${item.product.name}`} onClick={handleRemove} size="sm" variant="danger">
          <FaTrash />
        </Button>
      </div>
    </ListGroup.Item>
  );
};

export default CartItemRow;
