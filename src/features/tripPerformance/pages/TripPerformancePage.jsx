import { startTransition, useState } from "react";
import useDebouncedValue from "../../../hooks/useDebouncedValue";
import AdminLayout from "../../../layouts/AdminLayout";
import TripPerformanceDesktopView from "../component/TripPerformanceDesktopView";
import TripPerformanceMobileView from "../component/TripPerformanceMobileView";
import TripPerformanceTableFooter from "../component/TripPerformanceTableFooter";
import { TRIP_PERFORMANCE_COPY } from "../constants/tripPerformance.constants";
import useTripPerformance from "../hooks/useTripPerformance";

export default function TripPerformancePage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 450);
  const { data, isFetching, isLoading } = useTripPerformance(page, debouncedSearchTerm);
  const copy = data?.copy ?? TRIP_PERFORMANCE_COPY;
  const metrics = data?.metrics ?? [];
  const trips = data?.trips ?? [];
  const pagination = data?.pagination ?? {};
  const summary = data?.summary ?? {};
  const charts = data?.charts ?? {};
  const topTrip = summary.topTrip;
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

  const handleSearchChange = (event) => {
    const { value } = event.target;

    startTransition(() => {
      setSearchTerm(value);
      setPage(1);
    });
  };

  const tableFooter = (
    <TripPerformanceTableFooter
      changePage={changePage}
      debouncedSearchTerm={debouncedSearchTerm}
      isFetching={isFetching}
      page={page}
      pagination={pagination}
    />
  );

  return (
    <AdminLayout>
      <TripPerformanceMobileView
        boardDate={boardDate}
        changePage={changePage}
        charts={charts}
        copy={copy}
        handleSearchChange={handleSearchChange}
        isFetching={isFetching}
        isLoading={isLoading}
        metrics={metrics}
        page={page}
        pagination={pagination}
        searchTerm={searchTerm}
        summary={summary}
        topTrip={topTrip}
        trips={trips}
      />
      <TripPerformanceDesktopView
        boardDate={boardDate}
        charts={charts}
        copy={copy}
        handleSearchChange={handleSearchChange}
        isLoading={isLoading}
        metrics={metrics}
        pagination={pagination}
        searchTerm={searchTerm}
        summary={summary}
        tableFooter={tableFooter}
        topTrip={topTrip}
        trips={trips}
      />
    </AdminLayout>
  );
}
