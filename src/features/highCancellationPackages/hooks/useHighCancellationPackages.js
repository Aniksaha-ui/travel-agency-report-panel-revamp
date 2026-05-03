import useApi from "../../../hooks/useApi";
import { getHighCancellationPackages } from "../services/highCancellationPackagesService";

export default function useHighCancellationPackages() {
  return useApi({
    queryKey: ["reports", "high-cancellation-packages"],
    queryFn: getHighCancellationPackages,
  });
}
