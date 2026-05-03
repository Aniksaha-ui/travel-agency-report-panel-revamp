import useApi from "../../../hooks/useApi";
import { getAverageBookingValueReport } from "../services/averageBookingValueReportService";

export default function useAverageBookingValueReport() {
  return useApi({
    queryKey: ["reports", "average-booking-value"],
    queryFn: getAverageBookingValueReport,
  });
}
