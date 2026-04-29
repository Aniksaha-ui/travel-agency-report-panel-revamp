import useApi from "../../../hooks/useApi";
import { getTripPerformance } from "../services/tripPerformanceService";

export default function useTripPerformance(page) {
  return useApi({
    queryKey: ["reports", "trip-performance", page],
    queryFn: () => getTripPerformance({ page }),
  });
}
