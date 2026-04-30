import { startTransition, useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import VehicleTrackingDesktopView from "../component/VehicleTrackingDesktopView";
import VehicleTrackingMobileView from "../component/VehicleTrackingMobileView";
import VehicleTrackingTableFooter from "../component/VehicleTrackingTableFooter";
import { VEHICLE_TRACKING_REPORT_COPY } from "../constants/vehicleTrackingReport.constants";
import useVehicleTrackingReport from "../hooks/useVehicleTrackingReport";

export default function VehicleTrackingReportPage() {
  const [page, setPage] = useState(1);
  const { data, isFetching, isLoading } = useVehicleTrackingReport(page);
  const copy = data?.copy ?? VEHICLE_TRACKING_REPORT_COPY;
  const metrics = data?.metrics ?? [];
  const assignments = data?.assignments ?? [];
  const pagination = data?.pagination ?? {};
  const summary = data?.summary ?? {};
  const charts = data?.charts ?? {};
  const boardDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date());

  const changePage = (nextPage) => {
    startTransition(() => {
      setPage(nextPage);
    });
  };

  const tableFooter = (
    <VehicleTrackingTableFooter
      changePage={changePage}
      isFetching={isFetching}
      page={page}
      pagination={pagination}
    />
  );

  return (
    <AdminLayout>
      <VehicleTrackingMobileView
        assignments={assignments}
        boardDate={boardDate}
        changePage={changePage}
        charts={charts}
        copy={copy}
        isFetching={isFetching}
        isLoading={isLoading}
        metrics={metrics}
        page={page}
        pagination={pagination}
        summary={summary}
      />
      <VehicleTrackingDesktopView
        assignments={assignments}
        boardDate={boardDate}
        charts={charts}
        copy={copy}
        isLoading={isLoading}
        metrics={metrics}
        pagination={pagination}
        summary={summary}
        tableFooter={tableFooter}
      />
    </AdminLayout>
  );
}
