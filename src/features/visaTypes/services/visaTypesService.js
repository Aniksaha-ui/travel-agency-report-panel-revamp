import { API_URLS } from "../../../constants/apiUrls";
import apiClient from "../../../services/apiClient";
import { formatDateTime } from "../../../utils/dateUtils";
import { buildUrlWithQuery } from "../../../utils/urlUtils";
import { VISA_TYPES_COPY } from "../constants/visaTypes.constants";

const toNumber = (value) => Number(value) || 0;
const normalizeString = (value, fallback = "") => String(value ?? "").trim() || fallback;
const toBoolean = (value) => value === true || value === 1 || value === "1";

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(toNumber(value));

const formatCurrencyValue = (value, currency = "") => {
  const amount = toNumber(value);

  return `${amount.toFixed(2)}${currency ? ` ${currency}` : ""}`;
};

const getServerMessage = (error) =>
  error.response?.data?.message ??
  error.response?.data?.data?.message ??
  error.response?.data?.error;

const unwrapResponseData = (responseData) => responseData?.data ?? responseData;

export const normalizeVisaType = (item) => {
  const isActive = toBoolean(item?.status);
  const feeValue = toNumber(item?.fee);

  return {
    id: item?.id,
    visaTypeId: item?.id,
    countryId: normalizeString(item?.country_id),
    countryName: normalizeString(item?.country_name, "Unknown country"),
    title: normalizeString(item?.title, normalizeString(item?.visa_name, "Untitled visa")),
    visaName: normalizeString(item?.visa_name, "Unnamed visa"),
    feeValue,
    feeLabel: formatCurrencyValue(item?.fee, item?.currency),
    currency: normalizeString(item?.currency, "N/A"),
    processingDays: toNumber(item?.processing_days),
    processingDaysLabel: `${formatNumber(item?.processing_days)} day${toNumber(item?.processing_days) === 1 ? "" : "s"}`,
    entryType: normalizeString(item?.entry_type, "Not set"),
    description: normalizeString(item?.description, "No description"),
    isActive,
    statusLabel: isActive ? "Active" : "Inactive",
    updatedAtLabel: formatDateTime(item?.updated_at, "Not available"),
  };
};

export const normalizeVisaTypeFormState = (visaType = {}) => ({
  countryId: normalizeString(visaType.country_id ?? visaType.countryId),
  visaName: normalizeString(visaType.visa_name ?? visaType.visaName),
  processingDays: normalizeString(visaType.processing_days ?? visaType.processingDays),
  fee: normalizeString(visaType.fee),
  description: normalizeString(visaType.description),
  status: toBoolean(visaType.status ?? true),
});

export const normalizeVisaTypes = (payload) => {
  const source = payload?.data ?? {};
  const visaTypes = (source.data ?? []).map(normalizeVisaType);
  const activeVisaTypes = visaTypes.filter((visaType) => visaType.isActive);
  const distinctCountries = new Set(visaTypes.map((visaType) => visaType.countryName)).size;
  const averageFee =
    visaTypes.length > 0
      ? visaTypes.reduce((sum, visaType) => sum + visaType.feeValue, 0) / visaTypes.length
      : 0;

  return {
    copy: VISA_TYPES_COPY,
    metrics: [
      {
        id: "visa-types-total",
        label: "Total visa types",
        value: formatNumber(source.total ?? visaTypes.length),
        change: `Page ${formatNumber(source.current_page ?? 1)} of ${formatNumber(source.last_page ?? 1)}`,
        changeTone: "info",
      },
      {
        id: "visa-types-visible",
        label: "Visible packages",
        value: formatNumber(visaTypes.length),
        change: `${formatNumber(source.from ?? 0)}-${formatNumber(source.to ?? 0)} loaded`,
        changeTone: "success",
      },
      {
        id: "visa-types-active",
        label: "Active on page",
        value: formatNumber(activeVisaTypes.length),
        change: `${formatNumber(visaTypes.length - activeVisaTypes.length)} inactive rows`,
        changeTone: "warning",
      },
      {
        id: "visa-types-countries",
        label: "Countries on page",
        value: formatNumber(distinctCountries),
        change: averageFee > 0 ? `Avg fee ${averageFee.toFixed(2)}` : "No fee data available",
        changeTone: "danger",
      },
    ],
    visaTypes,
    pagination: {
      currentPage: toNumber(source.current_page) || 1,
      lastPage: toNumber(source.last_page) || 1,
      total: toNumber(source.total) || visaTypes.length,
      from: toNumber(source.from),
      to: toNumber(source.to),
      perPage: toNumber(source.per_page),
      hasPrev: Boolean(source.prev_page_url),
      hasNext: Boolean(source.next_page_url),
    },
    summary: {
      activeVisaTypesLabel: formatNumber(activeVisaTypes.length),
      distinctCountriesLabel: formatNumber(distinctCountries),
      averageFeeLabel: averageFee > 0 ? averageFee.toFixed(2) : "0.00",
      spotlightVisaType: activeVisaTypes[0] ?? visaTypes[0] ?? null,
    },
  };
};

export const getVisaTypes = async ({ page = 1, search = "" } = {}) => {
  try {
    const response = await apiClient.get(
      buildUrlWithQuery(API_URLS.reports.visaTypes, {
        page,
        search: normalizeString(search),
      }),
    );

    if (response.data) {
      return normalizeVisaTypes(response.data);
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

  throw new Error("Unable to load visa type information right now.");
};

export const getVisaTypeDetails = async (visaTypeId) => {
  try {
    const response = await apiClient.get(API_URLS.reports.singleVisaType(visaTypeId));
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

  throw new Error("Unable to load visa type details right now.");
};

export const getAllVisaTypes = async () => {
  try {
    const firstResponse = await apiClient.get(buildUrlWithQuery(API_URLS.reports.visaTypes, { page: 1 }));
    const firstPayload = firstResponse.data?.data;

    if (!firstPayload) {
      return [];
    }

    const allVisaTypes = [...(firstPayload.data ?? [])];
    const lastPage = toNumber(firstPayload.last_page) || 1;

    for (let page = 2; page <= lastPage; page += 1) {
      const nextResponse = await apiClient.get(buildUrlWithQuery(API_URLS.reports.visaTypes, { page }));
      allVisaTypes.push(...(nextResponse.data?.data?.data ?? []));
    }

    return allVisaTypes.map(normalizeVisaType);
  } catch (error) {
    const serverMessage = getServerMessage(error);

    if (serverMessage) {
      throw new Error(serverMessage);
    }

    if (error instanceof Error) {
      throw error;
    }
  }

  throw new Error("Unable to load visa type options right now.");
};

export const createVisaType = async (values) => {
  try {
    const response = await apiClient.post(API_URLS.reports.visaTypes, {
      country_id: Number(values.countryId),
      visa_name: normalizeString(values.visaName),
      processing_days: Number(values.processingDays),
      fee: Number(values.fee),
      description: normalizeString(values.description),
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

  throw new Error("Unable to create the visa type right now.");
};

export const updateVisaType = async (visaTypeId, values) => {
  try {
    const response = await apiClient.post(API_URLS.reports.visaTypeUpdate(visaTypeId), {
      country_id: Number(values.countryId),
      visa_name: normalizeString(values.visaName),
      processing_days: Number(values.processingDays),
      fee: Number(values.fee),
      description: normalizeString(values.description),
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

  throw new Error("Unable to update the visa type right now.");
};
