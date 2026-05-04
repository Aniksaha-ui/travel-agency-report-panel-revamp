import { keepPreviousData } from "@tanstack/react-query";
import useApi from "../../../hooks/useApi";
import { getRoutes } from "../services/routesService";

export default function useRoutes(page, search) {
  return useApi({
    placeholderData: keepPreviousData,
    queryKey: ["reports", "routes", page, search ?? ""],
    queryFn: () => getRoutes({ page, search }),
  });
}
