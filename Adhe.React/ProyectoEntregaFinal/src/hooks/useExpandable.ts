import { useCallback, useState } from "react";

interface UseExpandableReturn {
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  toggleExpand: (id: string) => void;
}

function useExpandable(): UseExpandableReturn {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand: (id: string) => void = useCallback((id: string): void => {
    setExpandedId((prev: string | null) => (prev === id ? null : id));
  }, []);

  return { expandedId, toggleExpand, setExpandedId };
}

export default useExpandable;
