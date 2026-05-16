export const parseFavorites: (raw: string | null) => Set<number> = (raw: string | null): Set<number> => {
  if (!raw) {
    return new Set();
  }

  const parsed: unknown = JSON.parse(raw);
  if (Array.isArray(parsed)) {
    return new Set(parsed.map(Number).filter((n) => !Number.isNaN(n)));
  }

  if (parsed && typeof parsed === "object") {
    return new Set(
      Object.keys(parsed)
        .filter((k) => (parsed as Record<string, unknown>)[k])
        .map(Number),
    );
  }

  return new Set();
};
