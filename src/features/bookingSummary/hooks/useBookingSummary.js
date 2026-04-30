import useApi from "../../../hooks/useApi";
import { getBookingSummary } from "../services/bookingSummaryService";

export default function useBookingSummary() {
  return useApi({
    queryKey: ["reports", "booking-summary"],
    queryFn: getBookingSummary,
  });
}
