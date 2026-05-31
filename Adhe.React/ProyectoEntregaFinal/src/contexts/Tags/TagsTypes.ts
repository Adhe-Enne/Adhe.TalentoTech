import type { Tag } from "../../models/Tag";

export type TagsContextType = {
  tags: Tag[];
  loading: boolean;
  findById: (id: string) => Tag | undefined;
  reload: () => void;
  createTag: (name: string, categoryId: string) => Promise<Tag | undefined>;
};
