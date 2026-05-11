import { API_URLS } from "../../../constants/apiUrls";
import apiClient from "../../../services/apiClient";
import { formatDateTime } from "../../../utils/dateUtils";
import { buildUrlWithQuery } from "../../../utils/urlUtils";
import { VISA_COUNTRIES_COPY } from "../constants/visaCountries.constants";

const toNumber = (value) => Number(value) || 0;
const normalizeString = (value, fallback = "") => String(value ?? "").trim() || fallback;
const toBoolean = (value) => value === true || value === 1 || value === "1";

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(toNumber(value));

const getServerMessage = (error) =>
  error.response?.data?.message ??
  error.response?.data?.data?.message ??
  error.response?.data?.error;

const unwrapResponseData = (responseData) => responseData?.data ?? responseData;

export const normalizeVisaCountry = (item) => {
  const isActive = toBoolean(item?.is_active ?? item?.status);
  const isPopular = toBoolean(item?.is_popular);

  return {
    id: item?.id,
    countryId: item?.id,
    name: normalizeString(item?.name, "Unnamed country"),
    isoCode: normalizeString(item?.iso_code).toUpperCase(),
    nationalityName: normalizeString(item?.nationality_name, "Not set"),
    displayOrder: toNumber(item?.display_order),
    displayOrderLabel: formatNumber(item?.display_order),
    flag: normalizeString(item?.flag),
    isActive,
    isPopular,
    statusLabel: isActive ? "Active" : "Inactive",
    updatedAtLabel: formatDateTime(item?.updated_at, "Not available"),
  };
};

export const normalizeVisaCountryFormState = (country = {}) => ({
  name: normalizeString(country.name),
  isoCode: normalizeString(country.iso_code ?? country.isoCode).toUpperCase(),
  flag: normalizeString(country.flag),
  isPopular: toBoolean(country.is_popular ?? country.isPopular),
  status: toBoolean(country.is_active ?? country.status ?? true),
});

export const normalizeVisaCountries = (payload) => {
  const source = payload?.data ?? {};
  const countries = (source.data ?? []).map(normalizeVisaCountry);
  const activeCountries = countries.filter((country) => country.isActive);
  const popularCountries = countries.filter((country) => country.isPopular);

  return {
    copy: VISA_COUNTRIES_COPY,
    metrics: [
      {
        id: "visa-countries-total",
        label: "Total countries",
        value: formatNumber(source.total ?? countries.length),
        change: `Page ${formatNumber(source.current_page ?? 1)} of ${formatNumber(source.last_page ?? 1)}`,
        changeTone: "info",
      },
      {
        id: "visa-countries-visible",
        label: "Visible countries",
        value: formatNumber(countries.length),
        change: `${formatNumber(source.from ?? 0)}-${formatNumber(source.to ?? 0)} loaded`,
        changeTone: "success",
      },
      {
        id: "visa-countries-active",
        label: "Active on page",
        value: formatNumber(activeCountries.length),
        change: `${formatNumber(countries.length - activeCountries.length)} inactive rows`,
        changeTone: "warning",
      },
      {
        id: "visa-countries-popular",
        label: "Popular on page",
        value: formatNumber(popularCountries.length),
        change: popularCountries[0]?.name ?? "No popular countries flagged",
        changeTone: "danger",
      },
    ],
    countries,
    pagination: {
      currentPage: toNumber(source.current_page) || 1,
      lastPage: toNumber(source.last_page) || 1,
      total: toNumber(source.total) || countries.length,
      from: toNumber(source.from),
      to: toNumber(source.to),
      perPage: toNumber(source.per_page),
      hasPrev: Boolean(source.prev_page_url),
      hasNext: Boolean(source.next_page_url),
    },
    summary: {
      activeCountriesLabel: formatNumber(activeCountries.length),
      popularCountriesLabel: formatNumber(popularCountries.length),
      totalCountriesLabel: formatNumber(source.total ?? countries.length),
      spotlightCountry: popularCountries[0] ?? activeCountries[0] ?? countries[0] ?? null,
    },
  };
};

export const getVisaCountries = async ({ page = 1, search = "" } = {}) => {
  try {
    const response = await apiClient.get(
      buildUrlWithQuery(API_URLS.reports.visaCountries, {
        page,
        search: normalizeString(search),
      }),
    );

    if (response.data) {
      return normalizeVisaCountries(response.data);
    }
  } catch (error) {
    const serverMessage = getServerMessage(error);

    if (serverMessage) {
      throw new Error(serverMessage);
    }

    if (error instanceof Error) {
      throw error;
    }
  }

  throw new Error("Unable to load visa country information right now.");
};

export const getVisaCountryDetails = async (countryId) => {
  try {
    const response = await apiClient.get(API_URLS.reports.singleVisaCountry(countryId));
    const data = unwrapResponseData(response.data);

    if (data) {
      return data;
    }
  } catch (error) {
    const serverMessage = getServerMessage(error);

    if (serverMessage) {
      throw new Error(serverMessage);
    }

    if (error instanceof Error) {
      throw error;
    }
  }

  throw new Error("Unable to load visa country details right now.");
};

export const getVisaCountryDropdown = async () => {
  try {
    const response = await apiClient.get(
      buildUrlWithQuery(API_URLS.reports.visaCountryDropdown, { active_only: 1 }),
    );

    return unwrapResponseData(response.data) ?? [];
  } catch (error) {
    const serverMessage = getServerMessage(error);

    if (serverMessage) {
      throw new Error(serverMessage);
    }

    if (error instanceof Error) {
      throw error;
    }
  }

  throw new Error("Unable to load visa country options right now.");
};

export const createVisaCountry = async (values) => {
  try {
    const response = await apiClient.post(API_URLS.reports.visaCountries, {
      name: normalizeString(values.name),
      iso_code: normalizeString(values.isoCode).toUpperCase(),
      flag: normalizeString(values.flag),
      is_popular: Boolean(values.isPopular),
      status: Boolean(values.status),
    });

    if (response.data) {
      return response.data;
    }
  } catch (error) {
    const serverMessage = getServerMessage(error);

    if (serverMessage) {
      throw new Error(serverMessage);
    }

    if (error instanceof Error) {
      throw error;
    }
  }

  throw new Error("Unable to create the visa country right now.");
};

export const updateVisaCountry = async (countryId, values) => {
  try {
    const response = await apiClient.post(API_URLS.reports.visaCountryUpdate(countryId), {
      name: normalizeString(values.name),
      iso_code: normalizeString(values.isoCode).toUpperCase(),
    });

    if (response.data) {
      return response.data;
    }
  } catch (error) {
    const serverMessage = getServerMessage(error);

    if (serverMessage) {
      throw new Error(serverMessage);
    }

    if (error instanceof Error) {
      throw error;
    }
  }

  throw new Error("Unable to update the visa country right now.");
};
