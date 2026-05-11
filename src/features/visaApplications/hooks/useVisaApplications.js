import { useEffect, useState } from "react";
import { getVisaApplications } from "../services/visaApplicationsService";

const EMPTY_VISA_APPLICATIONS_STATE = {
  data: null,
  error: null,
  isFetching: false,
  isLoading: true,
};

export default function useVisaApplications(page, search) {
  const [state, setState] = useState(EMPTY_VISA_APPLICATIONS_STATE);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isCancelled = false;

    const loadVisaApplications = async () => {
      setState((currentState) => ({
        ...currentState,
        error: null,
        isFetching: true,
        isLoading: currentState.data ? currentState.isLoading : true,
      }));

      try {
        const response = await getVisaApplications({ page, search });

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

    loadVisaApplications();

    return () => {
      isCancelled = true;
    };
  }, [page, reloadKey, search]);

  return {
    ...state,
    refetch: () => setReloadKey((currentValue) => currentValue + 1),
  };
}
