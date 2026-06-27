import React, { useCallback, useEffect, useState } from "react";

import type { Order } from "../../models";

import useAuth from "../../hooks/selectors/useAuth";
import { useErrorNotification } from "../../hooks/useErrorNotification";
import useOrders from "../../hooks/useOrders";
import OrderHistoryView from "./OrderHistoryView";

const OrderHistoryContainer: React.FC = () => {
  const { user } = useAuth();
  const { error, fetchUserOrders, isLoading } = useOrders();
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useErrorNotification(error);

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

  return <OrderHistoryView expandedId={expandedId} loading={isLoading} onToggleExpand={toggleExpand} orders={orders} />;
};

export default OrderHistoryContainer;
