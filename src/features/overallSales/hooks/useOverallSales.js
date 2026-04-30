import useApi from "../../../hooks/useApi";
import { getOverallSales } from "../services/overallSalesService";

export default function useOverallSales() {
  return useApi({
    queryKey: ["reports", "overall-sales"],
    queryFn: getOverallSales,
  });
}
