import { useEffect, useState } from "react";
import { getUserGrowthReport } from "../services/userGrowthReportService";

const EMPTY_USER_GROWTH_STATE = {
  data: null,
  error: null,
  isFetching: false,
  isLoading: true,
};

export default function useUserGrowthReport() {
  const [state, setState] = useState(EMPTY_USER_GROWTH_STATE);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isCancelled = false;

    const loadUserGrowthReport = async () => {
      setState((currentState) => ({
        ...currentState,
        error: null,
        isFetching: true,
        isLoading: currentState.data ? currentState.isLoading : true,
      }));

      try {
        const response = await getUserGrowthReport();

        if (isCancelled) {
          return;
        }

        setState({
          data: response,
          error: null,
          isFetching: false,
          isLoading: false,
        });
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setState((currentState) => ({
          ...currentState,
          error,
          isFetching: false,
          isLoading: false,
        }));
      }
    };

    loadUserGrowthReport();

    return () => {
      isCancelled = true;
    };
  }, [reloadKey]);

  return {
    ...state,
    refetch: () => setReloadKey((currentValue) => currentValue + 1),
  };
}
