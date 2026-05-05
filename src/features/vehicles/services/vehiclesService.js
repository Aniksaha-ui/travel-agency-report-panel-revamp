import { API_URLS } from "../../../constants/apiUrls";
import apiClient from "../../../services/apiClient";
import { buildUrlWithQuery } from "../../../utils/urlUtils";
import { VEHICLES_COPY, VEHICLES_FALLBACK_RESPONSE } from "../constants/vehicles.constants";

const toNumber = (value) => Number(value) || 0;
const normalizeSearch = (value) => String(value ?? "").trim().toLowerCase();

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(toNumber(value));

const formatVehicleType = (value) => {
  const normalizedValue = String(value ?? "").trim();

  if (!normalizedValue) {
    return "Unknown";
  }

  return normalizedValue
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1).toLowerCase()}`)
    .join(" ");
};

const filterFallbackVehicles = (payload, search) => {
  const normalizedValue = normalizeSearch(search);
  const rows = payload?.data?.data ?? [];
  const filteredVehicles = normalizedValue
    ? rows.filter((item) =>
        [item.vehicle_name, item.vehicle_type, item.route_name].some((fieldValue) =>
          String(fieldValue ?? "").toLowerCase().includes(normalizedValue)
        )
      )
    : rows;

  return {
    ...payload,
    data: {
      ...payload.data,
      data: filteredVehicles,
      total: filteredVehicles.length,
      from: filteredVehicles.length ? 1 : 0,
      to: filteredVehicles.length,
      current_page: 1,
      last_page: 1,
      next_page_url: null,
      prev_page_url: null,
    },
  };
};

export const normalizeVehicles = (payload) => {
  const source = payload?.data ?? {};
  const rows = source.data ?? [];
  const vehicles = rows.map((item) => {
    const totalSeats = toNumber(item.total_seats);
    const vehicleType = formatVehicleType(item.vehicle_type);

    return {
      id: item.id,
      vehicleId: item.id,
      vehicleName: item.vehicle_name ?? "Unnamed vehicle",
      vehicleType,
      vehicleTypeKey: String(item.vehicle_type ?? "").trim().toLowerCase(),
      totalSeats,
      totalSeatsLabel: formatNumber(totalSeats),
      routeName: item.route_name ?? "Unassigned route",
    };
  });

  const totalSeatCapacity = vehicles.reduce((sum, vehicle) => sum + vehicle.totalSeats, 0);
  const vehicleTypeCount = new Set(vehicles.map((vehicle) => vehicle.vehicleTypeKey || "unknown")).size;
  const spotlightVehicle =
    [...vehicles].sort((first, second) => second.totalSeats - first.totalSeats)[0] ?? null;

  return {
    copy: VEHICLES_COPY,
    metrics: [
      {
        id: "total-vehicles",
        label: "Total vehicles",
        value: formatNumber(source.total ?? vehicles.length),
        change: `Page ${formatNumber(source.current_page ?? 1)} of ${formatNumber(source.last_page ?? 1)}`,
        changeTone: "info",
      },
      {
        id: "visible-vehicles",
        label: "Visible vehicles",
        value: formatNumber(vehicles.length),
        change: `${formatNumber(source.from ?? 0)}-${formatNumber(source.to ?? 0)} loaded`,
        changeTone: "success",
      },
      {
        id: "seat-capacity",
        label: "Visible seat capacity",
        value: formatNumber(totalSeatCapacity),
        change: `${spotlightVehicle?.totalSeatsLabel ?? "0"} seats on the largest visible vehicle`,
        changeTone: "warning",
      },
      {
        id: "vehicle-types",
        label: "Vehicle types",
        value: formatNumber(vehicleTypeCount),
        change: spotlightVehicle?.vehicleName ?? "No vehicle data available",
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
      totalSeatCapacity,
      totalSeatCapacityLabel: formatNumber(totalSeatCapacity),
      vehicleTypeCount,
      vehicleTypeCountLabel: formatNumber(vehicleTypeCount),
      spotlightVehicle,
    },
  };
};

export const getVehicles = async ({ page = 1, search = "" } = {}) => {
  try {
    const response = await apiClient.get(
      buildUrlWithQuery(API_URLS.reports.vehicles, {
        page,
        search: String(search ?? "").trim(),
      })
    );

    if (response.data) {
      return normalizeVehicles(response.data);
    }
  } catch {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 300);
    });
  }

  return normalizeVehicles(filterFallbackVehicles(VEHICLES_FALLBACK_RESPONSE, search));
};
