import { useCallback, useEffect, useState } from "react";
import { getAccountBalance } from "../services/accountBalanceService";

export default function useAccountBalance() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const loadAccountBalance = useCallback(async () => {
    setIsFetching(true);
    setError(null);

    try {
      const response = await getAccountBalance();
      setData(response);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError : new Error("Unable to load account balance data."));
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    loadAccountBalance();
  }, [loadAccountBalance]);

  return {
    data,
    error,
    isFetching,
    isLoading,
    reload: loadAccountBalance,
  };
}
