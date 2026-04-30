import { API_URLS } from "../../../constants/apiUrls";
import apiClient from "../../../services/apiClient";
import { formatTravelDate } from "../../../utils/dateUtils";
import {
  VEHICLE_TRACKING_REPORT_COPY,
  VEHICLE_TRACKING_REPORT_FALLBACK_RESPONSE,
} from "../constants/vehicleTrackingReport.constants";

const toNumber = (value) => Number(value) || 0;

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(toNumber(value));

const parseDateKey = (value) => {
  const [year, month, day] = String(value ?? "")
    .split("-")
    .map((part) => Number(part));

  return Number.isFinite(year) && Number.isFinite(month) && Number.isFinite(day)
    ? new Date(year, month - 1, day)
    : new Date();
};

const formatShortDate = (value) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(parseDateKey(value));

const shortenLabel = (value, maxLength = 16) =>
  String(value ?? "").length > maxLength ? `${String(value).slice(0, maxLength - 1)}...` : String(value ?? "");

const getTripDurationDays = (startDate, endDate) => {
  const start = parseDateKey(startDate);
  const end = parseDateKey(endDate);
  const diff = end.getTime() - start.getTime();

  return Math.max(1, Math.round(diff / 86400000) + 1);
};

const getScheduleLabel = (startDate, endDate) => {
  if (!startDate && !endDate) {
    return "Schedule not set";
  }

  if (startDate === endDate) {
    return formatTravelDate(startDate);
  }

  return `${formatTravelDate(startDate)} - ${formatTravelDate(endDate)}`;
};

const countByKey = (items, key) =>
  items.reduce((accumulator, item) => {
    const value = item[key] ?? "Unknown";
    accumulator[value] = (accumulator[value] ?? 0) + 1;

    return accumulator;
  }, {});

export const normalizeVehicleTrackingReport = (payload) => {
  const source = payload?.data ?? {};
  const rows = source.data ?? [];
  const assignments = rows.map((item) => {
    const durationDays = getTripDurationDays(item.travel_start_date, item.travel_end_date);

    return {
      id: item.id,
      tripId: item.trip_id,
      vehicleId: item.vehicle_id,
      tripName: item.trip_name ?? "Unnamed trip",
      vehicleName: item.vehicle_name ?? "Unassigned vehicle",
      travelStartDate: item.travel_start_date,
      travelEndDate: item.travel_end_date,
      travelStartLabel: item.travel_start_date ? formatTravelDate(item.travel_start_date) : "Not set",
      travelEndLabel: item.travel_end_date ? formatTravelDate(item.travel_end_date) : "Not set",
      shortStartLabel: item.travel_start_date ? formatShortDate(item.travel_start_date) : "N/A",
      scheduleLabel: getScheduleLabel(item.travel_start_date, item.travel_end_date),
      arrivalAt: item.arrival_at ?? "Not set",
      departureAt: item.departure_at ?? "Not set",
      durationDays,
      durationLabel: `${durationDays} day${durationDays === 1 ? "" : "s"}`,
    };
  });

  const vehicleCounts = countByKey(assignments, "vehicleName");
  const dateCounts = countByKey(assignments, "travelStartDate");
  const uniqueVehicles = Object.keys(vehicleCounts).length;
  const uniqueTrips = new Set(assignments.map((assignment) => assignment.tripId)).size;
  const activeDays = Object.keys(dateCounts).filter(Boolean).length;
  const totalTravelDays = assignments.reduce((sum, assignment) => sum + assignment.durationDays, 0);
  const busiestVehicle =
    Object.entries(vehicleCounts).sort((first, second) => second[1] - first[1])[0] ?? null;
  const longestAssignment =
    [...assignments].sort((first, second) => second.durationDays - first.durationDays)[0] ?? null;

  const vehicleRanking = Object.entries(vehicleCounts)
    .map(([label, value]) => ({
      id: label,
      label: shortenLabel(label, 20),
      value,
    }))
    .sort((first, second) => second.value - first.value);

  const startDateTrend = Object.entries(dateCounts)
    .map(([date, count]) => ({
      id: date,
      label: date ? formatShortDate(date) : "N/A",
      assignments: count,
    }))
    .sort((first, second) => parseDateKey(first.id).getTime() - parseDateKey(second.id).getTime());

  return {
    copy: VEHICLE_TRACKING_REPORT_COPY,
    metrics: [
      {
        id: "total-assignments",
        label: "Assignments",
        value: formatNumber(source.total ?? assignments.length),
        change: `Showing ${formatNumber(assignments.length)} on this page`,
        changeTone: "info",
      },
      {
        id: "active-vehicles",
        label: "Active vehicles",
        value: formatNumber(uniqueVehicles),
        change: busiestVehicle ? `${busiestVehicle[0]} leads usage` : "No vehicle usage yet",
        changeTone: "success",
      },
      {
        id: "tracked-trips",
        label: "Tracked trips",
        value: formatNumber(uniqueTrips),
        change: `${formatNumber(activeDays)} departure day${activeDays === 1 ? "" : "s"}`,
        changeTone: "warning",
      },
      {
        id: "travel-days",
        label: "Travel days",
        value: formatNumber(totalTravelDays),
        change: longestAssignment
          ? `${longestAssignment.tripName} spans ${longestAssignment.durationLabel}`
          : "No travel windows yet",
        changeTone: "danger",
      },
    ],
    assignments,
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
      uniqueVehicles,
      uniqueVehiclesLabel: formatNumber(uniqueVehicles),
      uniqueTrips,
      uniqueTripsLabel: formatNumber(uniqueTrips),
      activeDays,
      activeDaysLabel: formatNumber(activeDays),
      totalTravelDays,
      totalTravelDaysLabel: formatNumber(totalTravelDays),
      busiestVehicleName: busiestVehicle?.[0] ?? "Not available",
      busiestVehicleCountLabel: busiestVehicle ? formatNumber(busiestVehicle[1]) : "0",
      longestAssignment,
    },
    charts: {
      vehicleRanking,
      startDateTrend,
      durationRanking: assignments
        .map((assignment) => ({
          id: assignment.id,
          label: shortenLabel(assignment.tripName, 22),
          value: assignment.durationDays,
        }))
        .sort((first, second) => second.value - first.value),
    },
  };
};

export const getVehicleTrackingReport = async ({ page = 1 } = {}) => {
  try {
    const response = await apiClient.post(API_URLS.reports.vehicleTrackingReport, "", {
      params: { page },
    });

    if (response.data) {
      return normalizeVehicleTrackingReport(response.data);
    }
  } catch {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 300);
    });
  }

  return normalizeVehicleTrackingReport(VEHICLE_TRACKING_REPORT_FALLBACK_RESPONSE);
};
