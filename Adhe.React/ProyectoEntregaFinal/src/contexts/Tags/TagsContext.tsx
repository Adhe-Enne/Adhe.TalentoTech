import type { Tag } from "../../models/Tag";

import { createTypedContext } from "../../utils/context";

export type TagsContextType = {
  tags: Tag[];
  loading: boolean;
  findById: (id: string) => Tag | undefined;
  reload: () => void;
  createTag: (name: string, categoryId: string) => Promise<Tag | undefined>;
};

export default createTypedContext<TagsContextType>();
