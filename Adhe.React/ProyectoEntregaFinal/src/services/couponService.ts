import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where,
  type DocumentData,
  type DocumentReference,
  type QuerySnapshot,
  QueryDocumentSnapshot,
  Query,
} from "firebase/firestore";

import type { Coupon, CouponCreatePayload, CouponUpdatePayload, CouponValidationResult } from "../models";

import { COUPONS_COLLECTION } from "../App.Constants";
import { db } from "../firebase";
import { tsToIso } from "../utils/parseDataUtils";

export const couponService: {
  fetchCoupons: () => Promise<Coupon[]>;
  createCoupon: (payload: CouponCreatePayload) => Promise<Coupon>;
  deleteCoupon: (id: string) => Promise<void>;
  updateCoupon: (id: string, payload: CouponUpdatePayload) => Promise<void>;
  validateCoupon: (code: string) => Promise<CouponValidationResult>;
  incrementUsedCount: (id: string) => Promise<void>;
} = {
  fetchCoupons: async (): Promise<Coupon[]> => {
    const snap: QuerySnapshot<DocumentData> = await getDocs(collection(db, COUPONS_COLLECTION));
    return snap.docs.map((d) => {
      const data: DocumentData = d.data();
      return {
        id: d.id,
        code: data.code ?? "",
        discountValue: Number(data.discountValue ?? 0),
        isEnabled: data.isEnabled ?? true,
        expiresAt: data.expiresAt ?? null,
        usageLimit: data.usageLimit ?? null,
        usedCount: Number(data.usedCount ?? 0),
        minPurchaseAmount: data.minPurchaseAmount ?? null,
        description: data.description ?? null,
        createdAt: tsToIso(data.createdAt) ?? "",
        updatedAt: tsToIso(data.updatedAt) ?? undefined,
      };
    });
  },

  createCoupon: async (payload: CouponCreatePayload): Promise<Coupon> => {
    const data: Record<string, unknown> = {
      code: payload.code.trim().toUpperCase(),
      discountValue: Number(payload.discountValue),
      isEnabled: payload.isEnabled ?? true,
      expiresAt: payload.expiresAt ?? null,
      usageLimit: payload.usageLimit ?? null,
      usedCount: 0,
      minPurchaseAmount: payload.minPurchaseAmount ?? null,
      description: payload.description ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };
    const ref: DocumentReference = await addDoc(collection(db, COUPONS_COLLECTION), data);
    return { id: ref.id, ...data } as unknown as Coupon;
  },

  deleteCoupon: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, COUPONS_COLLECTION, id));
  },

  updateCoupon: async (id: string, payload: CouponUpdatePayload): Promise<void> => {
    const updateData: Record<string, unknown> = { ...payload, updatedAt: new Date().toISOString() };
    const filtered: Record<string, unknown> = Object.fromEntries(Object.entries(updateData).filter(([_, v]) => v !== undefined));
    await updateDoc(doc(db, COUPONS_COLLECTION, id), filtered);
  },

  validateCoupon: async (code: string): Promise<CouponValidationResult> => {
    const normalized: string = code.trim().toUpperCase();
    if (normalized.length < 3) {
      return { valid: false, error: "El código debe tener al menos 3 caracteres" };
    }

    const q: Query<DocumentData> = query(collection(db, COUPONS_COLLECTION), where("code", "==", normalized));
    const snap: QuerySnapshot<DocumentData> = await getDocs(q);

    if (snap.empty) {
      return { valid: false, error: "Cupón no encontrado" };
    }

    const data: DocumentData = snap.docs[0].data();
    const coupon: Coupon = { id: snap.docs[0].id, ...data } as Coupon;

    if (!coupon.isEnabled) {
      return { valid: false, error: "Este cupón ya no está disponible" };
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return { valid: false, error: "Este cupón ha expirado" };
    }

    if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, error: "Este cupón ha alcanzado su límite de usos" };
    }

    return { valid: true, discountValue: coupon.discountValue };
  },

  incrementUsedCount: async (id: string): Promise<void> => {
    const snap: QuerySnapshot<DocumentData> = await getDocs(collection(db, COUPONS_COLLECTION));
    const coup: QueryDocumentSnapshot<DocumentData> | undefined = snap.docs.find((d) => d.id === id);
    if (coup) {
      const currentCount: number = Number(coup.data().usedCount ?? 0);
      await updateDoc(doc(db, COUPONS_COLLECTION, id), { usedCount: currentCount + 1, updatedAt: new Date().toISOString() });
    }
  },
};
