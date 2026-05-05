import { startTransition, useState } from "react";
import useDebouncedValue from "../../../hooks/useDebouncedValue";
import AdminLayout from "../../../layouts/AdminLayout";
import VehiclesDesktopView from "../component/VehiclesDesktopView";
import VehiclesMobileView from "../component/VehiclesMobileView";
import VehiclesTableFooter from "../component/VehiclesTableFooter";
import { VEHICLES_COPY } from "../constants/vehicles.constants";
import useVehicles from "../hooks/useVehicles";
import { formatBoardDate } from "../../../utils/dateUtils";

export default function VehiclesPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 450);
  const { data, isFetching, isLoading } = useVehicles(page, debouncedSearchTerm);
  const copy = data?.copy ?? VEHICLES_COPY;
  const metrics = data?.metrics ?? [];
  const vehicles = data?.vehicles ?? [];
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
    <VehiclesTableFooter
      changePage={changePage}
      isFetching={isFetching}
      page={page}
      pagination={pagination}
    />
  );

  return (
    <AdminLayout>
      <VehiclesMobileView
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
        vehicles={vehicles}
      />
      <VehiclesDesktopView
        boardDate={boardDate}
        copy={copy}
        handleSearchChange={handleSearchChange}
        isLoading={isLoading}
        metrics={metrics}
        pagination={pagination}
        searchTerm={searchTerm}
        summary={summary}
        tableFooter={tableFooter}
        vehicles={vehicles}
      />
    </AdminLayout>
  );
}
