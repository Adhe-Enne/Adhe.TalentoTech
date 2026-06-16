import {
  createUserWithEmailAndPassword,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User as FirebaseUser,
  type UserCredential,
} from "firebase/auth";
import { doc, getDoc, setDoc, type DocumentReference, type DocumentSnapshot } from "firebase/firestore";

import type { User } from "../models/User";

import { USERS_COLLECTION } from "../App.Constants";
import { auth, db } from "../firebase";

const SESSION_KEY: string = "tt_current_user";

export interface UserInfo {
  email: string;
  rol: "admin" | "user";
  uid: string;
}

type AuthStateListener = (user: UserInfo | null) => void;

const listeners: Set<AuthStateListener> = new Set();
let cachedUser: UserInfo | null = null;
let authUnsubscribe: (() => void) | null = null;

function getStoredSession(): UserInfo | null {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) ?? "null");
  } catch {
    return null;
  }
}

function setStoredSession(user: UserInfo | null): void {
  cachedUser = user;
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

function notifyListeners(user: UserInfo | null): void {
  listeners.forEach((cb) => cb(user));
}

cachedUser = getStoredSession();

function translateAuthError(error: unknown): string {
  if (error instanceof Error) {
    const code: string = (error as { code?: string }).code ?? "";
    switch (code) {
      case "auth/email-already-in-use":
        return "Este correo electrónico ya está registrado";
      case "auth/user-not-found":
        return "Usuario no encontrado";
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Correo electrónico o contraseña incorrectos";
      case "auth/invalid-email":
        return "Correo electrónico inválido";
      case "auth/weak-password":
        return "La contraseña debe tener al menos 6 caracteres";
      case "auth/too-many-requests":
        return "Demasiados intentos. Intentá de nuevo más tarde";
      case "auth/network-request-failed":
        return "Error de conexión. Verificá tu internet";
      default:
        return error.message;
    }
  }
  return "Error desconocido";
}

function syncUserFromFirestore(firebaseUser: FirebaseUser): void {
  const cached: UserInfo | null = getStoredSession();

  if (cached?.uid === firebaseUser.uid) {
    notifyListeners(cached);
  }

  const docRef: DocumentReference = doc(db, USERS_COLLECTION, firebaseUser.uid);

  getDoc(docRef)
    .then((docSnap: DocumentSnapshot) => {
      let userInfo: UserInfo;

      if (docSnap.exists()) {
        const data: User = docSnap.data() as User;
        userInfo = { uid: firebaseUser.uid, email: firebaseUser.email ?? data.email, rol: data.rol ?? "user" };
      } else {
        userInfo = { uid: firebaseUser.uid, email: firebaseUser.email ?? "", rol: "user" };
      }

      setStoredSession(userInfo);
      notifyListeners(userInfo);
    })
    .catch(() => {
      if (cached?.uid !== firebaseUser.uid) {
        const fallback: UserInfo = { uid: firebaseUser.uid, email: firebaseUser.email ?? "", rol: "user" };
        setStoredSession(fallback);
        notifyListeners(fallback);
      }
    });
}

export const authService: {
  login: (email: string, password: string) => Promise<UserInfo>;
  signup: (email: string, password: string) => Promise<UserInfo>;
  logout: () => Promise<void>;
  onAuthStateChanged: (cb: AuthStateListener) => () => void;
  getCurrentSession: () => UserInfo | null;
} = {
  login: async (email: string, password: string): Promise<UserInfo> => {
    const emailLower: string = email.toLowerCase();
    let result: UserCredential;

    try {
      result = await signInWithEmailAndPassword(auth, emailLower, password);
    } catch (error: unknown) {
      throw new Error(translateAuthError(error));
    }

    const firebaseUser: FirebaseUser = result.user;
    const docRef: DocumentReference = doc(db, USERS_COLLECTION, firebaseUser.uid);
    const docSnap: DocumentSnapshot = await getDoc(docRef);
    let userInfo: UserInfo;

    if (docSnap.exists()) {
      const data: User = docSnap.data() as User;
      userInfo = { uid: firebaseUser.uid, email: firebaseUser.email ?? data.email, rol: data.rol ?? "user" };
    } else {
      userInfo = { uid: firebaseUser.uid, email: firebaseUser.email ?? emailLower, rol: "user" };
    }

    setStoredSession(userInfo);

    return userInfo;
  },
  signup: async (email: string, password: string): Promise<UserInfo> => {
    const emailLower: string = email.toLowerCase();
    let result: UserCredential;

    try {
      result = await createUserWithEmailAndPassword(auth, emailLower, password);
    } catch (error: unknown) {
      throw new Error(translateAuthError(error));
    }

    const firebaseUser: FirebaseUser = result.user;
    const { uid } = firebaseUser;

    await setDoc(doc(db, USERS_COLLECTION, uid), {
      email: emailLower,
      rol: "user",
      createdAt: new Date().toISOString(),
      updatedAt: null,
    });

    const userInfo: UserInfo = { uid, email: emailLower, rol: "user" };
    setStoredSession(userInfo);

    return userInfo;
  },

  logout: async (): Promise<void> => {
    await signOut(auth);
  },
  onAuthStateChanged: (cb: AuthStateListener): (() => void) => {
    listeners.add(cb);

    authUnsubscribe ??= firebaseOnAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser === null) {
        setStoredSession(null);
        notifyListeners(null);
      } else {
        syncUserFromFirestore(firebaseUser);
      }
    });

    if (cachedUser) {
      cb(cachedUser);
    }

    return (): void => {
      listeners.delete(cb);

      if (listeners.size === 0 && authUnsubscribe) {
        authUnsubscribe();
        authUnsubscribe = null;
      }
    };
  },

  getCurrentSession: (): UserInfo | null => {
    return cachedUser;
  },
} as const;
