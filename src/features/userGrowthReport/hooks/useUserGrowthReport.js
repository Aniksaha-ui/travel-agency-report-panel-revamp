import useApi from "../../../hooks/useApi";
import { getUserGrowthReport } from "../services/userGrowthReportService";

export default function useUserGrowthReport() {
  return useApi({
    queryKey: ["reports", "user-growth"],
    queryFn: getUserGrowthReport,
  });
}
