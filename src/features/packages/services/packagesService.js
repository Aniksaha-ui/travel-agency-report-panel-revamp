import { API_URLS } from "../../../constants/apiUrls";
import { APP_CONFIG } from "../../../services/config";
import apiClient from "../../../services/apiClient";
import { buildUrlWithQuery } from "../../../utils/urlUtils";
import {
  PACKAGE_DETAIL_FALLBACK_RESPONSE,
  PACKAGES_COPY,
  PACKAGES_FALLBACK_RESPONSE,
} from "../constants/packages.constants";

const DEFAULT_PACKAGES_PER_PAGE = 20;

const toNumber = (value) => Number(value) || 0;
const normalizeString = (value) => String(value ?? "").trim();
const normalizeLowerString = (value) => normalizeString(value).toLowerCase();
const normalizeNullableString = (value) => (value == null ? "" : String(value));

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(toNumber(value));

const formatCurrency = (value) => `BDT ${formatNumber(value)}`;

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

const filterFallbackPackages = (payload, search) => {
  const normalizedValue = normalizeLowerString(search);
  const rows = payload?.data?.data ?? [];
  const filteredPackages = normalizedValue
    ? rows.filter((item) =>
        [item.name, item.description, item.trip_name]
          .some((fieldValue) => String(fieldValue ?? "").toLowerCase().includes(normalizedValue))
      )
    : rows;

  return {
    ...payload,
    data: {
      ...payload.data,
      data: filteredPackages,
      total: filteredPackages.length,
      from: filteredPackages.length ? 1 : 0,
      to: filteredPackages.length,
      current_page: 1,
      last_page: 1,
      next_page_url: null,
      prev_page_url: null,
    },
  };
};

const toBooleanFlag = (value) => toNumber(value) === 1;

const getCoverageItems = ({ includesMeal, includesHotel, includesBus }) => [
  includesMeal ? "Meal" : null,
  includesHotel ? "Hotel" : null,
  includesBus ? "Bus" : null,
].filter(Boolean);

const normalizePricing = (pricing = []) =>
  pricing.map((item, index) => {
    const adultPrice = toNumber(item.adult_price);
    const childPrice = toNumber(item.child_price);

    return {
      id: `${adultPrice}-${childPrice}-${index}`,
      adultPrice: normalizeNullableString(item.adult_price),
      childPrice: normalizeNullableString(item.child_price),
      adultPriceValue: adultPrice,
      childPriceValue: childPrice,
      adultPriceLabel: formatCurrency(adultPrice),
      childPriceLabel: formatCurrency(childPrice),
    };
  });

export const createEmptyPackagePricing = () => ({
  adultPrice: "",
  childPrice: "",
});

export const normalizePackages = (payload) => {
  const source = payload?.data ?? {};
  const rows = source.data ?? [];
  const packages = rows.map((item) => {
    const includesMeal = toBooleanFlag(item.includes_meal);
    const includesHotel = toBooleanFlag(item.includes_hotel);
    const includesBus = toBooleanFlag(item.includes_bus);
    const coverageItems = getCoverageItems({ includesMeal, includesHotel, includesBus });

    return {
      id: item.id,
      packageId: item.id,
      name: item.name ?? "Untitled package",
      description: item.description ?? "",
      tripId: item.trip_id,
      tripName: item.trip_name ?? "Unassigned trip",
      includesMeal,
      includesHotel,
      includesBus,
      coverageItems,
      coverageLabel: coverageItems.length ? coverageItems.join(", ") : "Custom coverage",
      imagePath: normalizeString(item.image),
      imageUrl: buildImageUrl(item.image),
      createdAtLabel: formatDateTime(item.created_at),
      updatedAtLabel: formatDateTime(item.updated_at),
    };
  });

  const mealIncludedCount = packages.filter((item) => item.includesMeal).length;
  const hotelIncludedCount = packages.filter((item) => item.includesHotel).length;
  const busIncludedCount = packages.filter((item) => item.includesBus).length;
  const spotlightPackage = packages[0] ?? null;

  return {
    copy: PACKAGES_COPY,
    metrics: [
      {
        id: "total-packages",
        label: "Total packages",
        value: formatNumber(source.total ?? packages.length),
        change: `Page ${formatNumber(source.current_page ?? 1)} of ${formatNumber(source.last_page ?? 1)}`,
        changeTone: "info",
      },
      {
        id: "visible-packages",
        label: "Visible packages",
        value: formatNumber(packages.length),
        change: `${formatNumber(source.from ?? 0)}-${formatNumber(source.to ?? 0)} loaded`,
        changeTone: "success",
      },
      {
        id: "meal-included",
        label: "Meal included",
        value: formatNumber(mealIncludedCount),
        change: `${formatNumber(hotelIncludedCount)} with hotel coverage`,
        changeTone: "warning",
      },
      {
        id: "bus-included",
        label: "Bus included",
        value: formatNumber(busIncludedCount),
        change: spotlightPackage?.name ?? "No package data available",
        changeTone: "danger",
      },
    ],
    packages,
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
      mealIncludedCount,
      mealIncludedCountLabel: formatNumber(mealIncludedCount),
      hotelIncludedCount,
      hotelIncludedCountLabel: formatNumber(hotelIncludedCount),
      busIncludedCount,
      busIncludedCountLabel: formatNumber(busIncludedCount),
      spotlightPackage,
    },
  };
};

export const normalizePackageDetails = (payload) => {
  const source = payload?.data ?? {};
  const includesMeal = toBooleanFlag(source.includes_meal);
  const includesHotel = toBooleanFlag(source.includes_hotel);
  const includesBus = toBooleanFlag(source.includes_bus);
  const pricing = normalizePricing(source.pricing);
  const lowestAdultPrice = pricing.length
    ? Math.min(...pricing.map((item) => item.adultPriceValue).filter(Boolean))
    : 0;

  return {
    packageId: source.id,
    name: source.name ?? "Untitled package",
    description: source.description ?? "",
    tripId: source.trip_id,
    includesMeal,
    includesHotel,
    includesBus,
    coverageItems: getCoverageItems({ includesMeal, includesHotel, includesBus }),
    imagePath: normalizeString(source.image),
    imageUrl: buildImageUrl(source.image),
    createdAtLabel: formatDateTime(source.created_at),
    updatedAtLabel: formatDateTime(source.updated_at),
    inclusions: Array.isArray(source.inclusions) ? source.inclusions.filter(Boolean) : [],
    exclusions: Array.isArray(source.exclusions) ? source.exclusions.filter(Boolean) : [],
    pricing,
    lowestAdultPriceLabel: lowestAdultPrice ? formatCurrency(lowestAdultPrice) : "No pricing",
    trip: {
      tripId: source.trip?.trip_id,
      routeId: source.trip?.route_id,
      vehicleId: source.trip?.vehicle_id,
      departureTimeLabel: formatDateTime(source.trip?.departure_time),
      arrivalTimeLabel: formatDateTime(source.trip?.arrival_time),
      departureAt: normalizeString(source.trip?.departure_at),
      arrivalAt: normalizeString(source.trip?.arrival_at),
      routeName: source.trip?.route_name ?? "Unknown route",
    },
  };
};

const normalizeDropdownOptions = ({
  payload,
  rowsAccessor = (response) => response?.data ?? [],
  valueKey,
  labelKey,
  defaultLabel,
  labelBuilder,
}) => {
  const rows = rowsAccessor(payload);

  return [
    { value: "", label: defaultLabel },
    ...rows.map((item) => ({
      value: normalizeNullableString(item[valueKey]),
      label: labelBuilder
        ? labelBuilder(item)
        : normalizeNullableString(item[labelKey]),
    })),
  ];
};

export const getPackageFormOptions = async () => {
  const [tripsResponse, guidesResponse] = await Promise.all([
    apiClient.get(
      buildUrlWithQuery(API_URLS.reports.trips, {
        page: 1,
        perPage: 100,
      })
    ),
    apiClient.get(API_URLS.reports.guideDropdown),
  ]);

  return {
    tripOptions: normalizeDropdownOptions({
      payload: tripsResponse.data,
      rowsAccessor: (response) => response?.data?.data ?? [],
      valueKey: "id",
      labelKey: "trip_name",
      defaultLabel: "Select a trip",
      labelBuilder: (item) => {
        const tripName = normalizeNullableString(item.trip_name);
        const routeName = normalizeNullableString(item.route_name);

        return routeName ? `${tripName} - ${routeName}` : tripName;
      },
    }),
    guideOptions: normalizeDropdownOptions({
      payload: guidesResponse.data,
      valueKey: "id",
      labelKey: "guide_name",
      defaultLabel: "Select a guide",
      labelBuilder: (item) =>
        normalizeNullableString(item.guide_name || item.name || item.full_name || item.id),
    }),
  };
};

export const getPackages = async ({ page = 1, search = "" } = {}) => {
  try {
    const response = await apiClient.get(
      buildUrlWithQuery(API_URLS.reports.packages, {
        page,
        perPage: DEFAULT_PACKAGES_PER_PAGE,
      })
    );

    if (response.data) {
      if (!normalizeString(search)) {
        return normalizePackages(response.data);
      }

      return normalizePackages(filterFallbackPackages(response.data, search));
    }
  } catch {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 300);
    });
  }

  return normalizePackages(filterFallbackPackages(PACKAGES_FALLBACK_RESPONSE, search));
};

export const getPackageDetails = async (packageId) => {
  try {
    const response = await apiClient.get(API_URLS.reports.singlePackage(packageId));

    if (response.data?.data) {
      return normalizePackageDetails(response.data);
    }
  } catch {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 200);
    });
  }

  return normalizePackageDetails(PACKAGE_DETAIL_FALLBACK_RESPONSE);
};

export const createPackage = async (values) => {
  const payload = {
    name: normalizeString(values.name),
    description: normalizeString(values.description),
    includes_meal: values.includesMeal ? 1 : 0,
    includes_hotel: values.includesHotel ? 1 : 0,
    includes_bus: values.includesBus ? 1 : 0,
    trip_id: toNumber(values.tripId),
    guide_id: toNumber(values.guideId),
    image: normalizeString(values.imageUrl),
    inclusions: (values.inclusions ?? []).map(normalizeString).filter(Boolean),
    exclusions: (values.exclusions ?? []).map(normalizeString).filter(Boolean),
    pricing: (values.pricing ?? []).map((item) => ({
      adult_price: toNumber(item.adultPrice),
      child_price: toNumber(item.childPrice),
    })),
  };

  try {
    const response = await apiClient.post(API_URLS.reports.packageCreate, payload);

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

  throw new Error("Unable to create the package right now.");
};
