import React, { useMemo } from "react";

import type { Tag } from "../../../models/Tag";

interface TagAutocompleteProps {
  allTags: Tag[];
  selectedTags: string[];
  showSuggestions: boolean;
  suggestionsRef: React.RefObject<HTMLUListElement | null>;
  tagQuery: string;
  categoriaId?: string;
  onAdd: (name: string) => void;
  onQueryChange: (query: string) => void;
  onRemove: (name: string) => void;
  onShowSuggestions: (show: boolean) => void;
}

const TagAutocomplete: React.FC<TagAutocompleteProps> = (props) => {
  const { allTags, categoriaId, selectedTags, tagQuery, onAdd, onQueryChange, onRemove, showSuggestions, onShowSuggestions, suggestionsRef } = props;

  const queryLower: string = tagQuery.trim().toLowerCase();
  const suggestions: Tag[] = useMemo((): Tag[] => {
    if (!queryLower) {
      return [];
    }
    return allTags
      .filter((t) => !selectedTags.includes(t.name))
      .filter((t) => !categoriaId || t.categoryId === categoriaId)
      .filter((t) => t.name.toLowerCase().startsWith(queryLower) || t.name.toLowerCase().includes(queryLower))
      .slice(0, 10);
  }, [allTags, selectedTags, queryLower, categoriaId]);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="tags-input">
        Tags
      </label>
      <div className="relative">
        <input
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent focus:border-accent"
          id="tags-input"
          onChange={(e) => {
            onQueryChange(e.target.value);
            onShowSuggestions(true);
          }}
          onFocus={() => onShowSuggestions(true)}
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd(tagQuery);
            }
          }}
          placeholder="Buscar o crear tag"
          value={tagQuery}
        />
        {showSuggestions && (suggestions.length > 0 || tagQuery.trim().length > 0) && (
          <ul
            className="absolute left-0 right-0 top-[44px] bg-white border border-[rgba(33,53,71,0.08)] shadow-[0_6px_18px_rgba(33,53,71,0.04)] rounded-lg list-none mt-[6px] p-[6px_0] z-[120] max-h-[200px] overflow-auto"
            ref={suggestionsRef}
          >
            {suggestions.map((s) => (
              <li key={s.id}>
                <button
                  className="px-3 py-2 cursor-pointer hover:bg-[rgba(15,102,112,0.06)] w-full text-left"
                  onMouseDown={(ev) => {
                    ev.preventDefault();
                    onAdd(s.name);
                  }}
                  type="button"
                >
                  {s.name}
                </button>
              </li>
            ))}
            {suggestions.length === 0 && tagQuery.trim().length > 0 && (
              <li>
                <button
                  className="px-3 py-2 cursor-pointer hover:bg-[rgba(15,102,112,0.06)] w-full text-left"
                  onMouseDown={(ev) => {
                    ev.preventDefault();
                    onAdd(tagQuery);
                  }}
                  type="button"
                >
                  Crear tag &ldquo;{tagQuery.trim()}&rdquo;
                </button>
              </li>
            )}
          </ul>
        )}
      </div>
      <div className="mt-2">
        {allTags
          .filter((t) => selectedTags.includes(t.id))
          .map((t) => (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700 mr-1" key={t.id}>
              {t.name}{" "}
              <button aria-label={`Eliminar tag ${t.name}`} className="text-white hover:text-gray-300 ms-1 text-sm px-1 py-0.5 bg-transparent border-0" onClick={() => onRemove(t.name)} type="button">
                ×
              </button>
            </span>
          ))}
      </div>
    </div>
  );
};

export default TagAutocomplete;
