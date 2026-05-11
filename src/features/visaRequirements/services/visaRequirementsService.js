import { API_URLS } from "../../../constants/apiUrls";
import apiClient from "../../../services/apiClient";
import { formatDateTime } from "../../../utils/dateUtils";
import { buildUrlWithQuery } from "../../../utils/urlUtils";
import { VISA_REQUIREMENTS_COPY } from "../constants/visaRequirements.constants";

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

export const normalizeVisaRequirement = (item) => {
  const isRequired = toBoolean(item?.is_required);
  const allowMultiple = toBoolean(item?.allow_multiple);

  return {
    id: item?.id,
    requirementId: item?.id,
    visaTypeId: normalizeString(item?.visa_type_id),
    countryName: normalizeString(item?.country_name, "Unknown country"),
    visaName: normalizeString(item?.visa_name || item?.visa_title, "Unknown visa type"),
    documentName: normalizeString(item?.document_name, "Unnamed document"),
    instructions: normalizeString(item?.instructions, "No instructions"),
    isRequired,
    allowMultiple,
    requiredLabel: isRequired ? "Required" : "Optional",
    multipleLabel: allowMultiple ? "Multiple uploads" : "Single upload",
    sortOrder: toNumber(item?.sort_order),
    sortOrderLabel: formatNumber(item?.sort_order),
    updatedAtLabel: formatDateTime(item?.updated_at, "Not available"),
  };
};

export const normalizeVisaRequirementFormState = (requirement = {}) => ({
  visaTypeId: normalizeString(requirement.visa_type_id ?? requirement.visaTypeId),
  documentName: normalizeString(requirement.document_name ?? requirement.documentName),
  instructions: normalizeString(requirement.instructions),
  isRequired: toBoolean(requirement.is_required ?? requirement.isRequired ?? true),
  allowMultiple: toBoolean(requirement.allow_multiple ?? requirement.allowMultiple),
  sortOrder: normalizeString(requirement.sort_order ?? requirement.sortOrder ?? 0),
});

export const normalizeVisaRequirements = (payload) => {
  const source = payload?.data ?? {};
  const requirements = (source.data ?? []).map(normalizeVisaRequirement);
  const requiredDocuments = requirements.filter((requirement) => requirement.isRequired);
  const multiUploadDocuments = requirements.filter((requirement) => requirement.allowMultiple);

  return {
    copy: VISA_REQUIREMENTS_COPY,
    metrics: [
      {
        id: "visa-requirements-total",
        label: "Total requirements",
        value: formatNumber(source.total ?? requirements.length),
        change: `Page ${formatNumber(source.current_page ?? 1)} of ${formatNumber(source.last_page ?? 1)}`,
        changeTone: "info",
      },
      {
        id: "visa-requirements-visible",
        label: "Visible documents",
        value: formatNumber(requirements.length),
        change: `${formatNumber(source.from ?? 0)}-${formatNumber(source.to ?? 0)} loaded`,
        changeTone: "success",
      },
      {
        id: "visa-requirements-required",
        label: "Required on page",
        value: formatNumber(requiredDocuments.length),
        change: `${formatNumber(requirements.length - requiredDocuments.length)} optional rows`,
        changeTone: "warning",
      },
      {
        id: "visa-requirements-multi",
        label: "Multi-upload on page",
        value: formatNumber(multiUploadDocuments.length),
        change: multiUploadDocuments[0]?.documentName ?? "No multi-upload documents",
        changeTone: "danger",
      },
    ],
    requirements,
    pagination: {
      currentPage: toNumber(source.current_page) || 1,
      lastPage: toNumber(source.last_page) || 1,
      total: toNumber(source.total) || requirements.length,
      from: toNumber(source.from),
      to: toNumber(source.to),
      perPage: toNumber(source.per_page),
      hasPrev: Boolean(source.prev_page_url),
      hasNext: Boolean(source.next_page_url),
    },
    summary: {
      requiredDocumentsLabel: formatNumber(requiredDocuments.length),
      multiUploadDocumentsLabel: formatNumber(multiUploadDocuments.length),
      spotlightRequirement: requiredDocuments[0] ?? requirements[0] ?? null,
    },
  };
};

export const getVisaRequirements = async ({ page = 1, search = "" } = {}) => {
  try {
    const response = await apiClient.get(
      buildUrlWithQuery(API_URLS.reports.visaRequirements, {
        page,
        search: normalizeString(search),
      }),
    );

    if (response.data) {
      return normalizeVisaRequirements(response.data);
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

  throw new Error("Unable to load visa requirement information right now.");
};

export const getVisaRequirementDetails = async (requirementId) => {
  try {
    const response = await apiClient.get(API_URLS.reports.singleVisaRequirement(requirementId));
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

  throw new Error("Unable to load visa requirement details right now.");
};

export const createVisaRequirement = async (values) => {
  try {
    const response = await apiClient.post(API_URLS.reports.visaRequirements, {
      visa_type_id: Number(values.visaTypeId),
      document_name: normalizeString(values.documentName),
      instructions: normalizeString(values.instructions),
      is_required: Boolean(values.isRequired),
      allow_multiple: Boolean(values.allowMultiple),
      sort_order: Number(values.sortOrder) || 0,
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

  throw new Error("Unable to create the visa requirement right now.");
};

export const updateVisaRequirement = async (requirementId, values) => {
  try {
    const response = await apiClient.post(API_URLS.reports.visaRequirementUpdate(requirementId), {
      visa_type_id: Number(values.visaTypeId),
      document_name: normalizeString(values.documentName),
      instructions: normalizeString(values.instructions),
      is_required: Boolean(values.isRequired),
      allow_multiple: Boolean(values.allowMultiple),
      sort_order: Number(values.sortOrder) || 0,
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

  throw new Error("Unable to update the visa requirement right now.");
};
