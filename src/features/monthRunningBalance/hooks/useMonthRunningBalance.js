import useApi from "../../../hooks/useApi";
import { getMonthRunningBalance } from "../services/monthRunningBalanceService";

export default function useMonthRunningBalance(page) {
  return useApi({
    queryKey: ["reports", "month-running-balance", page],
    queryFn: () => getMonthRunningBalance({ page }),
  });
}
