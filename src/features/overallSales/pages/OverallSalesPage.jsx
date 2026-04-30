import AdminLayout from "../../../layouts/AdminLayout";
import OverallSalesDesktopView from "../component/OverallSalesDesktopView";
import OverallSalesMobileView from "../component/OverallSalesMobileView";
import { OVERALL_SALES_COPY } from "../constants/overallSales.constants";
import useOverallSales from "../hooks/useOverallSales";

const EMPTY_OVERALL = {
  sources: [],
  charts: {},
};

const EMPTY_ROUTE_WISE = {
  routes: [],
  charts: {},
};

export default function OverallSalesPage() {
  const { data, isLoading } = useOverallSales();
  const copy = data?.copy ?? OVERALL_SALES_COPY;
  const metrics = data?.metrics ?? [];
  const overall = data?.overall ?? EMPTY_OVERALL;
  const routeWise = data?.routeWise ?? EMPTY_ROUTE_WISE;
  const boardDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date());

  return (
    <AdminLayout>
      <OverallSalesMobileView
        boardDate={boardDate}
        copy={copy}
        isLoading={isLoading}
        metrics={metrics}
        overall={overall}
        routeWise={routeWise}
      />
      <OverallSalesDesktopView
        boardDate={boardDate}
        copy={copy}
        isLoading={isLoading}
        metrics={metrics}
        overall={overall}
        routeWise={routeWise}
      />
    </AdminLayout>
  );
}
