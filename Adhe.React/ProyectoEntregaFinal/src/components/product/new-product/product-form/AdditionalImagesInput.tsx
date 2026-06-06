import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";

import styles from "./Product.module.css";

interface Props {
  files: File[];
  existingUrls?: string[];
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
  onExistingChange?: (urls: string[]) => void;
}

const AdditionalImagesInput: React.FC<Props> = (props) => {
  const { files, existingUrls, onChange, onExistingChange, inputId, hideUploadButton } = props;
  const uid: string = React.useId();
  const id: string = inputId ?? uid;
  const previews: string[] = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  const scrollRef: React.RefObject<HTMLDivElement | null> = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const hasItems: boolean = (existingUrls?.length ?? 0) > 0 || previews.length > 0;

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
  }, [previews, existingUrls, updateScrollState]);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>): void {
    const list: FileList | null = e.target.files;
    if (!list?.length) {
      return;
    }
    const arr: File[] = Array.from(list);
    onChange([...files, ...arr]);
    e.currentTarget.value = "";
  }

  function removeFileAt(i: number): void {
    onChange(files.filter((_, idx) => idx !== i));
  }

  function removeExistingAt(i: number): void {
    if (!existingUrls || !onExistingChange) return;
    onExistingChange(existingUrls.filter((_, idx) => idx !== i));
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
          {!hasItems && (
            <div className="text-muted small py-3">No hay imágenes adicionales</div>
          )}
          {existingUrls?.map((url, idx) => (
            <div className={styles.thumbWrap} key={`existing-${url}`}>
              <img alt={`imagen existente ${idx + 1}`} className={styles.additionalThumb} src={url} />
              <button
                aria-label={`Eliminar imagen existente ${idx + 1}`}
                className={styles.thumbRemove}
                onClick={() => removeExistingAt(idx)}
                type="button"
              >
                ×
              </button>
            </div>
          ))}
          {previews.map((u, idx) => (
            <div className={styles.thumbWrap} key={u}>
              <img alt={`preview-${idx}`} className={styles.additionalThumb} src={u} />
              <button
                aria-label={`Eliminar imagen adicional ${idx + 1}`}
                className={styles.thumbRemove}
                onClick={() => removeFileAt(idx)}
                type="button"
              >
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
