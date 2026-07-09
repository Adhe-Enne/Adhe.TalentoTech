import React from "react";
import { FaCloudUploadAlt, FaTimes } from "react-icons/fa";

import type { ImagePreviewProps } from "./ProductFormTypes";

const ProductImagePreview: React.FC<ImagePreviewProps> = (props) => {
  const { name, url, onFileChange, onClear } = props;
  return (
    <div>
      {url ? (
        <>
          <img alt="preview" className="w-full h-[320px] object-cover rounded-lg" src={url} />
          <button aria-label="Eliminar imagen principal" className="absolute top-4 right-4 bg-black/60 text-white w-7 h-7 rounded-full border-none flex items-center justify-center cursor-pointer z-[60]" onClick={onClear} type="button">
            <FaTimes aria-hidden="true" />
          </button>
        </>
      ) : (
        <div className="text-gray-400 text-sm text-center p-2">Previsualización de imagen</div>
      )}
      <div className="absolute bottom-4 left-4 flex gap-2 items-center z-[40]">
        <label aria-label="Seleccionar imagen del producto" className="bg-accent/5 border border-accent/15 text-accent px-3 py-1.5 rounded-xl shadow-sm hover:bg-accent/10 text-sm cursor-pointer inline-flex items-center gap-2 transition-all duration-150 hover:-translate-y-0.5">
          <FaCloudUploadAlt aria-hidden="true" className="mr-1" />
          Seleccionar
          <input accept="image/*" className="hidden" onChange={(e) => onFileChange(e.target.files?.[0] ?? null)} type="file" />
        </label>
      </div>
      <div className="absolute bottom-[72px] right-3 text-sm text-gray-400 bg-white/95 p-[6px_8px] rounded-md shadow-[var(--shadow-soft)] pointer-events-none z-[30]">{name ?? "Sin imagen"}</div>
    </div>
  );
};

export default ProductImagePreview;
