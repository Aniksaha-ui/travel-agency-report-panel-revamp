import useApi from "../../../hooks/useApi";
import { getFinancialReport } from "../services/financialReportService";

export default function useFinancialReport(page) {
  return useApi({
    queryKey: ["reports", "financial-report", page],
    queryFn: () => getFinancialReport({ page }),
  });
}
