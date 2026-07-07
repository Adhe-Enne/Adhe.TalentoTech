import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  type DocumentData,
  type DocumentReference,
  type QuerySnapshot,
  Query,
} from "firebase/firestore";

import type { Coupon, CouponCreatePayload, CouponUpdatePayload, CouponValidationResult } from "../models";

import { COUPONS_COLLECTION } from "../App.Constants";
import { db } from "../firebase";
import { isCouponExpired } from "../utils/couponUtils";
import { timestamps, stripUndefined } from "../utils/firestore";
import { mapTimestamps } from "../utils/parseDataUtils";

function mapDocToCoupon(data: DocumentData, id: string): Coupon {
  return {
    id,
    code: data.code ?? "",
    discountValue: Number(data.discountValue ?? 0),
    isEnabled: data.isEnabled ?? true,
    expiresAt: data.expiresAt ?? null,
    usageLimit: data.usageLimit ?? null,
    usedCount: Number(data.usedCount ?? 0),
    minPurchaseAmount: data.minPurchaseAmount ?? null,
    description: data.description ?? null,
    ...mapTimestamps(data),
  };
}

async function findCouponByCode(code: string): Promise<QuerySnapshot<DocumentData> | null> {
  const normalized: string = code.trim().toUpperCase();
  if (normalized.length < 3) {
    return null;
  }
  const q: Query<DocumentData> = query(collection(db, COUPONS_COLLECTION), where("code", "==", normalized));
  return await getDocs(q);
}

export const couponService: {
  fetchCoupons: () => Promise<Coupon[]>;
  createCoupon: (payload: CouponCreatePayload) => Promise<Coupon>;
  deleteCoupon: (id: string) => Promise<void>;
  updateCoupon: (id: string, payload: CouponUpdatePayload) => Promise<void>;
  validateCoupon: (code: string) => Promise<CouponValidationResult>;
  checkCodeExists: (code: string) => Promise<boolean>;
} = {
  fetchCoupons: async (): Promise<Coupon[]> => {
    const snap: QuerySnapshot<DocumentData> = await getDocs(collection(db, COUPONS_COLLECTION));
    return snap.docs.map((d) => mapDocToCoupon(d.data(), d.id));
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
      ...timestamps.onCreate(),
    };
    const ref: DocumentReference = await addDoc(collection(db, COUPONS_COLLECTION), data);
    return { id: ref.id, ...data } as unknown as Coupon;
  },

  deleteCoupon: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, COUPONS_COLLECTION, id));
  },

  updateCoupon: async (id: string, payload: CouponUpdatePayload): Promise<void> => {
    const updateData: Record<string, unknown> = { ...payload, ...timestamps.onUpdate() };
    const filtered: Record<string, unknown> = stripUndefined(updateData);
    await updateDoc(doc(db, COUPONS_COLLECTION, id), filtered);
  },

  validateCoupon: async (code: string): Promise<CouponValidationResult> => {
    const snap: QuerySnapshot<DocumentData> | null = await findCouponByCode(code);
    if (!snap || snap.empty) {
      return { valid: false, error: snap === null ? "El código debe tener al menos 3 caracteres" : "Cupón no encontrado" };
    }

    const data: DocumentData = snap.docs[0].data();
    const coupon: Coupon = { id: snap.docs[0].id, ...data } as Coupon;

    if (!coupon.isEnabled) {
      return { valid: false, error: "Este cupón ya no está disponible" };
    }

    if (isCouponExpired(coupon.expiresAt)) {
      return { valid: false, error: "Este cupón ha expirado" };
    }

    if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, error: "Este cupón ha alcanzado su límite de usos" };
    }
    return { valid: true, discountValue: coupon.discountValue, id: coupon.id, expiresAt: coupon.expiresAt ?? null };
  },

  checkCodeExists: async (code: string): Promise<boolean> => {
    const snap: QuerySnapshot<DocumentData> | null = await findCouponByCode(code);
    return snap ? !snap.empty : false;
  },
};
