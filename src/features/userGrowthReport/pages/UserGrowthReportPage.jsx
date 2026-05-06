import AdminLayout from "../../../layouts/AdminLayout";
import UserGrowthReportMobileView from "../component/UserGrowthReportMobileView";
import UserGrowthReportDesktopView from "../component/UserGrowthReportDesktopView";
import useUserGrowthReport from "../hooks/useUserGrowthReport";
import { formatBoardDate } from "../../../utils/dateUtils";

export default function UserGrowthReportPage() {
  const { data, error, isLoading } = useUserGrowthReport();
  const copy = data?.copy;
  const metrics = data?.metrics ?? [];
  const growthRows = data?.growthRows ?? [];
  const summary = data?.summary ?? {};
  const charts = data?.charts ?? {};
  const boardDate = formatBoardDate();

  return (
    <AdminLayout>
      <UserGrowthReportMobileView
        boardDate={boardDate}
        charts={charts}
        copy={copy}
        error={error}
        growthRows={growthRows}
        isLoading={isLoading}
        metrics={metrics}
        summary={summary}
      />
      <UserGrowthReportDesktopView
        boardDate={boardDate}
        charts={charts}
        copy={copy}
        error={error}
        growthRows={growthRows}
        isLoading={isLoading}
        metrics={metrics}
        summary={summary}
      />
    </AdminLayout>
  );
}
