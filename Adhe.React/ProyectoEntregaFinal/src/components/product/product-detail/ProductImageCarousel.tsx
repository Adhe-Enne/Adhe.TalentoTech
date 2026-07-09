import React, { useState, useCallback } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import { DEFAULT_AVATAR_URL } from "../../../App.Constants";

interface Props {
  images: string[];
  alt?: string;
}

const ProductImageCarousel: React.FC<Props> = (props) => {
  const { images, alt = "Imagen del producto" } = props;

  const imgs: string[] = images?.length ? images : [DEFAULT_AVATAR_URL];

  const [index, setIndex] = useState<number>(0);

  const prev: () => void = useCallback(() => setIndex((i) => (i - 1 + imgs.length) % imgs.length), [imgs.length]);
  const next: () => void = useCallback(() => setIndex((i) => (i + 1) % imgs.length), [imgs.length]);

  return (
    <div className="relative aspect-[3/4] w-full">
      <img alt={alt} className="w-full h-full object-contain rounded-t-sm" loading="lazy" src={imgs[index]} />
      {imgs.length > 1 && (
        <div className="absolute top-1/2 left-0 right-0 flex justify-between -translate-y-1/2 pointer-events-none">
          <button aria-label="Anterior" className="pointer-events-auto bg-black/35 border-0 text-white py-[0.35rem] px-2 mx-2 rounded" onClick={prev}>
            <FaChevronLeft aria-hidden="true" />
          </button>
          <button aria-label="Siguiente" className="pointer-events-auto bg-black/35 border-0 text-white py-[0.35rem] px-2 mx-2 rounded" onClick={next}>
            <FaChevronRight aria-hidden="true" />
          </button>
        </div>
      )}

      {imgs.length > 1 && (
        <div className="flex gap-2 mt-2">
          {imgs.map((s, i) => (
            <button aria-label={`${alt} ${i + 1}`} className="p-0 border-0 bg-transparent" key={s} onClick={() => setIndex(i)} type="button">
              <img alt={`${alt} ${i + 1}`} className={`w-[60px] h-[60px] object-cover rounded-md cursor-pointer opacity-80 ${i === index ? "outline-2 outline-[var(--color-cta,#007bff)] opacity-100" : ""}`} loading="lazy" src={s} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageCarousel;
