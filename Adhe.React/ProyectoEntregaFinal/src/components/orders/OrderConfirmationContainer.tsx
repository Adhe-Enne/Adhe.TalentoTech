import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, type NavigateFunction } from "react-router-dom";

import type { Order } from "../../models";

import useAuth from "../../hooks/selectors/useAuth";
import useOrders from "../../hooks/useOrders";
import OrderConfirmationView from "./OrderConfirmationView";

const OrderConfirmationContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate: NavigateFunction = useNavigate();
  const { user } = useAuth();
  const { fetchOrderById } = useOrders();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

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

  const handleRefresh: () => void = useCallback((): void => {
    if (!id) {
      return;
    }
    setRefreshing(true);
    fetchOrderById(id)
      .then((o: Order | null): void => {
        setOrder(o);
      })
      .finally((): void => {
        setRefreshing(false);
      });
  }, [id, fetchOrderById]);

  return <OrderConfirmationView loading={loading} onBack={handleBack} onRefresh={handleRefresh} order={order} refreshLoading={refreshing} />;
};

export default OrderConfirmationContainer;
