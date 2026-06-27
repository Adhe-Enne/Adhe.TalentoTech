import type { UserRole } from "../types/shared";
import type { BaseEntity } from "./BaseEntity";

export interface User extends BaseEntity {
  email: string;
  rol?: UserRole;
}
