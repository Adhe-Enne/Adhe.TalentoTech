import type { BaseEntity } from "./BaseEntity";

export interface Category extends BaseEntity {
  name: string;
  categorySlug?: string;
}
