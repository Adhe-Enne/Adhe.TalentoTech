import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  type DocumentData,
  type DocumentReference,
  type Query,
  type QueryDocumentSnapshot,
  type QuerySnapshot,
} from "firebase/firestore";

import type { Product } from "../models";
import type { Category } from "../models/Category";
import type { PaginatedResult } from "../types";

import { PRODUCTS_COLLECTION } from "../App.Constants";
import { db } from "../firebase";
import { timestamps, stripUndefined } from "../utils/firestore";
import { tsToIso } from "../utils/parseDataUtils";

interface ProductCreatePayload extends Omit<Partial<Product>, "id" | "createdAt" | "updatedAt"> {
  createdAt?: string;
  updatedAt?: string | null;
}

interface ProductUpdatePayload extends Omit<Partial<Product>, "id" | "createdAt" | "updatedAt"> {
  updatedAt?: string;
}

function buildProductPayload(data: ProductCreatePayload | ProductUpdatePayload): Record<string, unknown> {
  return {
    name: data.name,
    description: data.description,
    stock: data.stock,
    categoryId: data.categoryId,
    image: data.image,
    images: data.images,
    currency: data.currency,
    tagIds: data.tagIds,
    isEnabled: data.isEnabled,
  };
}

function mapDocToProduct(d: QueryDocumentSnapshot<DocumentData>): Product {
  const data: DocumentData = d.data();

  return {
    id: d.id,
    name: data.name ?? "Sin nombre",
    description: data.description,
    price: Number(data.price ?? 0),
    stock: data.stock ?? data.quantity ?? 0,
    image: data.image ?? (Array.isArray(data.images) ? data.images[0] : undefined) ?? "/images/avatar1.svg",
    images: Array.isArray(data.images) ? data.images : undefined,
    currency: data.currency,
    categoryId: data.categoryId ?? data.category?.id,
    category: data.category as Category,
    tagIds: Array.isArray(data.tagIds) ? data.tagIds : undefined,
    isEnabled: data.isEnabled,
    createdAt: tsToIso(data.createdAt) ?? "",
    updatedAt: tsToIso(data.updatedAt) ?? undefined,
  };
}

export const productService: {
  fetchProducts: () => Promise<Product[]>;
  fetchProductsPage: (pageSize: number, lastKey?: string) => Promise<PaginatedResult<Product>>;
  createProduct: (productData: ProductCreatePayload) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  updateProduct: (id: string, productData: ProductUpdatePayload) => Promise<void>;
} = {
  fetchProducts: async (): Promise<Product[]> => {
    const q: Query<DocumentData> = query(collection(db, PRODUCTS_COLLECTION), orderBy("createdAt", "desc"));
    const snap: QuerySnapshot<DocumentData> = await getDocs(q);
    return snap.docs.map(mapDocToProduct);
  },

  fetchProductsPage: async (pageSize: number, lastKey?: string): Promise<PaginatedResult<Product>> => {
    const constraints: readonly [ReturnType<typeof orderBy>, ReturnType<typeof limit>] = [orderBy("createdAt", "desc"), limit(pageSize)];
    const q: Query<DocumentData> = lastKey ? query(collection(db, PRODUCTS_COLLECTION), ...constraints, startAfter(lastKey)) : query(collection(db, PRODUCTS_COLLECTION), ...constraints);
    const snap: QuerySnapshot<DocumentData> = await getDocs(q);
    const items: Product[] = snap.docs.map(mapDocToProduct);
    const lastDoc: QueryDocumentSnapshot<DocumentData> | undefined = snap.docs.at(-1);
    return {
      items,
      lastKey: lastDoc ? (tsToIso(lastDoc.data().createdAt) ?? lastDoc.id) : null,
      hasMore: items.length === pageSize,
    };
  },

  /**
   * Crea un nuevo producto en Firestore.
   * @param {ProductCreatePayload} productData Los datos parciales del producto a crear.
   * @returns {Promise<Product>} Una promesa que resuelve con el producto creado (incluyendo su ID).
   */
  createProduct: async (productData: ProductCreatePayload): Promise<Product> => {
    const payload: ProductCreatePayload = {
      ...(buildProductPayload(productData) as ProductCreatePayload),
      price: Number(productData.price ?? 0),
      image: productData.image ?? (Array.isArray(productData.images) ? productData.images[0] : null) ?? "/images/avatar1.svg",
      images: productData.images ?? [],
      tagIds: productData.tagIds ?? [],
      isEnabled: productData.isEnabled ?? true,
      ...timestamps.onCreate(),
    };

    const ref: DocumentReference = await addDoc(collection(db, PRODUCTS_COLLECTION), payload);
    return {
      id: ref.id,
      name: payload.name ?? "Sin nombre",
      description: payload.description ?? "",
      price: payload.price ?? 0,
      stock: payload.stock ?? 0,
      image: payload.image ?? "/images/avatar1.svg",
      images: payload.images,
      currency: payload.currency ?? "USD",
      categoryId: payload.categoryId ? String(payload.categoryId) : "",
      tagIds: payload.tagIds,
      isEnabled: payload.isEnabled ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      category: null,
    };
  },

  deleteProduct: async (id: string): Promise<void> => {
    const productRef: DocumentReference<DocumentData, DocumentData> = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(productRef);
  },

  /**
   * Actualiza un producto existente en Firestore.
   * @param {string} id El ID del producto a actualizar.
   * @param {ProductUpdatePayload} productData Los datos parciales a actualizar.
   * @returns {Promise<void>} Una promesa que resuelve cuando la actualización se completa.
   */
  updateProduct: async (id: string, productData: ProductUpdatePayload): Promise<void> => {
    const productRef: DocumentReference<DocumentData, DocumentData> = doc(db, PRODUCTS_COLLECTION, id);
    const payload: Record<string, unknown> = {
      ...buildProductPayload(productData),
      price: productData.price == null ? undefined : Number(productData.price),
      ...timestamps.onUpdate(),
    };
    const filteredPayload: Record<string, unknown> = stripUndefined(payload);

    await updateDoc(productRef, filteredPayload);
  },
};
