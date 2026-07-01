import React, { useCallback, useEffect, useState } from "react";

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
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { expandedId, toggleExpand } = useExpandable();

  useErrorNotification(error);

  useEffect((): void => {
    if (!user) {
      return;
    }
    fetchUserOrders(user.uid).then(setOrders);
  }, [user, fetchUserOrders]);

  const handleRefresh: () => void = useCallback((): void => {
    if (!user) {
      return;
    }
    setRefreshing(true);
    fetchUserOrders(user.uid)
      .then(setOrders)
      .finally((): void => {
        setRefreshing(false);
      });
  }, [user, fetchUserOrders]);

  if (!user) {
    return null;
  }

  return <OrderHistoryView expandedId={expandedId} loading={isLoading} onRefresh={handleRefresh} onToggleExpand={toggleExpand} orders={orders} refreshLoading={refreshing} />;
};

export default OrderHistoryContainer;
