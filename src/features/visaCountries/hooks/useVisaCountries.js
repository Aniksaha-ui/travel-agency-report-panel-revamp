import { useEffect, useState } from "react";
import { getVisaCountries } from "../services/visaCountriesService";

const EMPTY_VISA_COUNTRIES_STATE = {
  data: null,
  error: null,
  isFetching: false,
  isLoading: true,
};

export default function useVisaCountries(page, search) {
  const [state, setState] = useState(EMPTY_VISA_COUNTRIES_STATE);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isCancelled = false;

    const loadVisaCountries = async () => {
      setState((currentState) => ({
        ...currentState,
        error: null,
        isFetching: true,
        isLoading: currentState.data ? currentState.isLoading : true,
      }));

      try {
        const response = await getVisaCountries({ page, search });

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

    loadVisaCountries();

    return () => {
      isCancelled = true;
    };
  }, [page, reloadKey, search]);

  return {
    ...state,
    refetch: () => setReloadKey((currentValue) => currentValue + 1),
  };
}
