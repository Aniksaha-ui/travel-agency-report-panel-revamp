import useApi from "../../../hooks/useApi";
import { getRefundStatusReport } from "../services/refundStatusReportService";

export default function useRefundStatusReport() {
  return useApi({
    queryKey: ["reports", "refund-status"],
    queryFn: getRefundStatusReport,
  });
}
