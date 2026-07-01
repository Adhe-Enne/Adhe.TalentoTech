import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, type NavigateFunction } from "react-router-dom";

import type { Order } from "../../models";

import useAuth from "../../hooks/selectors/useAuth";
import useOrders from "../../hooks/useOrders";
import useRefresh from "../../hooks/useRefresh";
import OrderConfirmationView from "./OrderConfirmationView";

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

  const { refreshing, handleRefresh } = useRefresh(() => {
    if (!id) {
      return Promise.resolve();
    }
    return fetchOrderById(id).then(setOrder);
  });

  return <OrderConfirmationView loading={loading} onBack={handleBack} onRefresh={handleRefresh} order={order} refreshLoading={refreshing} />;
};

export default OrderConfirmationContainer;
