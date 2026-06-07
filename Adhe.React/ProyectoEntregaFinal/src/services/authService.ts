/**
 * Servicio de autenticación simulado con Firestore.
 *
 * La sesión activa se persiste en localStorage ("tt_current_user")
 * para evitar verificar Firestore en cada recarga.
 *
 * Los roles (admin/user) se configuran manualmente editando
 * el documento en Firebase Console → campo "rol".
 *
 * Para migrar a Firebase Auth real solo se modifica este archivo.
 */

import { addDoc, collection, CollectionReference, DocumentReference, getDocs, Query, query, QuerySnapshot, where, type DocumentData } from "firebase/firestore";

import type { User } from "../models/User";

import { USERS_COLLECTION } from "../App.Constants";
import { db } from "../firebase";

const SESSION_KEY: string = "tt_current_user";

export interface UserInfo {
  email: string;
  rol: "admin" | "user";
  uid: string;
}

type AuthStateListener = (user: UserInfo | null) => void;

const listeners: Set<AuthStateListener> = new Set();

function getStoredSession(): UserInfo | null {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) ?? "null");
  } catch {
    return null;
  }
}

function setStoredSession(user: UserInfo | null): void {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

function notifyListeners(user: UserInfo | null): void {
  listeners.forEach((cb) => cb(user));
}

const usersCollection: CollectionReference<DocumentData> = collection(db, USERS_COLLECTION);

export const authService: {
  login: (email: string, password: string) => Promise<UserInfo>;
  signup: (email: string, password: string) => Promise<UserInfo>;
  logout: () => Promise<void>;
  onAuthStateChanged: (cb: AuthStateListener) => () => void;
  getCurrentSession: () => UserInfo | null;
} = {
  login: async (email: string, password: string): Promise<UserInfo> => {
    const emailLower: string = email.toLowerCase();

    const q: Query<DocumentData> = query(usersCollection, where("email", "==", emailLower));
    const snapshot: QuerySnapshot<DocumentData> = await getDocs(q);

    if (snapshot.empty) {
      throw new Error("Usuario no encontrado");
    }

    const { docs } = snapshot;
    const [doc] = docs;
    const data: User = doc.data() as User;

    if (data.password !== password) {
      throw new Error("Contraseña incorrecta");
    }

    const rol: "admin" | "user" = data.rol ?? "user";
    const userInfo: UserInfo = { uid: doc.id, email: data.email, rol };

    setStoredSession(userInfo);
    notifyListeners(userInfo);
    return userInfo;
  },

  signup: async (email: string, password: string): Promise<UserInfo> => {
    const emailLower: string = email.toLowerCase();

    const q: Query<DocumentData> = query(usersCollection, where("email", "==", emailLower));
    const snapshot: QuerySnapshot<DocumentData> = await getDocs(q);

    if (!snapshot.empty) {
      throw new Error("Este correo electrónico ya está registrado");
    }

    const docRef: DocumentReference<DocumentData> = await addDoc(usersCollection, {
      email: emailLower,
      password,
      rol: "user",
      createdAt: new Date().toISOString(),
      updatedAt: null,
    });

    const userInfo: UserInfo = { uid: docRef.id, email: emailLower, rol: "user" };

    setStoredSession(userInfo);
    notifyListeners(userInfo);
    return userInfo;
  },

  logout: async (): Promise<void> => {
    setStoredSession(null);
    notifyListeners(null);
  },

  onAuthStateChanged: (cb: AuthStateListener): (() => void) => {
    listeners.add(cb);
    cb(getStoredSession());
    return (): void => {
      listeners.delete(cb);
    };
  },

  getCurrentSession: (): UserInfo | null => {
    return getStoredSession();
  },
};
