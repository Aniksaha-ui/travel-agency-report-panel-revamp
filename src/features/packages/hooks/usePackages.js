import { keepPreviousData } from "@tanstack/react-query";
import useApi from "../../../hooks/useApi";
import { getPackages } from "../services/packagesService";

export default function usePackages(page, search) {
  return useApi({
    placeholderData: keepPreviousData,
    queryKey: ["reports", "packages", page, search ?? ""],
    queryFn: () => getPackages({ page, search }),
  });
}
