import { keepPreviousData } from "@tanstack/react-query";
import useApi from "../../../hooks/useApi";
import { getTripPerformance } from "../services/tripPerformanceService";

export default function useTripPerformance(page, search) {
  return useApi({
    placeholderData: keepPreviousData,
    queryKey: ["reports", "trip-performance", page, search],
    queryFn: () => getTripPerformance({ page, search }),
  });
}
