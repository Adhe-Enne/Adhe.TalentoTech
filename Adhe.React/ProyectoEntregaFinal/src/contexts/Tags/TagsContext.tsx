import type { Tag } from "../../models/Tag";

import { createTypedContext } from "../../utils/context";

export interface TagsContextType {
  loading: boolean;
  tags: Tag[];
  createTag: (name: string, categoryId: string) => Promise<Tag | undefined>;
  findById: (id: string) => Tag | undefined;
  reload: () => void;
};

export default createTypedContext<TagsContextType>();
