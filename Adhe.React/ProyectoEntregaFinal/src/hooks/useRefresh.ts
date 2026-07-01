import { useCallback, useState } from "react";

interface UseRefreshReturn {
  refreshing: boolean;
  handleRefresh: () => void;
}

function useRefresh(fetcher: () => Promise<unknown>): UseRefreshReturn {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh: () => void = useCallback((): void => {
    setRefreshing(true);
    fetcher().finally((): void => {
      setRefreshing(false);
    });
  }, [fetcher]);

  return { refreshing, handleRefresh };
}

export default useRefresh;
