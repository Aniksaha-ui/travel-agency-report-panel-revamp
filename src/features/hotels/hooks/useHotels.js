import { keepPreviousData } from "@tanstack/react-query";
import useApi from "../../../hooks/useApi";
import { getHotels } from "../services/hotelsService";

export default function useHotels(page, search) {
  return useApi({
    placeholderData: keepPreviousData,
    queryKey: ["reports", "hotels", page, search ?? ""],
    queryFn: () => getHotels({ page, search }),
  });
}
