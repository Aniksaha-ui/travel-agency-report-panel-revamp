import { API_URLS } from "../../../constants/apiUrls";
import apiClient from "../../../services/apiClient";
import {
  LOW_PERFORMING_PACKAGES_COPY,
  LOW_PERFORMING_PACKAGES_FALLBACK_RESPONSE,
} from "../constants/lowPerformingPackages.constants";

const toNumber = (value) => Number(value) || 0;

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(toNumber(value));

export const normalizeLowPerformingPackages = (payload) => {
  const rows = payload?.data ?? payload ?? [];
  const packages = rows.map((item, index) => {
    const recentBookingCount = toNumber(item.recent_booking_count);

    return {
      id: item.id ?? `${item.package_name}-${index}`,
      packageName: item.package_name || "Untitled package",
      recentBookingCount,
      recentBookingCountLabel: formatNumber(recentBookingCount),
    };
  });

  const totalBookings = packages.reduce((sum, item) => sum + item.recentBookingCount, 0);
  const lowestPackage =
    [...packages].sort((first, second) => first.recentBookingCount - second.recentBookingCount)[0] ?? null;
  const averageBookings = packages.length ? Math.round(totalBookings / packages.length) : 0;

  return {
    copy: LOW_PERFORMING_PACKAGES_COPY,
    metrics: [
      {
        id: "tracked-packages",
        label: "Tracked packages",
        value: formatNumber(packages.length),
        change: `${formatNumber(totalBookings)} recent bookings total`,
        changeTone: "info",
      },
      {
        id: "average-bookings",
        label: "Average bookings",
        value: formatNumber(averageBookings),
        change: lowestPackage ? `${lowestPackage.packageName} is lowest` : "No package data available",
        changeTone: "warning",
      },
      {
        id: "lowest-package",
        label: "Lowest package",
        value: lowestPackage?.recentBookingCountLabel ?? "0",
        change: lowestPackage?.packageName ?? "No package data available",
        changeTone: "danger",
      },
    ],
    packages,
    summary: {
      totalBookingsLabel: formatNumber(totalBookings),
      averageBookingsLabel: formatNumber(averageBookings),
      lowestPackage,
    },
    charts: {
      bookingRanking: packages
        .map((item) => ({
          id: item.id,
          label: item.packageName,
          value: item.recentBookingCount,
        }))
        .sort((first, second) => first.value - second.value),
    },
  };
};

export const getLowPerformingPackages = async () => {
  try {
    const response = await apiClient.get(API_URLS.reports.lowPerformingPackages);

    if (response.data) {
      return normalizeLowPerformingPackages(response.data);
    }
  } catch {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 300);
    });
  }

  return normalizeLowPerformingPackages(LOW_PERFORMING_PACKAGES_FALLBACK_RESPONSE);
};
