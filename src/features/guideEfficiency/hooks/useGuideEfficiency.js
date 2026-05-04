import { keepPreviousData } from "@tanstack/react-query";
import useApi from "../../../hooks/useApi";
import { getGuideEfficiency } from "../services/guideEfficiencyService";

export default function useGuideEfficiency(search) {
  return useApi({
    placeholderData: keepPreviousData,
    queryKey: ["reports", "guide-efficiency", search],
    queryFn: () => getGuideEfficiency({ search }),
  });
}
