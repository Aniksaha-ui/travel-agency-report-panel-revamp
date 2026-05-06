import { useEffect, useState } from "react";
import { getGuides } from "../services/guidesService";

const EMPTY_GUIDES_STATE = {
  data: null,
  error: null,
  isFetching: false,
  isLoading: true,
};

export default function useGuides(page, search) {
  const [state, setState] = useState(EMPTY_GUIDES_STATE);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isCancelled = false;

    const loadGuides = async () => {
      setState((currentState) => ({
        ...currentState,
        error: null,
        isFetching: true,
        isLoading: currentState.data ? currentState.isLoading : true,
      }));

      try {
        const response = await getGuides({ page, search });

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

    loadGuides();

    return () => {
      isCancelled = true;
    };
  }, [page, reloadKey, search]);

  return {
    ...state,
    refetch: () => setReloadKey((currentValue) => currentValue + 1),
  };
}
