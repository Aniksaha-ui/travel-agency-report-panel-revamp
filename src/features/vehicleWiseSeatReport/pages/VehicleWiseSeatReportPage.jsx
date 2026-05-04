import { startTransition, useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import VehicleWiseSeatReportDesktopView from "../component/VehicleWiseSeatReportDesktopView";
import VehicleWiseSeatReportMobileView from "../component/VehicleWiseSeatReportMobileView";
import { VEHICLE_WISE_SEAT_REPORT_COPY } from "../constants/vehicleWiseSeatReport.constants";
import useVehicleWiseSeatReport from "../hooks/useVehicleWiseSeatReport";

export default function VehicleWiseSeatReportPage() {
  const [page, setPage] = useState(1);
  const { data, isFetching, isLoading } = useVehicleWiseSeatReport(page, 20);
  const copy = data?.copy ?? VEHICLE_WISE_SEAT_REPORT_COPY;
  const metrics = data?.metrics ?? [];
  const vehicles = data?.vehicles ?? [];
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

  return (
    <AdminLayout>
      <VehicleWiseSeatReportMobileView
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
        vehicles={vehicles}
      />
      <VehicleWiseSeatReportDesktopView
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
        vehicles={vehicles}
      />
    </AdminLayout>
  );
}
