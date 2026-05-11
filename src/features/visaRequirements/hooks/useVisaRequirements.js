import { useEffect, useState } from "react";
import { getVisaRequirements } from "../services/visaRequirementsService";

const EMPTY_VISA_REQUIREMENTS_STATE = {
  data: null,
  error: null,
  isFetching: false,
  isLoading: true,
};

export default function useVisaRequirements(page, search) {
  const [state, setState] = useState(EMPTY_VISA_REQUIREMENTS_STATE);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isCancelled = false;

    const loadVisaRequirements = async () => {
      setState((currentState) => ({
        ...currentState,
        error: null,
        isFetching: true,
        isLoading: currentState.data ? currentState.isLoading : true,
      }));

      try {
        const response = await getVisaRequirements({ page, search });

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

    loadVisaRequirements();

    return () => {
      isCancelled = true;
    };
  }, [page, reloadKey, search]);

  return {
    ...state,
    refetch: () => setReloadKey((currentValue) => currentValue + 1),
  };
}
