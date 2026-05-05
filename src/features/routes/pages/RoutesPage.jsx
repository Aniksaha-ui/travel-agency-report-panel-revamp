import { startTransition, useState } from "react";
import useDebouncedValue from "../../../hooks/useDebouncedValue";
import useApi from "../../../hooks/useApi";
import AdminLayout from "../../../layouts/AdminLayout";
import RouteDetailsModal from "../component/RouteDetailsModal";
import RoutesDesktopView from "../component/RoutesDesktopView";
import RoutesMobileView from "../component/RoutesMobileView";
import RoutesTableFooter from "../component/RoutesTableFooter";
import { ROUTES_COPY } from "../constants/routes.constants";
import useRoutes from "../hooks/useRoutes";
import { getRouteDetails } from "../services/routesService";
import { formatBoardDate } from "../../../utils/dateUtils";

export default function RoutesPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 450);
  const { data, isFetching, isLoading } = useRoutes(page, debouncedSearchTerm);
  const {
    data: routeDetails,
    isLoading: isRouteDetailsLoading,
  } = useApi({
    queryKey: ["reports", "route-details", selectedRouteId],
    queryFn: () => getRouteDetails(selectedRouteId),
    enabled: Boolean(selectedRouteId),
  });

  const copy = data?.copy ?? ROUTES_COPY;
  const metrics = data?.metrics ?? [];
  const routes = data?.routes ?? [];
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

  const handleOpenDetails = (routeId) => {
    setSelectedRouteId(routeId);
  };

  const handleCloseDetails = () => {
    setSelectedRouteId(null);
  };

  const tableFooter = (
    <RoutesTableFooter
      changePage={changePage}
      isFetching={isFetching}
      page={page}
      pagination={pagination}
    />
  );

  return (
    <AdminLayout>
      <RoutesMobileView
        boardDate={boardDate}
        changePage={changePage}
        copy={copy}
        handleSearchChange={handleSearchChange}
        isFetching={isFetching}
        isLoading={isLoading}
        metrics={metrics}
        onViewDetails={handleOpenDetails}
        page={page}
        pagination={pagination}
        routes={routes}
        searchTerm={searchTerm}
        summary={summary}
      />
      <RoutesDesktopView
        boardDate={boardDate}
        copy={copy}
        handleSearchChange={handleSearchChange}
        isLoading={isLoading}
        metrics={metrics}
        onViewDetails={handleOpenDetails}
        pagination={pagination}
        routes={routes}
        searchTerm={searchTerm}
        summary={summary}
        tableFooter={tableFooter}
      />
      <RouteDetailsModal
        isLoading={isRouteDetailsLoading}
        isOpen={Boolean(selectedRouteId)}
        onClose={handleCloseDetails}
        route={routeDetails}
      />
    </AdminLayout>
  );
}
