import useApi from "../../../hooks/useApi";
import { getDashboardOverview } from "../services/dashboardService";

export default function useDashboard() {
  return useApi({
    queryKey: ["dashboard", "overview"],
    queryFn: getDashboardOverview,
  });
}
