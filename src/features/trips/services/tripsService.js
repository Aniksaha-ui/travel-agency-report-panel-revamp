import { API_URLS } from "../../../constants/apiUrls";
import apiClient from "../../../services/apiClient";
import { APP_CONFIG } from "../../../services/config";
import { buildUrlWithQuery } from "../../../utils/urlUtils";
import { TRIPS_COPY, TRIPS_FALLBACK_RESPONSE } from "../constants/trips.constants";

const toNumber = (value) => Number(value) || 0;

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(toNumber(value));

const formatCurrency = (value) => `BDT ${formatNumber(value)}`;

const formatDateTime = (value) => {
  if (!value) {
    return "Not scheduled";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(String(value).replace(" ", "T")));
};

const formatDateRange = (departureTime, arrivalTime) => {
  const departureLabel = formatDateTime(departureTime);
  const arrivalLabel = formatDateTime(arrivalTime);

  return departureLabel === arrivalLabel ? departureLabel : `${departureLabel} - ${arrivalLabel}`;
};

const normalizeFilterValue = (value) => String(value ?? "").trim();
const normalizeDateValue = (value) => String(value ?? "").trim().split(" ")[0];
const normalizeStringValue = (value) => String(value ?? "").trim();
const normalizeNullableString = (value) => (value == null ? "" : String(value));
const buildImageUrl = (filePath) => {
  const normalizedPath = String(filePath ?? "").replace(/\\/g, "/").replace(/^\/+/, "");

  if (!normalizedPath) {
    return "";
  }

  if (/^https?:\/\//i.test(normalizedPath)) {
    return normalizedPath;
  }

  const baseUrl = String(APP_CONFIG.imageBaseUrl || "").replace(/\/+$/, "");

  return baseUrl ? `${baseUrl}/${normalizedPath}` : `/${normalizedPath}`;
};
const toStatusBoolean = (value) => String(value ?? "").trim() === "1";
const formatApiDate = (value) => {
  const normalizedValue = normalizeDateValue(value);

  return normalizedValue ? `${normalizedValue} 00:00:00` : "";
};
const filterFallbackTrips = (payload, search) => {
  const normalizedSearch = normalizeFilterValue(search).toLowerCase();
  const rows = payload?.data?.data ?? [];
  const filteredTrips = normalizedSearch
    ? rows.filter((item) =>
        [item.trip_name, item.route_name, item.vehicle_name]
          .some((value) => String(value ?? "").toLowerCase().includes(normalizedSearch))
      )
    : rows;

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

export const normalizeTrips = (payload) => {
  const source = payload?.data ?? {};
  const rows = source.data ?? [];
  const trips = rows.map((item) => {
    const price = toNumber(item.price);
    const isActive = toNumber(item.is_active) === 1;

    return {
      id: item.id,
      tripId: item.id,
      tripName: item.trip_name ?? "Unnamed trip",
      departureTime: item.departure_time,
      arrivalTime: item.arrival_time,
      departureLabel: formatDateTime(item.departure_time),
      arrivalLabel: formatDateTime(item.arrival_time),
      scheduleLabel: formatDateRange(item.departure_time, item.arrival_time),
      price,
      priceLabel: formatCurrency(price),
      vehicleName: item.vehicle_name ?? "Unassigned vehicle",
      routeName: item.route_name ?? "Unknown route",
      isActive,
      statusLabel: isActive ? "Active" : "Inactive",
    };
  });

  const totalVisibleRevenue = trips.reduce((sum, trip) => sum + trip.price, 0);
  const activeTrips = trips.filter((trip) => trip.isActive).length;
  const inactiveTrips = trips.length - activeTrips;
  const highlightedTrip =
    [...trips].sort((first, second) => second.price - first.price)[0] ?? null;

  return {
    copy: TRIPS_COPY,
    metrics: [
      {
        id: "total-trips",
        label: "Total trips",
        value: formatNumber(source.total ?? trips.length),
        change: `Page ${formatNumber(source.current_page ?? 1)} of ${formatNumber(source.last_page ?? 1)}`,
        changeTone: "info",
      },
      {
        id: "visible-trips",
        label: "Visible trips",
        value: formatNumber(trips.length),
        change: `${formatNumber(source.from ?? 0)}-${formatNumber(source.to ?? 0)} loaded`,
        changeTone: "success",
      },
      {
        id: "active-trips",
        label: "Active trips",
        value: formatNumber(activeTrips),
        change: `${formatNumber(inactiveTrips)} inactive on this page`,
        changeTone: "warning",
      },
      {
        id: "visible-fares",
        label: "Visible fares",
        value: formatCurrency(totalVisibleRevenue),
        change: highlightedTrip
          ? `${highlightedTrip.tripName} is highest at ${highlightedTrip.priceLabel}`
          : "No trip fares available",
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
      totalVisibleRevenue,
      totalVisibleRevenueLabel: formatCurrency(totalVisibleRevenue),
      activeTrips,
      activeTripsLabel: formatNumber(activeTrips),
      inactiveTrips,
      inactiveTripsLabel: formatNumber(inactiveTrips),
      highlightedTrip,
    },
  };
};

export const normalizeTripDetails = (payload) => {
  const source = payload?.data ?? {};

  return {
    id: normalizeNullableString(source.id),
    vehicleId: normalizeNullableString(source.vehicle_id),
    routeId: normalizeNullableString(source.route_id),
    tripName: normalizeNullableString(source.trip_name),
    departureDate: normalizeDateValue(source.departure_time),
    arrivalDate: normalizeDateValue(source.arrival_time),
    departureAt: normalizeNullableString(source.departure_at),
    arrivalAt: normalizeNullableString(source.arrival_at),
    price: normalizeNullableString(source.price),
    isActive: toStatusBoolean(source.is_active),
    status: normalizeNullableString(source.status || "1"),
    description: normalizeNullableString(source.description),
    imagePath: normalizeNullableString(source.image),
    imageUrl: buildImageUrl(source.image),
  };
};

const normalizeDropdownOptions = (payload, valueKey, labelKey, defaultLabel) => {
  const rows = payload?.data ?? [];

  return [
    { value: "", label: defaultLabel },
    ...rows.map((item) => ({
      value: normalizeNullableString(item[valueKey]),
      label: normalizeNullableString(item[labelKey]),
    })),
  ];
};

export const getTripFormOptions = async () => {
  const [routesResponse, vehiclesResponse] = await Promise.all([
    apiClient.get(API_URLS.reports.routeDropdown),
    apiClient.get(API_URLS.reports.vehicleDropdown),
  ]);

  return {
    routeOptions: normalizeDropdownOptions(
      routesResponse.data,
      "id",
      "route_name",
      "Select a route"
    ),
    vehicleOptions: normalizeDropdownOptions(
      vehiclesResponse.data,
      "id",
      "vehicle_name",
      "Select a vehicle"
    ),
  };
};

export const getTripDetails = async (tripId) => {
  const response = await apiClient.get(API_URLS.reports.singleTrip(tripId));

  if (response.data?.data) {
    return normalizeTripDetails(response.data);
  }

  throw new Error(response.data?.message || "Unable to load trip details.");
};

export const updateTrip = async (tripId, values) => {
  const formData = new FormData();

  formData.append("id", normalizeNullableString(tripId));
  formData.append("vehicle_id", normalizeStringValue(values.vehicleId));
  formData.append("route_id", normalizeStringValue(values.routeId));
  formData.append("trip_name", normalizeStringValue(values.tripName));
  formData.append("departure_time", formatApiDate(values.departureDate));
  formData.append("arrival_time", formatApiDate(values.arrivalDate));
  formData.append("departure_at", normalizeStringValue(values.departureAt));
  formData.append("arrival_at", normalizeStringValue(values.arrivalAt));
  formData.append("price", normalizeStringValue(values.price));
  formData.append("is_active", values.isActive ? "1" : "0");
  formData.append("status", normalizeStringValue(values.status || "1"));
  formData.append("description", normalizeNullableString(values.description));

  if (values.imageFile instanceof File) {
    formData.append("image", values.imageFile);
  } else if (values.imagePath) {
    formData.append("image", normalizeNullableString(values.imagePath));
  }

  try {
    const response = await apiClient.post(API_URLS.reports.tripUpdate(tripId), formData);

    if (response.data) {
      return response.data;
    }
  } catch (error) {
    const serverMessage = error.response?.data?.message;

    if (serverMessage) {
      throw new Error(serverMessage);
    }

    if (error instanceof Error) {
      throw error;
    }
  }

  throw new Error("Unable to update trip right now.");
};

export const getTrips = async ({ page = 1, search = "" } = {}) => {
  try {
    const response = await apiClient.request({
      method: "get",
      url: buildUrlWithQuery(API_URLS.reports.trips, { page, search: normalizeFilterValue(search) }),
    });

    if (response.data) {
      return normalizeTrips(response.data);
    }
  } catch {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 300);
    });
  }

  return normalizeTrips(filterFallbackTrips(TRIPS_FALLBACK_RESPONSE, search));
};
