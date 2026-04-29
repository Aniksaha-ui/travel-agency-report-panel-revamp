import useApi from "../../../hooks/useApi";
import { getTripPerformance } from "../services/tripPerformanceService";

export default function useTripPerformance(page, search) {
  return useApi({
    queryKey: ["reports", "trip-performance", page, search],
    queryFn: () => getTripPerformance({ page, search }),
  });
}
