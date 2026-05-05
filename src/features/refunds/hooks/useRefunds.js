import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { disburseRefund, getRefunds } from "../services/refundsService";

const EMPTY_REFUNDS_STATE = {
  data: null,
  error: null,
  isFetching: false,
  isLoading: true,
};

export default function useRefunds(page, search) {
  const [state, setState] = useState(EMPTY_REFUNDS_STATE);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isCancelled = false;

    const loadRefunds = async () => {
      setState((currentState) => ({
        ...currentState,
        error: null,
        isFetching: true,
        isLoading: currentState.data ? currentState.isLoading : true,
      }));

      try {
        const response = await getRefunds({ page, search });

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

    loadRefunds();

    return () => {
      isCancelled = true;
    };
  }, [page, reloadKey, search]);

  return {
    ...state,
    refetch: () => setReloadKey((currentValue) => currentValue + 1),
  };
}

export function useRefundDisburseMutation() {
  return useMutation({
    mutationFn: (refundId) => disburseRefund(refundId),
    onSuccess: (response) => {
      toast.success(response.message || "Refund disbursed successfully.");
    },
    onError: (error) => {
      toast.error(error.message || "Unable to disburse the refund.");
    },
  });
}
