import { collection, getDocs, query, orderBy, addDoc, doc, updateDoc, deleteDoc, type DocumentData, Query, QuerySnapshot, DocumentReference } from "firebase/firestore";

import type { Product } from "../models";
import type { Category } from "../models/Category"; // Necesario para el mapeo de fetch

import { PRODUCTS_COLLECTION } from "../App.Constants";
import { db } from "../firebase";
import { tsToIso } from "../utils/parseDataUtils"; // Necesario para el mapeo de fetch

interface ProductCreatePayload extends Omit<Partial<Product>, "id" | "createdAt" | "updatedAt"> {
  createdAt?: string;
  updatedAt?: string | null;
}

interface ProductUpdatePayload extends Omit<Partial<Product>, "id" | "createdAt" | "updatedAt"> {
  updatedAt?: string;
}

export const productService: {
  fetchProducts: () => Promise<Product[]>;
  createProduct: (productData: ProductCreatePayload) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  updateProduct: (id: string, productData: ProductUpdatePayload) => Promise<void>;
} = {
  /**
   * Obtiene todos los productos de Firestore.
   * @returns {Promise<Product[]>} Una promesa que resuelve con un array de productos.
   */
  fetchProducts: async (): Promise<Product[]> => {
    const q: Query<DocumentData> = query(collection(db, PRODUCTS_COLLECTION), orderBy("createdAt", "desc"));
    const snap: QuerySnapshot<DocumentData> = await getDocs(q);

    return snap.docs.map((d) => {
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
        isEnabled: data.isEnabled ?? true,
        createdAt: tsToIso(data.createdAt) ?? "", // tsToIso está en utils/parseDataUtils
        updatedAt: tsToIso(data.updatedAt) ?? undefined,
      };
    });
  },

  /**
   * Crea un nuevo producto en Firestore.
   * @param {ProductCreatePayload} productData Los datos parciales del producto a crear.
   * @returns {Promise<Product>} Una promesa que resuelve con el producto creado (incluyendo su ID).
   */
  createProduct: async (productData: ProductCreatePayload): Promise<Product> => {
    const payload: ProductCreatePayload = {
      name: productData.name,
      description: productData.description,
      price: Number(productData.price ?? 0),
      image: productData.image ?? (Array.isArray(productData.images) ? productData.images[0] : null) ?? "/images/avatar1.svg",
      images: productData.images ?? [],
      categoryId: productData.categoryId,
      tagIds: productData.tagIds ?? [],
      isEnabled: productData.isEnabled ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };

    const ref: DocumentReference = await addDoc(collection(db, PRODUCTS_COLLECTION), payload);
    return {
      id: ref.id,
      name: payload.name ?? "Sin nombre",
      description: payload.description ?? "",
      price: payload.price ?? 0,
      stock: payload.stock ?? 0, // Asumimos 0 si no se proporciona
      image: payload.image ?? "/images/avatar1.svg",
      images: payload.images,
      currency: payload.currency ?? "USD", // Asumimos USD si no se proporciona
      categoryId: payload.categoryId ? String(payload.categoryId) : "",
      tagIds: payload.tagIds,
      isEnabled: payload.isEnabled ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      category: null, // Asumimos null
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
    const payload: ProductUpdatePayload = {
      name: productData.name,
      description: productData.description,
      price: productData.price !== undefined ? Number(productData.price) : undefined,
      image: productData.image,
      images: productData.images,
      categoryId: productData.categoryId,
      tagIds: productData.tagIds,
      isEnabled: productData.isEnabled,
      updatedAt: new Date().toISOString(),
    };

    const filteredPayload: Record<string, unknown> = Object.fromEntries(Object.entries(payload).filter(([_, v]) => v !== undefined));

    await updateDoc(productRef, filteredPayload);
  },
};
