import React, { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";

interface Props {
  files: File[];
  existingUrls?: string[];
  hideUploadButton?: boolean;
  inputId?: string;
  onChange: (files: File[]) => void;
  onExistingChange?: (urls: string[]) => void;
}

const AdditionalImagesInput: React.FC<Props> = (props) => {
  const { files, existingUrls, onChange, onExistingChange, inputId, hideUploadButton } = props;
  const uid: string = React.useId();
  const id: string = inputId ?? uid;
  const previews: string[] = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  const [scrollState, setScrollState] = useState<{ left: boolean; right: boolean }>({ left: false, right: false });
  const scrollRef: RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);

  const refreshScrollState: () => void = useCallback(() => {
    const el: HTMLDivElement | null = scrollRef.current;
    if (!el) {
      setScrollState({ left: false, right: false });
      return;
    }
    setScrollState({
      left: el.scrollLeft > 0,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 1,
    });
  }, []);

  useEffect((): (() => void) => {
    refreshScrollState();
    const el: HTMLDivElement | null = scrollRef.current;
    if (!el) {
      return (): void => undefined;
    }
    const onScroll: () => void = () => refreshScrollState();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", refreshScrollState);
    return (): void => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", refreshScrollState);
    };
  }, [refreshScrollState]);

  const scrollByOffset: (offset: number) => void = useCallback((offset: number): void => {
    scrollRef.current?.scrollBy({ left: offset, behavior: "smooth" });
  }, []);

  const canScrollLeft: boolean = scrollState.left;
  const canScrollRight: boolean = scrollState.right;

  const hasItems: boolean = (existingUrls?.length ?? 0) > 0 || previews.length > 0;

  useEffect(() => {
    return (): void => {
      previews.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [previews]);

  useEffect((): void => {
    refreshScrollState();
  }, [previews, existingUrls, refreshScrollState]);

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
    if (!existingUrls || !onExistingChange) {
      return;
    }
    onExistingChange(existingUrls.filter((_, idx) => idx !== i));
  }

  return (
    <div className="flex flex-col gap-2">
      {!hideUploadButton && (
        <label className="bg-accent/5 border border-accent/15 text-accent px-3 py-1.5 rounded-xl shadow-sm hover:bg-accent/10 text-sm cursor-pointer inline-flex items-center gap-2 transition-all duration-150 hover:-translate-y-0.5" htmlFor={id}>
          <span>Seleccionar imágenes</span>
        </label>
      )}
      <input accept="image/*" className="hidden" id={id} multiple onChange={handleFiles} type="file" />
      <div className="relative flex items-center">
        {canScrollLeft && (
          <button aria-label="Desplazar izquierda" className="absolute top-1/2 -translate-y-1/2 bg-black/55 text-white w-[34px] h-[34px] rounded-full border-none flex items-center justify-center cursor-pointer z-[60] left-2 disabled:opacity-35 disabled:cursor-not-allowed" disabled={!canScrollLeft} onClick={() => scrollByOffset(-240)} type="button">
            <FaChevronLeft aria-hidden="true" />
          </button>
        )}
        <div className="flex gap-2 items-center overflow-x-auto p-[6px_2px] max-w-full flex-auto mt-2" ref={scrollRef}>
          {!hasItems && <div className="text-gray-500 text-sm py-3">No hay imágenes adicionales</div>}
          {existingUrls?.map((url, idx) => (
            <div className="relative inline-block" key={`existing-${url}`}>
              <img alt={`imagen existente ${idx + 1}`} className="w-20 h-20 object-cover rounded-lg block" src={url} />
              <button aria-label={`Eliminar imagen existente ${idx + 1}`} className="absolute top-[6px] right-[6px] bg-black/60 text-white w-[22px] h-[22px] rounded-full border-none flex items-center justify-center cursor-pointer z-[40] text-sm leading-none" onClick={() => removeExistingAt(idx)} type="button">
                <FaTimes aria-hidden="true" />
              </button>
            </div>
          ))}
          {previews.map((u, idx) => (
            <div className="relative inline-block" key={u}>
              <img alt={`preview-${idx}`} className="w-20 h-20 object-cover rounded-lg block" src={u} />
              <button aria-label={`Eliminar imagen adicional ${idx + 1}`} className="absolute top-[6px] right-[6px] bg-black/60 text-white w-[22px] h-[22px] rounded-full border-none flex items-center justify-center cursor-pointer z-[40] text-sm leading-none" onClick={() => removeFileAt(idx)} type="button">
                <FaTimes aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
        {canScrollRight && (
          <button aria-label="Desplazar derecha" className="absolute top-1/2 -translate-y-1/2 bg-black/55 text-white w-[34px] h-[34px] rounded-full border-none flex items-center justify-center cursor-pointer z-[60] right-2 disabled:opacity-35 disabled:cursor-not-allowed" disabled={!canScrollRight} onClick={() => scrollByOffset(240)} type="button">
            <FaChevronRight aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
};

export default AdditionalImagesInput;
