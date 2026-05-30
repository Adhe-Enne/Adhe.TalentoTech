import type { BaseEntity } from "./BaseEntity";
import type { Category } from "./Category";
import type { Tag } from "./Tag";

export interface Product extends BaseEntity {
  category: Category;
  categoryId: string; // doc id
  currency: string;
  description: string;
  image: string;
  isEnabled: boolean;
  name: string;
  price: number;
  stock: number;
  images?: string[]; // optional array of additional image URLs
  tagIds?: string[]; // optional array of tag document IDs for easier querying
  tags?: Tag[];
}

/**
 *     "camiseta",
    "minimal",
    "algodón",
    "unisex"
*/
