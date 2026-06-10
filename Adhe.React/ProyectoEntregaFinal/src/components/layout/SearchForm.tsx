import React, { useEffect, useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";

import { buildProductsUrl } from "./hooks/buildProductsUrl";

interface SearchFormProps {
  baseSearch: string;
  initialQ: string;
}

const SearchForm: React.FC<SearchFormProps> = (props) => {
  const { baseSearch, initialQ } = props;
  const navigate: NavigateFunction = useNavigate();
  const [value, setValue] = useState<string>(initialQ);
  const [editing, setEditing] = useState(false);

  const submit: (raw?: string) => void = (raw?: string) => {
    const v: string = (raw ?? (editing ? value : initialQ) ?? "").trim();
    const target: string = buildProductsUrl(baseSearch, v && !(editing === false && v === initialQ) ? v : "");
    navigate(target);
  };

  useEffect((): (() => void) => {
    if (editing) {
      return () => undefined;
    }
    const t: ReturnType<typeof setTimeout> = globalThis.setTimeout(() => setValue(initialQ), 0);
    return () => {
      globalThis.clearTimeout(t);
    };
  }, [initialQ, editing]);

  return (
    <form
      className="d-none d-md-flex ms-3 me-auto search-form"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      role="search"
    >
      <input
        aria-label="Buscar productos"
        className="form-control form-control-sm search-input"
        name="q"
        onBlur={() => {
          setEditing(false);
          setValue((s) => (s ? s.trim() : ""));
        }}
        onChange={(e) => {
          const v: string = e.target.value;
          setValue(v.trim() === "" ? "" : v);
          setEditing(true);
        }}
        onFocus={() => {
          setValue(initialQ);
          setEditing(true);
        }}
        placeholder="Buscar productos..."
        value={editing ? value : initialQ}
      />
      <button
        aria-label="Buscar"
        className="search-btn"
        onClick={(ev) => {
          ev.preventDefault();
          const captured: string | undefined = ev.currentTarget.dataset.qvalue || undefined;
          submit(captured);
        }}
        onMouseDown={(ev) => {
          const form: HTMLFormElement | null = (ev.currentTarget as HTMLElement).closest("form") as HTMLFormElement | null;
          const inputVal: string = form ? (form.querySelector('input[name="q"]') as HTMLInputElement)?.value || "" : "";
          ev.currentTarget.dataset.qvalue = inputVal;
        }}
        type="submit"
      >
        <svg aria-hidden className="nav-icon" fill="currentColor" height="20" viewBox="0 0 24 24" width="20">
          <path d="M10 2a8 8 0 1 0 4.9 14.32l4.38 4.38 1.41-1.41-4.38-4.38A8 8 0 0 0 10 2zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12z" />
        </svg>
      </button>
    </form>
  );
};

export default SearchForm;
