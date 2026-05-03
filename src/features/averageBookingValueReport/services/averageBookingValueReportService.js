import { API_URLS } from "../../../constants/apiUrls";
import apiClient from "../../../services/apiClient";
import {
  AVERAGE_BOOKING_VALUE_REPORT_COPY,
  AVERAGE_BOOKING_VALUE_REPORT_FALLBACK_RESPONSE,
} from "../constants/averageBookingValueReport.constants";

const toNumber = (value) => Number(value) || 0;

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(toNumber(value));

const formatCurrency = (value) => `BDT ${formatNumber(value)}`;

const formatLabel = (value) =>
  String(value ?? "Unknown")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

export const normalizeAverageBookingValueReport = (payload) => {
  const rows = payload?.data ?? payload ?? [];
  const bookingTypes = rows.map((item, index) => {
    const averageValue = toNumber(item.average_value);

    return {
      id: `${item.booking_type}-${index}`,
      bookingType: formatLabel(item.booking_type),
      averageValue,
      averageValueLabel: formatCurrency(averageValue),
    };
  });

  const totalAverageValue = bookingTypes.reduce((sum, item) => sum + item.averageValue, 0);
  const highestType =
    [...bookingTypes].sort((first, second) => second.averageValue - first.averageValue)[0] ?? null;
  const lowestType =
    [...bookingTypes].sort((first, second) => first.averageValue - second.averageValue)[0] ?? null;

  return {
    copy: AVERAGE_BOOKING_VALUE_REPORT_COPY,
    metrics: [
      {
        id: "booking-categories",
        label: "Booking categories",
        value: formatNumber(bookingTypes.length),
        change: highestType ? `${highestType.bookingType} leads` : "No categories available",
        changeTone: "info",
      },
      {
        id: "combined-average",
        label: "Combined average",
        value: formatCurrency(totalAverageValue),
        change: lowestType ? `${lowestType.bookingType} is lowest` : "No average values available",
        changeTone: "success",
      },
      {
        id: "top-category",
        label: "Top category",
        value: highestType?.bookingType ?? "No data",
        change: highestType ? highestType.averageValueLabel : "No average values available",
        changeTone: "warning",
      },
    ],
    bookingTypes,
    summary: {
      totalAverageValueLabel: formatCurrency(totalAverageValue),
      highestType,
      lowestType,
    },
    charts: {
      averageValueMix: bookingTypes.map((item) => ({
        id: item.id,
        label: item.bookingType,
        value: item.averageValue,
      })),
      averageValueRanking: bookingTypes
        .map((item) => ({
          id: item.id,
          label: item.bookingType,
          value: item.averageValue,
        }))
        .sort((first, second) => second.value - first.value),
    },
  };
};

export const getAverageBookingValueReport = async () => {
  try {
    const response = await apiClient.get(API_URLS.reports.averageBookingValueReport);

    if (response.data) {
      return normalizeAverageBookingValueReport(response.data);
    }
  } catch {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 300);
    });
  }

  return normalizeAverageBookingValueReport(AVERAGE_BOOKING_VALUE_REPORT_FALLBACK_RESPONSE);
};
