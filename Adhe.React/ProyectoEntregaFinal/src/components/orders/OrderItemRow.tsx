import React from "react";

import type { OrderItem } from "../../models";

import { formatPrice } from "../../utils/format";

interface OrderItemRowProps {
  item: OrderItem;
  imageSize?: number;
}

const OrderItemRow: React.FC<OrderItemRowProps> = (props) => {
  const { item, imageSize = 40 } = props;

  return (
    <div className="d-flex align-items-center gap-2 mb-2">
      <img alt={item.productName} className="rounded" src={item.productImage} style={{ width: imageSize, height: imageSize, objectFit: "cover" }} />
      <div className="flex-grow-1 small">
        <strong>{item.productName}</strong>
        <div className="text-muted">
          {item.quantity} x {formatPrice(item.price)}
        </div>
      </div>
      <div className="small">{formatPrice(item.subtotal)}</div>
    </div>
  );
};

export default OrderItemRow;
