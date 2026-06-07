import type { BaseEntity } from "./BaseEntity";

export interface User extends BaseEntity {
  email: string;
  password: string;
  rol?: "admin" | "user";
}
