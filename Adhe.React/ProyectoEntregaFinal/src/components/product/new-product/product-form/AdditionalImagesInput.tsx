import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";

import styles from "./Product.module.css";

interface Props {
  files: File[];
  /**
   * When true, the internal upload label is hidden (so parent may render it).
   */
  hideUploadButton?: boolean;
  /**
   * If provided, the input element will use this id so the parent can render
   * an external label (e.g. to place the upload button beside the heading).
   */
  inputId?: string;
  onChange: (files: File[]) => void;
}

const AdditionalImagesInput: React.FC<Props> = (props) => {
  const { files, onChange, inputId, hideUploadButton } = props;
  const uid: string = React.useId();
  const id: string = inputId ?? uid;
  const previews: string[] = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  const scrollRef: React.RefObject<HTMLDivElement | null> = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState: () => void = useCallback(() => {
    const el: HTMLDivElement | null = scrollRef.current;
    if (!el) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    return (): void => {
      previews.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [previews]);

  useEffect(() => {
    updateScrollState();
    const el: HTMLDivElement | null = scrollRef.current;
    if (!el) {
      return undefined;
    }
    const onScroll: () => void = () => updateScrollState();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return (): void => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [previews, updateScrollState]);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>): void {
    const list: FileList | null = e.target.files;
    if (!list?.length) {
      return;
    }
    const arr: File[] = Array.from(list);
    onChange([...files, ...arr]);
    e.currentTarget.value = "";
  }

  function removeAt(i: number): void {
    onChange(files.filter((_, idx) => idx !== i));
  }

  function scrollByOffset(offset: number): void {
    const el: HTMLDivElement | null = scrollRef.current;
    if (!el) {
      return;
    }
    el.scrollBy({ left: offset, behavior: "smooth" });
  }

  return (
    <div className={styles.additionalImages}>
      {!hideUploadButton && (
        <label className={`btn btn-sm btn-outline-primary ${styles.uploadLabel}`} htmlFor={id}>
          <span>Seleccionar imágenes</span>
        </label>
      )}
      <input accept="image/*" className={styles.hiddenInput} id={id} multiple onChange={handleFiles} type="file" />
      <div className={styles.thumbScrollWrap}>
        {canScrollLeft && (
          <button aria-label="Desplazar izquierda" className={`${styles.scrollBtn} ${styles.left}`} onClick={() => scrollByOffset(-240)} type="button">
            ‹
          </button>
        )}
        <div className={`${styles.additionalGrid} mt-2`} ref={scrollRef}>
          {previews.map((u, idx) => (
            <div className={styles.thumbWrap} key={u}>
              <img alt={`preview-${idx}`} className={styles.additionalThumb} src={u} />
              <button aria-label={`Eliminar imagen adicional ${idx + 1}`} className={styles.thumbRemove} onClick={() => removeAt(idx)} type="button">
                ×
              </button>
            </div>
          ))}
        </div>
        {canScrollRight && (
          <button aria-label="Desplazar derecha" className={`${styles.scrollBtn} ${styles.right}`} onClick={() => scrollByOffset(240)} type="button">
            ›
          </button>
        )}
      </div>
    </div>
  );
};

export default AdditionalImagesInput;
