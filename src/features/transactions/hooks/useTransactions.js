import useApi from "../../../hooks/useApi";
import { getTransactions } from "../services/transactionsService";

export default function useTransactions(page) {
  return useApi({
    queryKey: ["reports", "transactions", page],
    queryFn: () => getTransactions({ page }),
  });
}
