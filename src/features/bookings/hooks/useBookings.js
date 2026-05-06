import { useEffect, useState } from "react";
import { getBookingInvoice, getBookings } from "../services/bookingsService";

const EMPTY_BOOKINGS_STATE = {
  data: null,
  error: null,
  isFetching: false,
  isLoading: true,
};

export default function useBookings(page, search) {
  const [state, setState] = useState(EMPTY_BOOKINGS_STATE);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isCancelled = false;

    const loadBookings = async () => {
      setState((currentState) => ({
        ...currentState,
        error: null,
        isFetching: true,
        isLoading: currentState.data ? currentState.isLoading : true,
      }));

      try {
        const response = await getBookings({ page, search });

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

    loadBookings();

    return () => {
      isCancelled = true;
    };
  }, [page, reloadKey, search]);

  return {
    ...state,
    refetch: () => setReloadKey((currentValue) => currentValue + 1),
  };
}

const EMPTY_INVOICE_STATE = {
  data: null,
  error: null,
  isLoading: false,
};

export function useBookingInvoice(bookingId) {
  const [state, setState] = useState(EMPTY_INVOICE_STATE);

  useEffect(() => {
    let isCancelled = false;

    if (!bookingId) {
      setState(EMPTY_INVOICE_STATE);
      return undefined;
    }

    const loadInvoice = async () => {
      setState({
        data: null,
        error: null,
        isLoading: true,
      });

      try {
        const response = await getBookingInvoice(bookingId);

        if (isCancelled) {
          return;
        }

        setState({
          data: response,
          error: null,
          isLoading: false,
        });
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setState({
          data: null,
          error,
          isLoading: false,
        });
      }
    };

    loadInvoice();

    return () => {
      isCancelled = true;
    };
  }, [bookingId]);

  return state;
}

