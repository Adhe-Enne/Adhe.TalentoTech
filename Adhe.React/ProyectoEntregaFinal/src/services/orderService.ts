import {
  collection,
  doc,
  deleteDoc,
  getDoc,
  getDocs,
  increment,
  query,
  where,
  orderBy,
  runTransaction,
  updateDoc,
  type DocumentData,
  type DocumentReference,
  type DocumentSnapshot,
  type Query,
  type QuerySnapshot,
} from "firebase/firestore";

import type { Order, CreateOrderPayload } from "../models";

import { COUPONS_COLLECTION, ORDERS_COLLECTION, PRODUCTS_COLLECTION } from "../App.Constants";
import { db } from "../firebase";
import { type OrderStatusValue, OrderStatus } from "../models/Order";
import { timestamps } from "../utils/firestore";
import { tsToIso } from "../utils/parseDataUtils";

function mapDocToOrder(d: DocumentSnapshot<DocumentData>): Order {
  const data: DocumentData | undefined = d.data();
    return {
    id: d.id,
    userId: data?.userId ?? "",
    userEmail: data?.userEmail ?? "",
    items: data?.items ?? [],
    subtotal: Number(data?.subtotal ?? 0),
    discount: Number(data?.discount ?? 0),
    discountCode: data?.discountCode ?? null,
    couponId: data?.couponId ?? null,
    total: Number(data?.total ?? 0),
    status: data?.status ?? OrderStatus.Pendiente,
    shippingInfo: data?.shippingInfo ?? {},
    createdAt: tsToIso(data?.createdAt) ?? "",
    updatedAt: tsToIso(data?.updatedAt) ?? undefined,
  };
}

export const orderService: {
  createOrder: (payload: CreateOrderPayload) => Promise<string>;
  fetchUserOrders: (userId: string) => Promise<Order[]>;
  fetchAllOrders: () => Promise<Order[]>;
  fetchOrderById: (id: string) => Promise<Order | null>;
  updateOrderStatus: (id: string, status: OrderStatusValue) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
} = {
  createOrder: async (payload: CreateOrderPayload): Promise<string> => {
    const { items } = payload;

    return await runTransaction(db, async (tx): Promise<string> => {
      const productRefs: DocumentReference[] = items.map((i) => doc(db, PRODUCTS_COLLECTION, i.productId));
      const productSnaps: DocumentSnapshot[] = await Promise.all(productRefs.map((ref) => tx.get(ref)));

      const stockErrors: string[] = [];
      productSnaps.forEach((snap: DocumentSnapshot, i: number): void => {
        if (!snap.exists()) {
          stockErrors.push(`Producto "${items[i].productName}" no encontrado`);
          return;
        }
        const stock: number = snap.data().stock ?? 0;
        if (stock < items[i].quantity) {
          stockErrors.push(`Stock insuficiente para "${items[i].productName}": disponible ${stock}, solicitado ${items[i].quantity}`);
        }
      });

      if (stockErrors.length > 0) {
        throw new Error(stockErrors.join("\n"));
      }

      productRefs.forEach((ref: DocumentReference, i: number): void => {
        tx.update(ref, { stock: increment(-items[i].quantity) });
      });

      if (payload.couponId) {
        const couponRef: DocumentReference = doc(db, COUPONS_COLLECTION, payload.couponId);
        tx.update(couponRef, { usedCount: increment(1) });
      }

      const orderRef: DocumentReference = doc(collection(db, ORDERS_COLLECTION));

      tx.set(orderRef, {
        userId: payload.userId,
        userEmail: payload.userEmail,
        items: payload.items,
        subtotal: payload.subtotal,
        discount: payload.discount,
        discountCode: payload.discountCode ?? null,
        couponId: payload.couponId ?? null,
        total: payload.total,
        status: OrderStatus.Pendiente,
        shippingInfo: payload.shippingInfo,
        ...timestamps.onCreate(),
      });

      return orderRef.id;
    });
  },

  fetchUserOrders: async (userId: string): Promise<Order[]> => {
    const q: Query<DocumentData> = query(collection(db, ORDERS_COLLECTION), where("userId", "==", userId), orderBy("createdAt", "desc"));
    const snap: QuerySnapshot<DocumentData> = await getDocs(q);
    return snap.docs.map(mapDocToOrder);
  },

  fetchAllOrders: async (): Promise<Order[]> => {
    const q: Query<DocumentData> = query(collection(db, ORDERS_COLLECTION), orderBy("createdAt", "desc"));
    const snap: QuerySnapshot<DocumentData> = await getDocs(q);
    return snap.docs.map(mapDocToOrder);
  },

  fetchOrderById: async (id: string): Promise<Order | null> => {
    const snap: DocumentSnapshot<DocumentData> = await getDoc(doc(db, ORDERS_COLLECTION, id));
    if (!snap.exists()) {
      return null;
    }
    return mapDocToOrder(snap);
  },

  updateOrderStatus: async (id: string, status: OrderStatusValue): Promise<void> => {
    await updateDoc(doc(db, ORDERS_COLLECTION, id), { status, ...timestamps.onUpdate() });
  },

  deleteOrder: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, ORDERS_COLLECTION, id));
  },
};
