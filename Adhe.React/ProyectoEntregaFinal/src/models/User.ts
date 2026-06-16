import type { BaseEntity } from "./BaseEntity";

export interface User extends BaseEntity {
  email: string;
  rol?: "admin" | "user";
}
