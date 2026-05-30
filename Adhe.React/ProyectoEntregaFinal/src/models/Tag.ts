import type { BaseEntity } from "./BaseEntity";

export interface Tag extends BaseEntity {
  categoryId: string; //doc id
  name: string;
}
