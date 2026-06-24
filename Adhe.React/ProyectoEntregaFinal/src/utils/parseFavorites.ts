export const parseFavorites: (raw: string | null) => Set<string> = (raw: string | null): Set<string> => {
  if (!raw) {
    return new Set();
  }

  const parsed: unknown = JSON.parse(raw);
  if (Array.isArray(parsed)) {
    return new Set(parsed.map(String).filter(Boolean));
  }

  if (parsed && typeof parsed === "object") {
    return new Set(
      Object.keys(parsed)
        .filter((k) => (parsed as Record<string, unknown>)[k])
        .map(String)
        .filter(Boolean),
    );
  }

  return new Set();
};
