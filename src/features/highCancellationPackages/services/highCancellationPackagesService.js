import { API_URLS } from "../../../constants/apiUrls";
import apiClient from "../../../services/apiClient";
import {
  HIGH_CANCELLATION_PACKAGES_COPY,
  HIGH_CANCELLATION_PACKAGES_FALLBACK_RESPONSE,
} from "../constants/highCancellationPackages.constants";

const toNumber = (value) => Number(value) || 0;

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(toNumber(value));

const getTone = (rate) => {
  if (rate >= 20) {
    return "danger";
  }

  if (rate >= 10) {
    return "warning";
  }

  return "success";
};

export const normalizeHighCancellationPackages = (payload) => {
  const rows = payload?.data ?? payload ?? [];
  const packages = rows.map((item, index) => {
    const totalBookings = toNumber(item.total_bookings);
    const cancelledCount = toNumber(item.cancelled_count);
    const cancellationRate = toNumber(item.cancellation_rate);

    return {
      id: `${item.package_name}-${index}`,
      packageName: item.package_name || "Untitled package",
      totalBookings,
      totalBookingsLabel: formatNumber(totalBookings),
      cancelledCount,
      cancelledCountLabel: formatNumber(cancelledCount),
      cancellationRate,
      cancellationRateLabel: `${cancellationRate}%`,
      tone: getTone(cancellationRate),
    };
  });

  const totalBookings = packages.reduce((sum, item) => sum + item.totalBookings, 0);
  const totalCancelled = packages.reduce((sum, item) => sum + item.cancelledCount, 0);
  const averageRate = packages.length
    ? Math.round(packages.reduce((sum, item) => sum + item.cancellationRate, 0) / packages.length)
    : 0;
  const highestPackage =
    [...packages].sort((first, second) => second.cancellationRate - first.cancellationRate)[0] ?? null;

  return {
    copy: HIGH_CANCELLATION_PACKAGES_COPY,
    metrics: [
      {
        id: "tracked-packages",
        label: "Tracked packages",
        value: formatNumber(packages.length),
        change: `${formatNumber(totalBookings)} total bookings`,
        changeTone: "info",
      },
      {
        id: "cancelled-bookings",
        label: "Cancelled bookings",
        value: formatNumber(totalCancelled),
        change: `${averageRate}% average cancellation rate`,
        changeTone: "warning",
      },
      {
        id: "highest-cancellation",
        label: "Highest cancellation",
        value: highestPackage?.cancellationRateLabel ?? "0%",
        change: highestPackage?.packageName ?? "No package data available",
        changeTone: "danger",
      },
    ],
    packages,
    summary: {
      totalBookingsLabel: formatNumber(totalBookings),
      totalCancelledLabel: formatNumber(totalCancelled),
      averageRateLabel: `${averageRate}%`,
      highestPackage,
    },
    charts: {
      cancellationRanking: packages
        .map((item) => ({
          id: item.id,
          label: item.packageName,
          value: item.cancellationRate,
        }))
        .sort((first, second) => second.value - first.value),
    },
  };
};

export const getHighCancellationPackages = async () => {
  try {
    const response = await apiClient.get(API_URLS.reports.highCancellationPackages);

    if (response.data) {
      return normalizeHighCancellationPackages(response.data);
    }
  } catch {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 300);
    });
  }

  return normalizeHighCancellationPackages(HIGH_CANCELLATION_PACKAGES_FALLBACK_RESPONSE);
};
