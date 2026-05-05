import { keepPreviousData } from "@tanstack/react-query";
import useApi from "../../../hooks/useApi";
import { getVehicles } from "../services/vehiclesService";

export default function useVehicles(page, search) {
  return useApi({
    placeholderData: keepPreviousData,
    queryKey: ["reports", "vehicles", page, search ?? ""],
    queryFn: () => getVehicles({ page, search }),
  });
}
