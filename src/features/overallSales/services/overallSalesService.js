import { API_URLS } from "../../../constants/apiUrls";
import apiClient from "../../../services/apiClient";
import {
  OVERALL_SALES_COPY,
  OVERALL_SALES_FALLBACK_RESPONSE,
  ROUTE_WISE_SALES_FALLBACK_RESPONSE,
} from "../constants/overallSales.constants";

const SOURCE_COLORS = {
  Trip: "#38bdf8",
  Package: "#22c55e",
  Hotel: "#f59e0b",
};

const toNumber = (value) => Number(value) || 0;

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(toNumber(value));

const formatCurrency = (value) => `BDT ${formatNumber(value)}`;

const shortenLabel = (value, maxLength = 22) =>
  String(value ?? "").length > maxLength ? `${String(value).slice(0, maxLength - 1)}...` : String(value ?? "");

const normalizeOverallSalesSummary = (payload) => {
  const rows = payload?.data ?? [];
  const totalSales = rows.reduce((sum, item) => sum + toNumber(item.total_amount), 0);
  const sources = rows
    .map((item, index) => {
      const amount = toNumber(item.total_amount);
      const source = item.source ?? "Unknown";
      const share = totalSales ? Math.round((amount / totalSales) * 100) : 0;

      return {
        id: source,
        source,
        amount,
        amountLabel: formatCurrency(amount),
        share,
        shareLabel: `${share}% of sales`,
        color: SOURCE_COLORS[source] ?? ["#38bdf8", "#22c55e", "#f59e0b", "#8b5cf6"][index % 4],
      };
    })
    .sort((first, second) => second.amount - first.amount);

  return {
    sources,
    totalSales,
    totalSalesLabel: formatCurrency(totalSales),
    topSource: sources[0] ?? null,
    charts: {
      salesMix: sources.map((source) => ({
        id: source.id,
        label: source.source,
        value: source.amount,
        color: source.color,
      })),
      sourceRanking: sources.map((source) => ({
        id: source.id,
        label: source.source,
        value: source.amount,
      })),
    },
  };
};

const normalizeRouteWiseSalesSummary = (payload) => {
  const rows = payload?.data ?? [];
  const routes = rows
    .map((item) => {
      const totalBookings = toNumber(item.total_bookings);
      const totalRevenue = toNumber(item.total_revenue);
      const averageRevenue = totalBookings ? totalRevenue / totalBookings : 0;

      return {
        id: item.route_name ?? "Unknown",
        routeName: item.route_name ?? "Unknown route",
        routeLabel: shortenLabel(item.route_name, 24),
        totalBookings,
        totalBookingsLabel: formatNumber(totalBookings),
        totalRevenue,
        totalRevenueLabel: formatCurrency(totalRevenue),
        averageRevenue,
        averageRevenueLabel: formatCurrency(averageRevenue),
      };
    })
    .sort((first, second) => second.totalRevenue - first.totalRevenue);

  const totalRouteRevenue = routes.reduce((sum, route) => sum + route.totalRevenue, 0);
  const totalRouteBookings = routes.reduce((sum, route) => sum + route.totalBookings, 0);

  return {
    routes,
    totalRouteRevenue,
    totalRouteRevenueLabel: formatCurrency(totalRouteRevenue),
    totalRouteBookings,
    totalRouteBookingsLabel: formatNumber(totalRouteBookings),
    topRoute: routes[0] ?? null,
    charts: {
      routeRevenueRanking: routes.map((route) => ({
        id: route.id,
        label: route.routeLabel,
        value: route.totalRevenue,
      })),
      routeBookingRanking: routes.map((route) => ({
        id: route.id,
        label: route.routeLabel,
        value: route.totalBookings,
      })),
    },
  };
};

export const normalizeOverallSales = ({ overallSalesPayload, routeWisePayload }) => {
  const overall = normalizeOverallSalesSummary(overallSalesPayload);
  const routeWise = normalizeRouteWiseSalesSummary(routeWisePayload);

  return {
    copy: OVERALL_SALES_COPY,
    metrics: [
      {
        id: "total-sales",
        label: "Total sales",
        value: overall.totalSalesLabel,
        change: `${formatNumber(overall.sources.length)} sales sources`,
        changeTone: "success",
      },
      {
        id: "top-source",
        label: "Top source",
        value: overall.topSource?.source ?? "N/A",
        change: overall.topSource?.amountLabel ?? "BDT 0",
        changeTone: "info",
      },
      {
        id: "route-revenue",
        label: "Route revenue",
        value: routeWise.totalRouteRevenueLabel,
        change: `${formatNumber(routeWise.routes.length)} routes`,
        changeTone: "warning",
      },
      {
        id: "route-bookings",
        label: "Route bookings",
        value: routeWise.totalRouteBookingsLabel,
        change: routeWise.topRoute
          ? `${routeWise.topRoute.routeName} leads route sales`
          : "No route sales yet",
        changeTone: "danger",
      },
    ],
    overall,
    routeWise,
  };
};

export const getOverallSales = async () => {
  try {
    const [overallResponse, routeWiseResponse] = await Promise.all([
      apiClient.post(API_URLS.reports.overallSalesSummary, ""),
      apiClient.post(API_URLS.reports.routeWiseSalesSummary, ""),
    ]);

    return normalizeOverallSales({
      overallSalesPayload: overallResponse.data,
      routeWisePayload: routeWiseResponse.data,
    });
  } catch {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 300);
    });
  }

  return normalizeOverallSales({
    overallSalesPayload: OVERALL_SALES_FALLBACK_RESPONSE,
    routeWisePayload: ROUTE_WISE_SALES_FALLBACK_RESPONSE,
  });
};
