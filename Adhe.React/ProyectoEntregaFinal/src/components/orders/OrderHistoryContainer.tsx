import React, { useEffect, useState } from "react";

import type { Order } from "../../models";

import useAuth from "../../hooks/selectors/useAuth";
import { useErrorNotification } from "../../hooks/useErrorNotification";
import useExpandable from "../../hooks/useExpandable";
import useOrders from "../../hooks/useOrders";
import OrderHistoryView from "./OrderHistoryView";

const OrderHistoryContainer: React.FC = () => {
  const { user } = useAuth();
  const { error, fetchUserOrders, isLoading } = useOrders();
  const [orders, setOrders] = useState<Order[]>([]);
  const { expandedId, toggleExpand } = useExpandable();

  useErrorNotification(error);

  useEffect((): void => {
    if (!user) {
      return;
    }
    fetchUserOrders(user.uid).then(setOrders);
  }, [user, fetchUserOrders]);

  if (!user) {
    return null;
  }

  return <OrderHistoryView expandedId={expandedId} loading={isLoading} onToggleExpand={toggleExpand} orders={orders} />;
};

export default OrderHistoryContainer;
