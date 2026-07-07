import React, { useState, useCallback } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import { DEFAULT_AVATAR_URL } from "../../../App.Constants";
import styles from "./ProductImageCarousel.module.css";

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
    <div className={styles.carousel}>
      <img alt={alt} className={styles.mainImage} loading="lazy" src={imgs[index]} />
      {imgs.length > 1 && (
        <div className={styles.controls}>
          <button aria-label="Anterior" className={styles.btn} onClick={prev}>
            <FaChevronLeft aria-hidden="true" />
          </button>
          <button aria-label="Siguiente" className={styles.btn} onClick={next}>
            <FaChevronRight aria-hidden="true" />
          </button>
        </div>
      )}

      {imgs.length > 1 && (
        <div className={styles.thumbnails}>
          {imgs.map((s, i) => (
            <button aria-label={`${alt} ${i + 1}`} className={styles.thumbBtn} key={s} onClick={() => setIndex(i)} type="button">
              <img alt={`${alt} ${i + 1}`} className={`${styles.thumb} ${i === index ? styles.thumbActive : ""}`} loading="lazy" src={s} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageCarousel;
