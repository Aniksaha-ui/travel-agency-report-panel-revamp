import { keepPreviousData } from "@tanstack/react-query";
import useApi from "../../../hooks/useApi";
import { getTrips } from "../services/tripsService";

export default function useTrips(page, search) {
  return useApi({
    placeholderData: keepPreviousData,
    queryKey: ["reports", "trips", page, search ?? ""],
    queryFn: () => getTrips({ page, search }),
  });
}
