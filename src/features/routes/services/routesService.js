import { API_URLS } from "../../../constants/apiUrls";
import apiClient from "../../../services/apiClient";
import { buildUrlWithQuery } from "../../../utils/urlUtils";
import {
  ROUTES_COPY,
  ROUTES_FALLBACK_RESPONSE,
  ROUTE_DETAIL_FALLBACK_RESPONSE,
} from "../constants/routes.constants";

const toNumber = (value) => Number(value) || 0;
const normalizeSearch = (value) => String(value ?? "").trim().toLowerCase();
const normalizeString = (value) => String(value ?? "").trim();

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(toNumber(value));

const formatDateTime = (value) => {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(String(value).replace(" ", "T")));
};

const buildSearchPayload = (search) => {
  const normalizedSearch = normalizeString(search);

  if (!normalizedSearch) {
    return undefined;
  }

  return {
    origin: normalizedSearch,
    destination: normalizedSearch,
    route_name: normalizedSearch,
  };
};

const filterFallbackRoutes = (payload, search) => {
  const normalizedSearch = normalizeSearch(search);

  if (!normalizedSearch) {
    return payload;
  }

  const filteredRoutes = (payload?.data?.data ?? []).filter((item) =>
    [item.origin, item.destination, item.route_name].some((value) =>
      String(value ?? "").toLowerCase().includes(normalizedSearch)
    )
  );

  return {
    ...payload,
    data: {
      ...payload.data,
      data: filteredRoutes,
      total: filteredRoutes.length,
      from: filteredRoutes.length ? 1 : 0,
      to: filteredRoutes.length,
      current_page: 1,
      last_page: 1,
      next_page_url: null,
      prev_page_url: null,
    },
  };
};

export const normalizeRoutes = (payload) => {
  const source = payload?.data ?? {};
  const rows = source.data ?? [];
  const routes = rows.map((item) => ({
    id: item.id,
    routeId: item.id,
    origin: item.origin ?? "Unknown origin",
    destination: item.destination ?? "Unknown destination",
    routeName: item.route_name ?? "Unnamed route",
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    createdAtLabel: formatDateTime(item.created_at),
    updatedAtLabel: formatDateTime(item.updated_at),
  }));

  const uniqueOrigins = new Set(routes.map((item) => item.origin)).size;
  const uniqueDestinations = new Set(routes.map((item) => item.destination)).size;
  const spotlightRoute = routes[0] ?? null;

  return {
    copy: ROUTES_COPY,
    metrics: [
      {
        id: "total-routes",
        label: "Total routes",
        value: formatNumber(source.total ?? routes.length),
        change: `Page ${formatNumber(source.current_page ?? 1)} of ${formatNumber(source.last_page ?? 1)}`,
        changeTone: "info",
      },
      {
        id: "visible-routes",
        label: "Visible routes",
        value: formatNumber(routes.length),
        change: `${formatNumber(source.from ?? 0)}-${formatNumber(source.to ?? 0)} loaded`,
        changeTone: "success",
      },
      {
        id: "origins",
        label: "Origins",
        value: formatNumber(uniqueOrigins),
        change: `${formatNumber(uniqueDestinations)} destination regions`,
        changeTone: "warning",
      },
      {
        id: "destinations",
        label: "Destinations",
        value: formatNumber(uniqueDestinations),
        change: spotlightRoute ? spotlightRoute.routeName : "No routes available",
        changeTone: "danger",
      },
    ],
    routes,
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
      uniqueOrigins,
      uniqueOriginsLabel: formatNumber(uniqueOrigins),
      uniqueDestinations,
      uniqueDestinationsLabel: formatNumber(uniqueDestinations),
      spotlightRoute,
    },
  };
};

export const normalizeRouteDetails = (payload) => {
  const source = payload?.data ?? {};

  return {
    id: source.id,
    routeId: source.id,
    origin: source.origin ?? "Unknown origin",
    destination: source.destination ?? "Unknown destination",
    routeName: source.route_name ?? "Unnamed route",
    createdAtLabel: formatDateTime(source.created_at),
    updatedAtLabel: formatDateTime(source.updated_at),
  };
};

export const getRouteDetails = async (routeId) => {
  try {
    const response = await apiClient.get(API_URLS.reports.singleRoute(routeId));

    if (response.data?.data) {
      return normalizeRouteDetails(response.data);
    }
  } catch {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 200);
    });
  }

  return normalizeRouteDetails(ROUTE_DETAIL_FALLBACK_RESPONSE);
};

export const getRoutes = async ({ page = 1, search = "" } = {}) => {
  const searchPayload = buildSearchPayload(search);

  try {
    const response = await apiClient.request({
      method: "get",
      url: buildUrlWithQuery(API_URLS.reports.routes, { page }),
      data: searchPayload,
    });

    if (response.data) {
      return normalizeRoutes(response.data);
    }
  } catch {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 300);
    });
  }

  return normalizeRoutes(filterFallbackRoutes(ROUTES_FALLBACK_RESPONSE, search));
};
