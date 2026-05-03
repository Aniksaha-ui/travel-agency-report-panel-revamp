import { API_URLS } from "../../../constants/apiUrls";
import apiClient from "../../../services/apiClient";
import { formatTravelDate } from "../../../utils/dateUtils";
import {
  LOW_OCCUPANCY_REPORT_COPY,
  LOW_OCCUPANCY_REPORT_FALLBACK_RESPONSE,
} from "../constants/lowOccupancyReport.constants";

const toNumber = (value) => Number(value) || 0;

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(toNumber(value));

const getTone = (occupancyRate) => {
  if (occupancyRate <= 10) {
    return "danger";
  }

  if (occupancyRate <= 25) {
    return "warning";
  }

  return "info";
};

export const normalizeLowOccupancyReport = (payload) => {
  const rows = payload?.data ?? payload ?? [];
  const trips = rows.map((item, index) => {
    const totalSeats = toNumber(item.total_seats);
    const bookedSeats = toNumber(item.booked_seats);
    const occupancyRate = toNumber(item.occupancy_rate);

    return {
      id: `${item.trip_name}-${index}`,
      tripName: item.trip_name || "Untitled trip",
      departureTime: item.departure_time,
      departureLabel: item.departure_time ? formatTravelDate(item.departure_time) : "Not scheduled",
      totalSeats,
      totalSeatsLabel: formatNumber(totalSeats),
      bookedSeats,
      bookedSeatsLabel: formatNumber(bookedSeats),
      occupancyRate,
      occupancyRateLabel: `${occupancyRate}%`,
      availableSeatsLabel: formatNumber(Math.max(totalSeats - bookedSeats, 0)),
      tone: getTone(occupancyRate),
    };
  });

  const totalSeats = trips.reduce((sum, trip) => sum + trip.totalSeats, 0);
  const totalBookedSeats = trips.reduce((sum, trip) => sum + trip.bookedSeats, 0);
  const averageOccupancy = trips.length
    ? Math.round(trips.reduce((sum, trip) => sum + trip.occupancyRate, 0) / trips.length)
    : 0;
  const lowestTrip = [...trips].sort((first, second) => first.occupancyRate - second.occupancyRate)[0] ?? null;

  return {
    copy: LOW_OCCUPANCY_REPORT_COPY,
    metrics: [
      {
        id: "low-occupancy-trips",
        label: "Trips",
        value: formatNumber(trips.length),
        change: `${formatNumber(totalSeats)} total seats`,
        changeTone: "info",
      },
      {
        id: "booked-seats",
        label: "Booked seats",
        value: formatNumber(totalBookedSeats),
        change: `${formatNumber(Math.max(totalSeats - totalBookedSeats, 0))} still available`,
        changeTone: "warning",
      },
      {
        id: "average-occupancy",
        label: "Average occupancy",
        value: `${averageOccupancy}%`,
        change: lowestTrip ? `${lowestTrip.tripName} is lowest` : "No trips available",
        changeTone: "danger",
      },
    ],
    trips,
    summary: {
      totalSeatsLabel: formatNumber(totalSeats),
      totalBookedSeatsLabel: formatNumber(totalBookedSeats),
      averageOccupancyLabel: `${averageOccupancy}%`,
      lowestTrip,
    },
    charts: {
      occupancyMix: trips.map((trip) => ({
        id: trip.id,
        label: trip.tripName,
        value: trip.occupancyRate,
      })),
    },
  };
};

export const getLowOccupancyReport = async () => {
  try {
    const response = await apiClient.get(API_URLS.reports.lowOccupancyReport);

    if (response.data) {
      return normalizeLowOccupancyReport(response.data);
    }
  } catch {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 300);
    });
  }

  return normalizeLowOccupancyReport(LOW_OCCUPANCY_REPORT_FALLBACK_RESPONSE);
};
