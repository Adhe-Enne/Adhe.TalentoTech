import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

interface FirebaseConfig {
  apiKey: string;
  appId: string;
  authDomain: string;
  messagingSenderId: string;
  projectId: string;
  storageBucket: string;
}

const requiredEnvVars: Array<{ key: string; name: string }> = [
  { key: "VITE_FIREBASE_API_KEY", name: "apiKey" },
  { key: "VITE_FIREBASE_AUTH_DOMAIN", name: "authDomain" },
  { key: "VITE_FIREBASE_PROJECT_ID", name: "projectId" },
  { key: "VITE_FIREBASE_STORAGE_BUCKET", name: "storageBucket" },
  { key: "VITE_FIREBASE_MESSAGING_SENDER_ID", name: "messagingSenderId" },
  { key: "VITE_FIREBASE_APP_ID", name: "appId" },
];

const missingVars: string[] = requiredEnvVars
  .filter((props) => {
    const { key } = props;
    return !import.meta.env[key];
  })
  .map((props) => {
    const { name, key } = props;
    return `${key} (${name})`;
  });

if (missingVars.length > 0) {
  throw new Error(`Firebase config incompleta. Faltan variables de entorno:\n  - ${missingVars.join("\n  - ")}\n\nVerifica tu archivo .env`);
}

const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app: FirebaseApp = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export default app;
