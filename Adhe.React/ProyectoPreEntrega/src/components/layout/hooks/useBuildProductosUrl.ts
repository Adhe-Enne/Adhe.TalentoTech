export const buildProductosUrl: (baseSearch: string, q: string) => string = (baseSearch, q) => {
  const sp: URLSearchParams = new URLSearchParams(baseSearch);
  if (q) {
    sp.set("q", q);
  } else {
    sp.delete("q");
  }

  const value: string = sp.toString() ? `?${sp.toString()}` : "";

  return `/productos${value}`;
};
