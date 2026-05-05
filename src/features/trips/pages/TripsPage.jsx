import { startTransition, useState } from "react";
import useDebouncedValue from "../../../hooks/useDebouncedValue";
import AdminLayout from "../../../layouts/AdminLayout";
import TripsDesktopView from "../component/TripsDesktopView";
import TripsMobileView from "../component/TripsMobileView";
import TripsTableFooter from "../component/TripsTableFooter";
import { TRIPS_COPY } from "../constants/trips.constants";
import useTrips from "../hooks/useTrips";
import { formatBoardDate } from "../../../utils/dateUtils";

export default function TripsPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 450);
  const { data, isFetching, isLoading } = useTrips(page, debouncedSearchTerm);
  const copy = data?.copy ?? TRIPS_COPY;
  const metrics = data?.metrics ?? [];
  const trips = data?.trips ?? [];
  const pagination = data?.pagination ?? {};
  const summary = data?.summary ?? {};
  const boardDate = formatBoardDate();

  const changePage = (nextPage) => {
    startTransition(() => {
      setPage(nextPage);
    });
  };

  const handleSearchChange = (event) => {
    const { value } = event.target;
    startTransition(() => {
      setPage(1);
      setSearchTerm(value);
    });
  };

  const tableFooter = (
    <TripsTableFooter
      changePage={changePage}
      isFetching={isFetching}
      page={page}
      pagination={pagination}
    />
  );

  return (
    <AdminLayout>
      <TripsMobileView
        boardDate={boardDate}
        changePage={changePage}
        copy={copy}
        handleSearchChange={handleSearchChange}
        isFetching={isFetching}
        isLoading={isLoading}
        metrics={metrics}
        page={page}
        pagination={pagination}
        searchTerm={searchTerm}
        summary={summary}
        trips={trips}
      />
      <TripsDesktopView
        boardDate={boardDate}
        copy={copy}
        handleSearchChange={handleSearchChange}
        isFetching={isFetching}
        isLoading={isLoading}
        metrics={metrics}
        pagination={pagination}
        searchTerm={searchTerm}
        summary={summary}
        tableFooter={tableFooter}
        trips={trips}
      />
    </AdminLayout>
  );
}
