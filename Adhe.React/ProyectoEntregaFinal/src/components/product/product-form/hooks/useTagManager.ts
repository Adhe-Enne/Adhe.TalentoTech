import { useEffect, useRef, useState, type Dispatch, type RefObject, type SetStateAction } from "react";

import type { Tag } from "../../../../models/Tag";

interface TagManagerDeps {
  allTags: Tag[];
  categoriaId: string;
  tagIds: string[];
  tags: string[];
}

interface TagManagerActions {
  setShowSuggestions: Dispatch<SetStateAction<boolean>>;
  setTagQuery: Dispatch<SetStateAction<string>>;
  showSuggestions: boolean;
  suggestionsRef: RefObject<HTMLUListElement | null>;
  tagQuery: string;
  onAddTagFromInput: (tag: string) => Promise<void>;
  onRemoveTag: (tag: string) => void;
}

type SetFieldFn = (field: "tags" | "tagIds", value: string[]) => void;

export function useTagManager(fields: TagManagerDeps, setField: SetFieldFn, createTag: (name: string, categoryId: string) => Promise<Tag | undefined>): TagManagerActions {
  const [tagQuery, setTagQuery] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const suggestionsRef: RefObject<HTMLUListElement | null> = useRef<HTMLUListElement | null>(null);

  useEffect((): (() => void) => {
    function onDocClick(e: MouseEvent): void {
      if (!suggestionsRef.current || !(e.target instanceof Node)) {
        return;
      }
      if (!suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  async function onAddTagFromInput(tag: string): Promise<void> {
    const t: string = tag.trim();
    if (!t || fields.tags.includes(t)) {
      return;
    }

    const existing: Tag | undefined = fields.allTags.find((x) => x.name.toLowerCase() === t.toLowerCase());
    if (existing) {
      setField("tags", [...fields.tags, existing.name]);
      setField("tagIds", [...fields.tagIds, existing.id]);
      setTagQuery("");
      setShowSuggestions(false);
      return;
    }

    try {
      const created: Tag | undefined = await createTag(t, fields.categoriaId ?? "");
      if (created) {
        setField("tags", [...fields.tags, created.name]);
        setField("tagIds", [...fields.tagIds, created.id]);
      } else {
        setField("tags", [...fields.tags, t]);
      }
    } catch {
      setField("tags", [...fields.tags, t]);
    }
    setTagQuery("");
    setShowSuggestions(false);
  }

  function onRemoveTag(tag: string): void {
    const idx: number = fields.tags.indexOf(tag);
    if (idx === -1) {
      return;
    }
    setField(
      "tags",
      fields.tags.filter((x: string) => x !== tag),
    );
    const newTagIds: string[] = [...fields.tagIds];
    if (fields.tagIds.length > idx) {
      newTagIds.splice(idx, 1);
    }
    setField("tagIds", newTagIds);
  }

  return {
    tagQuery,
    showSuggestions,
    suggestionsRef,
    setTagQuery,
    setShowSuggestions,
    onAddTagFromInput,
    onRemoveTag,
  };
}
