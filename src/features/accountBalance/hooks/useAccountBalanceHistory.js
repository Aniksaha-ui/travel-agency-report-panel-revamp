import { useCallback, useEffect, useState } from "react";
import { getAccountBalanceHistory } from "../services/accountBalanceService";

export default function useAccountBalanceHistory(type, isEnabled) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadHistory = useCallback(async () => {
    if (!isEnabled || !type) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await getAccountBalanceHistory(type);
      setData(response);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError : new Error("Unable to load account history."));
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [isEnabled, type]);

  useEffect(() => {
    if (!isEnabled || !type) {
      return;
    }

    loadHistory();
  }, [isEnabled, loadHistory, type]);

  return {
    data,
    error,
    isLoading,
    reload: loadHistory,
  };
}
