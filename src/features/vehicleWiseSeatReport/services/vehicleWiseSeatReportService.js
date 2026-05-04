import { API_URLS } from "../../../constants/apiUrls";
import apiClient from "../../../services/apiClient";
import { buildUrlWithQuery } from "../../../utils/urlUtils";
import {
  VEHICLE_WISE_SEAT_REPORT_COPY,
  VEHICLE_WISE_SEAT_REPORT_FALLBACK_RESPONSE,
} from "../constants/vehicleWiseSeatReport.constants";

const toNumber = (value) => Number(value) || 0;

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(toNumber(value));

const formatVehicleType = (value) =>
  String(value ?? "unknown")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

const shortenLabel = (value, maxLength = 20) =>
  String(value ?? "").length > maxLength ? `${String(value).slice(0, maxLength - 1)}...` : String(value ?? "");

const countByKey = (items, key) =>
  items.reduce((accumulator, item) => {
    const value = item[key] ?? "Unknown";
    accumulator[value] = (accumulator[value] ?? 0) + item.availableSeats;
    return accumulator;
  }, {});

export const normalizeVehicleWiseSeatReport = (payload) => {
  const source = payload?.data ?? {};
  const rows = source.data ?? [];
  const vehicles = rows.map((item, index) => {
    const availableSeats = toNumber(item.available_seats);

    return {
      id: `${item.vehicle_id}-${index}`,
      vehicleId: item.vehicle_id,
      vehicleName: item.vehicle_name ?? "Unnamed vehicle",
      vehicleType: formatVehicleType(item.vehicle_type),
      vehicleTypeKey: String(item.vehicle_type ?? "unknown").toLowerCase(),
      availableSeats,
      availableSeatsLabel: formatNumber(availableSeats),
    };
  });

  const totalSeats = vehicles.reduce((sum, vehicle) => sum + vehicle.availableSeats, 0);
  const typeSeatCounts = countByKey(vehicles, "vehicleType");
  const uniqueTypes = Object.keys(typeSeatCounts).length;
  const topVehicle = [...vehicles].sort((first, second) => second.availableSeats - first.availableSeats)[0] ?? null;

  return {
    copy: VEHICLE_WISE_SEAT_REPORT_COPY,
    metrics: [
      {
        id: "visible-vehicles",
        label: "Visible vehicles",
        value: formatNumber(vehicles.length),
        change: `Showing ${formatNumber(vehicles.length)} on this page`,
        changeTone: "info",
      },
      {
        id: "available-seats",
        label: "Available seats",
        value: formatNumber(totalSeats),
        change: `${formatNumber(source.total ?? vehicles.length)} vehicles tracked`,
        changeTone: "success",
      },
      {
        id: "vehicle-types",
        label: "Vehicle types",
        value: formatNumber(uniqueTypes),
        change: Object.keys(typeSeatCounts).join(", ") || "No types reported",
        changeTone: "warning",
      },
      {
        id: "highest-capacity",
        label: "Highest capacity",
        value: topVehicle?.availableSeatsLabel ?? "0",
        change: topVehicle?.vehicleName ?? "No vehicle data available",
        changeTone: "danger",
      },
    ],
    vehicles,
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
      totalSeats,
      totalSeatsLabel: formatNumber(totalSeats),
      uniqueTypes,
      uniqueTypesLabel: formatNumber(uniqueTypes),
      topVehicle,
      topVehicleName: topVehicle?.vehicleName ?? "Not available",
      topVehicleSeatsLabel: topVehicle?.availableSeatsLabel ?? "0",
    },
    charts: {
      seatRanking: vehicles
        .map((vehicle) => ({
          id: vehicle.id,
          label: shortenLabel(vehicle.vehicleName, 22),
          value: vehicle.availableSeats,
        }))
        .sort((first, second) => second.value - first.value),
      typeMix: Object.entries(typeSeatCounts).map(([label, value]) => ({
        id: label,
        label,
        value,
      })),
    },
  };
};

export const getVehicleWiseSeatReport = async ({ page = 1, perPage = 20 } = {}) => {
  try {
    const response = await apiClient.get(
      buildUrlWithQuery(API_URLS.reports.vehicleWiseSeatReport, { page, perPage }),
      "",
    );

    if (response.data) {
      return normalizeVehicleWiseSeatReport(response.data);
    }
  } catch {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 300);
    });
  }

  return normalizeVehicleWiseSeatReport(VEHICLE_WISE_SEAT_REPORT_FALLBACK_RESPONSE);
};
