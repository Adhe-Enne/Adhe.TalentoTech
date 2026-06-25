import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate, type NavigateFunction } from "react-router-dom";

import { buildProductsUrl } from "../../utils/buildProductsUrl";

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
          submit();
        }}
        type="submit"
      >
        <FaSearch aria-hidden="true" className="nav-icon" />
      </button>
    </form>
  );
};

export default SearchForm;
