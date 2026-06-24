import React from "react";
import { Button, InputGroup } from "react-bootstrap";
import { FaSearch, FaTimes } from "react-icons/fa";

interface SearchBarProps {
  localQ: string;
  productCount: number;
  onLocalQChange?: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = (props) => {
  const { localQ, productCount, onLocalQChange } = props;
  const hasLocalFilter: boolean = localQ.trim().length > 0;

  return (
    <div className="mb-3">
      <InputGroup>
        <InputGroup.Text>
          <FaSearch aria-hidden="true" />
        </InputGroup.Text>
        <input
          aria-label="Filtrar productos por nombre"
          className="form-control"
          onChange={(e) => onLocalQChange?.(e.target.value)}
          placeholder="Filtrar resultados..."
          type="text"
          value={localQ}
        />
        {hasLocalFilter && (
          <Button aria-label="Limpiar filtro local" onClick={() => onLocalQChange?.("")} variant="outline-secondary">
            <FaTimes aria-hidden="true" className="me-1" />
            Limpiar
          </Button>
        )}
      </InputGroup>
      {hasLocalFilter && (
        <small className="text-muted mt-1 d-block">
          {productCount} producto{productCount === 1 ? "" : "s"} encontrado{productCount === 1 ? "" : "s"} para &quot;{localQ}&quot;
        </small>
      )}
    </div>
  );
};

export default SearchBar;
