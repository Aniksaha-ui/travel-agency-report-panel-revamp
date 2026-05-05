import AdminLayout from "../../../layouts/AdminLayout";
import { formatBoardDate } from "../../../utils/dateUtils";
import MonitoringDesktopView from "../component/MonitoringDesktopView";
import MonitoringMobileView from "../component/MonitoringMobileView";
import { MONITORING_COPY } from "../constants/monitoring.constants";
import useMonitoring from "../hooks/useMonitoring";

export default function MonitoringPage() {
  const { data, error, isLoading } = useMonitoring();
  const boardDate = formatBoardDate();

  return (
    <AdminLayout>
      <MonitoringMobileView
        boardDate={boardDate}
        charts={data?.charts ?? {}}
        copy={data?.copy ?? MONITORING_COPY}
        error={error}
        latestLogs={data?.latestLogs ?? []}
        metrics={data?.metrics ?? []}
        requestReport={data?.requestReport ?? []}
        routeReport={data?.routeReport ?? []}
        summary={data?.summary ?? {}}
      />
      <MonitoringDesktopView
        boardDate={boardDate}
        charts={data?.charts ?? {}}
        copy={data?.copy ?? MONITORING_COPY}
        error={error}
        isLoading={isLoading}
        latestLogs={data?.latestLogs ?? []}
        metrics={data?.metrics ?? []}
        requestReport={data?.requestReport ?? []}
        routeReport={data?.routeReport ?? []}
        summary={data?.summary ?? {}}
      />
    </AdminLayout>
  );
}
