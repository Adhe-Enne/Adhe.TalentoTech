import type { UserRole } from "./shared";

export interface UserInfo {
  email: string;
  rol: UserRole;
  uid: string;
}
