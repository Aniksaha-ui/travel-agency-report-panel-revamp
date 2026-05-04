import useApi from "../../../hooks/useApi";
import { getUserGrowthReport } from "../services/userGrowthReportService";

export default function useUserGrowthReport(page) {
  return useApi({
    queryKey: ["reports", "user-growth", page],
    queryFn: () => getUserGrowthReport({ page }),
  });
}
