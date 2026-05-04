import { keepPreviousData } from "@tanstack/react-query";
import useApi from "../../../hooks/useApi";
import { getTransactions } from "../services/transactionsService";

export default function useTransactions(page, search) {
  return useApi({
    placeholderData: keepPreviousData,
    queryKey: ["reports", "transactions", page, search ?? ""],
    queryFn: () => getTransactions({ page, search }),
  });
}
