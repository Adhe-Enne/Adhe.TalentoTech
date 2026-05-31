export interface BaseEntity {
  createdAt: string; // ISO string
  id: string; // Firestore document id (string)
  updatedAt?: string | null; // ISO string, optional for new entities
}
