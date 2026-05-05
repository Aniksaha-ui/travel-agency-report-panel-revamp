import useApi from "../../../hooks/useApi";
import { getMonitoring } from "../services/monitoringService";

export default function useMonitoring() {
  return useApi({
    queryKey: ["admin", "monitoring"],
    queryFn: getMonitoring,
  });
}
