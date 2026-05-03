import useApi from "../../../hooks/useApi";
import { getLowOccupancyReport } from "../services/lowOccupancyReportService";

export default function useLowOccupancyReport() {
  return useApi({
    queryKey: ["reports", "low-occupancy"],
    queryFn: getLowOccupancyReport,
  });
}
