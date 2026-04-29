import { API_URLS } from "../../../constants/apiUrls";
import apiClient from "../../../services/apiClient";
import { formatTravelDate } from "../../../utils/dateUtils";
import {
  TRIP_PERFORMANCE_COPY,
  TRIP_PERFORMANCE_FALLBACK_RESPONSE,
} from "../constants/tripPerformance.constants";

const toNumber = (value) => Number(value) || 0;

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(toNumber(value));

const formatCurrency = (value) => `BDT ${formatNumber(value)}`;
const normalizeSearch = (value) => String(value ?? "").trim().toLowerCase();
const shortenLabel = (value, maxLength = 14) =>
  String(value ?? "").length > maxLength ? `${String(value).slice(0, maxLength - 1)}…` : String(value ?? "");

const formatDateRange = (departureTime, arrivalTime) => {
  const departureLabel = formatTravelDate(departureTime);
  const arrivalLabel = formatTravelDate(arrivalTime);

  return departureLabel === arrivalLabel ? departureLabel : `${departureLabel} - ${arrivalLabel}`;
};

export const normalizeTripPerformance = (payload) => {
  const source = payload?.data ?? {};
  const trips = (source.data ?? []).map((item) => {
    const tripBookedSeats = toNumber(item.total_seats_booked_trip);
    const packageBookedSeats = toNumber(item.total_seats_booked_package);
    const availableSeats = toNumber(item.total_seats_available);
    const totalSeatsBooked = tripBookedSeats + packageBookedSeats;
    const totalCapacity = totalSeatsBooked + availableSeats;
    const occupancyRate = totalCapacity ? Math.round((totalSeatsBooked / totalCapacity) * 100) : 0;
    const totalRevenue = toNumber(item.total_income_trip) + toNumber(item.total_income_package);
    const totalProfit = toNumber(item.profit_trip) + toNumber(item.profit_package);

    return {
      id: item.trip_id,
      tripId: item.trip_id,
      tripName: item.trip_name || "Untitled trip",
      departureDate: item.departure_time,
      arrivalDate: item.arrival_time,
      departureDateLabel: formatTravelDate(item.departure_time),
      arrivalDateLabel: formatTravelDate(item.arrival_time),
      scheduleLabel: formatDateRange(item.departure_time, item.arrival_time),
      tripBookedSeats,
      packageBookedSeats,
      availableSeats,
      totalSeatsBooked,
      totalCapacity,
      occupancyRate,
      occupancyRateLabel: `${occupancyRate}% occupied`,
      totalRevenue,
      totalProfit,
      totalCost: toNumber(item.total_cost),
      tripRevenue: toNumber(item.total_income_trip),
      packageRevenue: toNumber(item.total_income_package),
      totalRevenueLabel: formatCurrency(totalRevenue),
      totalProfitLabel: formatCurrency(totalProfit),
      totalCostLabel: formatCurrency(item.total_cost),
      bookedSeatsLabel: formatNumber(totalSeatsBooked),
      availableSeatsLabel: formatNumber(availableSeats),
      capacityLabel: formatNumber(totalCapacity),
      tripBookedSeatsLabel: formatNumber(tripBookedSeats),
      packageBookedSeatsLabel: formatNumber(packageBookedSeats),
    };
  });

  const visibleRevenue = trips.reduce((sum, trip) => sum + trip.totalRevenue, 0);
  const visibleProfit = trips.reduce((sum, trip) => sum + trip.totalProfit, 0);
  const visibleBookedSeats = trips.reduce((sum, trip) => sum + trip.totalSeatsBooked, 0);
  const visibleCapacity = trips.reduce((sum, trip) => sum + trip.totalCapacity, 0);
  const visibleUtilization = visibleCapacity ? Math.round((visibleBookedSeats / visibleCapacity) * 100) : 0;
  const topTrip = [...trips].sort((first, second) => second.totalProfit - first.totalProfit)[0] ?? null;
  const trendTrips = [...trips].slice(0, 6).reverse();
  const occupancyLeaders = [...trips].sort((first, second) => second.occupancyRate - first.occupancyRate).slice(0, 5);
  const revenueLeaders = [...trips].sort((first, second) => second.totalRevenue - first.totalRevenue).slice(0, 5);

  return {
    copy: TRIP_PERFORMANCE_COPY,
    metrics: [
      {
        id: "total-trips",
        label: "Total trips",
        value: formatNumber(source.total),
        change: `Page ${formatNumber(source.current_page)} of ${formatNumber(source.last_page)}`,
        changeTone: "info",
      },
      {
        id: "visible-revenue",
        label: "Visible revenue",
        value: formatCurrency(visibleRevenue),
        change: `${formatNumber(source.from)}-${formatNumber(source.to)} trips loaded`,
        changeTone: "success",
      },
      {
        id: "visible-profit",
        label: "Visible profit",
        value: formatCurrency(visibleProfit),
        change: `${formatNumber(visibleBookedSeats)} seats booked`,
        changeTone: "warning",
      },
      {
        id: "seat-utilization",
        label: "Seat utilization",
        value: `${visibleUtilization}%`,
        change: `${formatNumber(visibleCapacity)} seat capacity`,
        changeTone: "danger",
      },
    ],
    trips,
    pagination: {
      currentPage: toNumber(source.current_page) || 1,
      lastPage: toNumber(source.last_page) || 1,
      total: toNumber(source.total),
      from: toNumber(source.from),
      to: toNumber(source.to),
      perPage: toNumber(source.per_page),
      hasPrev: Boolean(source.prev_page_url),
      hasNext: Boolean(source.next_page_url),
    },
    summary: {
      visibleRevenue,
      visibleProfit,
      visibleBookedSeats,
      visibleCapacity,
      visibleUtilization,
      visibleRevenueLabel: formatCurrency(visibleRevenue),
      visibleProfitLabel: formatCurrency(visibleProfit),
      visibleBookedSeatsLabel: formatNumber(visibleBookedSeats),
      visibleCapacityLabel: formatNumber(visibleCapacity),
      visibleUtilizationLabel: `${visibleUtilization}%`,
      totalTripsLabel: formatNumber(source.total),
      topTrip,
    },
    charts: {
      revenueTrend: trendTrips.map((trip) => ({
        id: trip.id,
        label: shortenLabel(trip.tripName, 12),
        revenue: trip.totalRevenue,
        profit: trip.totalProfit,
      })),
      occupancyRanking: occupancyLeaders.map((trip) => ({
        id: trip.id,
        label: shortenLabel(trip.tripName, 20),
        value: trip.occupancyRate,
        meta: `${trip.bookedSeatsLabel}/${trip.capacityLabel} seats`,
      })),
      seatComposition: revenueLeaders.map((trip) => ({
        id: trip.id,
        label: shortenLabel(trip.tripName, 18),
        total: trip.totalCapacity,
        bookedTrip: trip.tripBookedSeats,
        bookedPackage: trip.packageBookedSeats,
        available: trip.availableSeats,
        meta: `${trip.occupancyRateLabel} • ${trip.totalRevenueLabel}`,
      })),
    },
  };
};

const filterFallbackTrips = (payload, search) => {
  const normalizedSearch = normalizeSearch(search);

  if (!normalizedSearch) {
    return payload;
  }

  const filteredTrips = (payload?.data?.data ?? []).filter((item) =>
    String(item.trip_name ?? "").toLowerCase().includes(normalizedSearch)
  );

  return {
    ...payload,
    data: {
      ...payload.data,
      data: filteredTrips,
      total: filteredTrips.length,
      from: filteredTrips.length ? 1 : 0,
      to: filteredTrips.length,
      current_page: 1,
      last_page: 1,
      next_page_url: null,
      prev_page_url: null,
    },
  };
};

export const getTripPerformance = async ({ page = 1, search = "" } = {}) => {
  try {
    const response = await apiClient.get(API_URLS.reports.tripPerformance, {
      params: {
        page,
        ...(search ? { search } : {}),
      },
    });

    if (response.data) {
      return normalizeTripPerformance(response.data);
    }
  } catch {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 300);
    });
  }

  return normalizeTripPerformance(filterFallbackTrips(TRIP_PERFORMANCE_FALLBACK_RESPONSE, search));
};
