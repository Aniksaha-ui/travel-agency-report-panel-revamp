import useApi from "../../../hooks/useApi";
import { getVehicleWiseSeatReport } from "../services/vehicleWiseSeatReportService";

export default function useVehicleWiseSeatReport(page, perPage = 20) {
  return useApi({
    queryKey: ["reports", "vehicle-wise-seat-report", page, perPage],
    queryFn: () => getVehicleWiseSeatReport({ page, perPage }),
  });
}
