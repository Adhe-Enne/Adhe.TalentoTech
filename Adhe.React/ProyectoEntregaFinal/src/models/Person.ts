export interface Person {
  id: string; // Firestore document id (string)
  name: string;
  bio?: string;
  email?: string;
  linkedin?: string;
  order?: number;
  photo?: string; // legacy field name used in project
  position?: string;
}
