import { keepPreviousData } from "@tanstack/react-query";
import useApi from "../../../hooks/useApi";
import { getCustomerValue } from "../services/customerValueService";

export default function useCustomerValue(page, search) {
  return useApi({
    placeholderData: keepPreviousData,
    queryKey: ["reports", "customer-value", page, search],
    queryFn: () => getCustomerValue({ page, search }),
  });
}
