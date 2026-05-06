import { useCallback, useEffect, useState } from "react";
import { getAccountHistory } from "../services/accountHistoryService";

export default function useAccountHistory({ endDate, page, startDate }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const loadAccountHistory = useCallback(async () => {
    setIsFetching(true);
    setError(null);

    try {
      const response = await getAccountHistory({ page, startDate, endDate });
      setData(response);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError : new Error("Unable to load account history data."));
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, [endDate, page, startDate]);

  useEffect(() => {
    loadAccountHistory();
  }, [loadAccountHistory]);

  return {
    data,
    error,
    isFetching,
    isLoading,
    reload: loadAccountHistory,
  };
}
