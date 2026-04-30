import useApi from "../../../hooks/useApi";
import { getDailyBalance } from "../services/dailyBalanceService";

export default function useDailyBalance(page) {
  return useApi({
    queryKey: ["reports", "daily-balance", page],
    queryFn: () => getDailyBalance({ page }),
  });
}
