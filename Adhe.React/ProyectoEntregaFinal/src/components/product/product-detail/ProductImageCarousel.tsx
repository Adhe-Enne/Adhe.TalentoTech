import React, { useState, useCallback } from "react";

import styles from "./ProductImageCarousel.module.css";

interface Props {
  images: string[];
  alt?: string;
}

const ProductImageCarousel: React.FC<Props> = (props) => {
  const { images, alt = "Imagen del producto" } = props;

  const imgs: string[] = images && images.length ? images : ["/images/avatar1.svg"];

  const [index, setIndex] = useState<number>(0);

  const prev: () => void = useCallback(() => setIndex((i) => (i - 1 + imgs.length) % imgs.length), [imgs.length]);
  const next: () => void = useCallback(() => setIndex((i) => (i + 1) % imgs.length), [imgs.length]);

  return (
    <div className={styles.carousel}>
      <img alt={alt} className={styles.mainImage} src={imgs[index]} />
      {imgs.length > 1 && (
        <div className={styles.controls}>
          <button aria-label="Anterior" className={styles.btn} onClick={prev}>
            ‹
          </button>
          <button aria-label="Siguiente" className={styles.btn} onClick={next}>
            ›
          </button>
        </div>
      )}

      {imgs.length > 1 && (
        <div className={styles.thumbnails}>
          {imgs.map((s, i) => (
            <img alt={`${alt} ${i + 1}`} className={`${styles.thumb} ${i === index ? styles.thumbActive : ""}`} key={i} onClick={() => setIndex(i)} src={s} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageCarousel;
