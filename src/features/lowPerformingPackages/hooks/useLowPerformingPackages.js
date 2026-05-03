import useApi from "../../../hooks/useApi";
import { getLowPerformingPackages } from "../services/lowPerformingPackagesService";

export default function useLowPerformingPackages() {
  return useApi({
    queryKey: ["reports", "low-performing-packages"],
    queryFn: getLowPerformingPackages,
  });
}
