import { API_URLS } from "../../../constants/apiUrls";
import apiClient from "../../../services/apiClient";
import {
  BOOKING_SUMMARY_COPY,
  BOOKING_SUMMARY_FALLBACK_RESPONSE,
} from "../constants/bookingSummary.constants";

const TYPE_COLORS = {
  "hotel booking": "#38bdf8",
  package: "#22c55e",
  trip: "#f59e0b",
  visa: "#8b5cf6",
};

const toNumber = (value) => Number(value) || 0;

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(toNumber(value));

const formatLabel = (value) =>
  String(value ?? "Unknown")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

export const normalizeBookingSummary = (payload) => {
  const rows = payload?.data ?? [];
  const totalBookings = rows.reduce((sum, item) => sum + toNumber(item.total_booking), 0);
  const categories = rows
    .map((item, index) => {
      const bookingType = String(item.booking_type ?? "unknown").toLowerCase();
      const totalBooking = toNumber(item.total_booking);
      const share = totalBookings ? Math.round((totalBooking / totalBookings) * 100) : 0;

      return {
        id: bookingType,
        bookingType,
        bookingTypeLabel: formatLabel(bookingType),
        totalBooking,
        totalBookingLabel: formatNumber(totalBooking),
        share,
        shareLabel: `${share}% of bookings`,
        color: TYPE_COLORS[bookingType] ?? ["#38bdf8", "#22c55e", "#f59e0b", "#8b5cf6"][index % 4],
      };
    })
    .sort((first, second) => second.totalBooking - first.totalBooking);

  const topCategory = categories[0] ?? null;
  const smallestCategory = categories[categories.length - 1] ?? null;

  return {
    copy: BOOKING_SUMMARY_COPY,
    metrics: [
      {
        id: "total-bookings",
        label: "Total bookings",
        value: formatNumber(totalBookings),
        change: `${formatNumber(categories.length)} booking categories`,
        changeTone: "info",
      },
      {
        id: "top-category",
        label: "Top category",
        value: topCategory?.bookingTypeLabel ?? "N/A",
        change: `${topCategory?.totalBookingLabel ?? "0"} bookings`,
        changeTone: "success",
      },
      {
        id: "average-bookings",
        label: "Average/category",
        value: formatNumber(categories.length ? totalBookings / categories.length : 0),
        change: "Visible category average",
        changeTone: "warning",
      },
      {
        id: "smallest-category",
        label: "Lowest category",
        value: smallestCategory?.bookingTypeLabel ?? "N/A",
        change: `${smallestCategory?.totalBookingLabel ?? "0"} bookings`,
        changeTone: "danger",
      },
    ],
    categories,
    summary: {
      totalBookings,
      totalBookingsLabel: formatNumber(totalBookings),
      categoryCount: categories.length,
      categoryCountLabel: formatNumber(categories.length),
      topCategory,
      smallestCategory,
    },
    charts: {
      bookingMix: categories.map((category) => ({
        id: category.id,
        label: category.bookingTypeLabel,
        value: category.totalBooking,
        color: category.color,
      })),
      bookingRanking: categories.map((category) => ({
        id: category.id,
        label: category.bookingTypeLabel,
        value: category.totalBooking,
      })),
    },
  };
};

export const getBookingSummary = async () => {
  try {
    const response = await apiClient.post(API_URLS.reports.bookingSummary, "");

    if (response.data) {
      return normalizeBookingSummary(response.data);
    }
  } catch {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 300);
    });
  }

  return normalizeBookingSummary(BOOKING_SUMMARY_FALLBACK_RESPONSE);
};
