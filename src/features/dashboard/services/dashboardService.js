import { API_URLS } from "../../../constants/apiUrls";
import apiClient from "../../../services/apiClient";
import {
  DASHBOARD_COPY,
  DASHBOARD_FALLBACK_RESPONSE,
} from "../constants/dashboard.constants";

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Number(value) || 0);

const formatCurrency = (value) => `BDT ${formatNumber(value)}`;

const formatLabel = (value) =>
  String(value ?? "")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

const toNumber = (value) => Number(value) || 0;

const getToneByRank = (index) => {
  if (index === 0) {
    return "success";
  }

  if (index === 1) {
    return "info";
  }

  return "warning";
};

export const normalizeDashboardOverview = (payload) => {
  const source = payload?.data ?? payload ?? {};
  const totalTrips = source.tripData?.reduce((sum, item) => sum + toNumber(item.trip_exist), 0) ?? 0;
  const totalPaymentAmount =
    source.paymentData?.reduce((sum, item) => sum + toNumber(item.total_amount), 0) ?? 0;
  const paymentCaptureRate = source.totalTransaction
    ? Math.round((toNumber(source.totalPayments) / toNumber(source.totalTransaction)) * 100)
    : 0;

  const tripOrigins = (source.tripData ?? []).map((item, index) => {
    const tripCount = toNumber(item.trip_exist);
    const share = totalTrips ? Math.round((tripCount / totalTrips) * 100) : 0;

    return {
      id: `${item.origin}-${index}`,
      origin: item.origin || "Unknown region",
      tripCount,
      tripCountLabel: formatNumber(tripCount),
      share,
      shareLabel: `${share}% of trip coverage`,
      tone: getToneByRank(index),
    };
  });

  const paymentMethods = (source.paymentData ?? []).map((item, index) => {
    const amount = toNumber(item.total_amount);
    const share = totalPaymentAmount ? Math.round((amount / totalPaymentAmount) * 100) : 0;

    return {
      id: `${item.payment_method}-${index}`,
      paymentMethod: formatLabel(item.payment_method),
      totalAmount: amount,
      totalAmountLabel: formatCurrency(amount),
      paymentHeld: toNumber(item.payment_held),
      paymentHeldLabel: formatNumber(item.payment_held),
      share,
      shareLabel: `${share}% of collected value`,
      tone: getToneByRank(index),
    };
  });

  const metrics = [
    {
      id: "monthly-payments",
      label: "Monthly payments",
      value: formatCurrency(source.monthlyPayments),
      change: `${formatNumber(source.totalPayments)} payments processed`,
      changeTone: "success",
    },
    {
      id: "total-bookings",
      label: "Total bookings",
      value: formatNumber(source.totalBookings),
      change: `${formatNumber(source.thisMonthTotalBookings)} this month`,
      changeTone: "info",
    },
    {
      id: "total-transactions",
      label: "Total transactions",
      value: formatNumber(source.totalTransaction),
      change: `${paymentCaptureRate}% capture rate`,
      changeTone: "warning",
    },
    {
      id: "total-tours",
      label: "Total tours",
      value: formatNumber(source.totalTours),
      change: `${formatNumber(source.totalRoute)} routes active`,
      changeTone: "danger",
    },
  ];

  const summaryStats = [
    { id: "guides", label: "Guides", value: formatNumber(source.totalGuide) },
    { id: "packages", label: "Packages", value: formatNumber(source.totalPackage) },
    { id: "routes", label: "Routes", value: formatNumber(source.totalRoute) },
    { id: "vehicles", label: "Vehicles", value: formatNumber(source.totalVehicles) },
    { id: "tables", label: "Tables", value: formatNumber(source.totalTable) },
    { id: "hotel-bookings", label: "Hotel bookings", value: formatNumber(source.totalHotelBookings) },
    {
      id: "package-bookings",
      label: "Package bookings",
      value: formatNumber(source.totalPackageBookings),
    },
    {
      id: "month-hotel-bookings",
      label: "This month hotel",
      value: formatNumber(source.thisMonthTotalHotelBookings),
    },
  ];

  return {
    copy: DASHBOARD_COPY,
    metrics,
    summaryStats,
    tripOrigins,
    paymentMethods,
    paymentCaptureRate,
    totals: {
      monthlyPayments: formatCurrency(source.monthlyPayments),
      totalBookings: formatNumber(source.totalBookings),
      thisMonthTotalBookings: formatNumber(source.thisMonthTotalBookings),
      totalTransactions: formatNumber(source.totalTransaction),
      totalPayments: formatNumber(source.totalPayments),
      totalTours: formatNumber(source.totalTours),
      totalRoutes: formatNumber(source.totalRoute),
      totalVehicles: formatNumber(source.totalVehicles),
      totalGuides: formatNumber(source.totalGuide),
      totalPackages: formatNumber(source.totalPackage),
      totalTables: formatNumber(source.totalTable),
      totalTripRegions: formatNumber(totalTrips),
    },
  };
};

const fallbackDashboardOverview = normalizeDashboardOverview(DASHBOARD_FALLBACK_RESPONSE);

export const getDashboardOverview = async () => {
  try {
    const response = await apiClient.get(API_URLS.dashboard.overview);

    if (response.data) {
      return normalizeDashboardOverview(response.data);
    }
  } catch {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 300);
    });
  }

  return fallbackDashboardOverview;
};
