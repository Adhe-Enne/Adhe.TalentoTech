import type { BaseEntity } from "./BaseEntity";

export interface Person extends BaseEntity {
  name: string;
  bio?: string;
  email?: string;
  linkedin?: string;
  order?: number;
  photo?: string;
  position?: string;
}