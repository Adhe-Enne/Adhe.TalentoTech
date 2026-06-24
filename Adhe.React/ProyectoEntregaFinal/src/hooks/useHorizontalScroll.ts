import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

interface UseHorizontalScrollReturn {
  canScrollLeft: boolean;
  canScrollRight: boolean;
  scrollRef: RefObject<HTMLDivElement | null>;
  refreshScrollState: () => void;
  scrollByOffset: (offset: number) => void;
}

const useHorizontalScroll: () => UseHorizontalScrollReturn = (): UseHorizontalScrollReturn => {
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

  const { left: canScrollLeft, right: canScrollRight }: { left: boolean; right: boolean } = scrollState;
  return { canScrollLeft, canScrollRight, scrollRef, refreshScrollState, scrollByOffset };
};

export default useHorizontalScroll;
