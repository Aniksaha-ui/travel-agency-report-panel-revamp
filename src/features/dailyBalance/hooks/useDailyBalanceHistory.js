import useApi from "../../../hooks/useApi";
import { getDailyBalanceHistory } from "../services/dailyBalanceService";

export default function useDailyBalanceHistory(page) {
  return useApi({
    queryKey: ["reports", "daily-balance-history", page],
    queryFn: () => getDailyBalanceHistory({ page }),
  });
}
