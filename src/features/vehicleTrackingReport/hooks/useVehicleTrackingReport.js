import useApi from "../../../hooks/useApi";
import { getVehicleTrackingReport } from "../services/vehicleTrackingReportService";

export default function useVehicleTrackingReport(page) {
  return useApi({
    queryKey: ["reports", "vehicle-tracking-report", page],
    queryFn: () => getVehicleTrackingReport({ page }),
  });
}
