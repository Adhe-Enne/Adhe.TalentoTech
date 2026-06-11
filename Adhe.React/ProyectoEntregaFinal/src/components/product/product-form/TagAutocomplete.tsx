import React, { useMemo } from "react";

import type { Tag } from "../../../models/Tag";

import styles from "./Product.module.css";

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
    <div style={{ position: "relative" }}>
      <label className="form-label" htmlFor="tags-input">
        Tags
      </label>
      <div style={{ position: "relative" }}>
        <input
          className="form-control"
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
          <ul className={styles.tagSuggestions} ref={suggestionsRef}>
            {suggestions.map((s) => (
              <li key={s.id}>
                <button
                  className={styles.suggestionItem}
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
                  className={styles.suggestionItem}
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
        {selectedTags.map((t: string) => (
          <span className="badge bg-secondary me-1" key={t}>
            {t}{" "}
            <button aria-label={`Eliminar tag ${t}`} className="btn btn-sm btn-link text-white ms-1" onClick={() => onRemove(t)} type="button">
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagAutocomplete;
