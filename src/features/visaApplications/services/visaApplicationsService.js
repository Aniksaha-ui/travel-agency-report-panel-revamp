import { API_URLS } from "../../../constants/apiUrls";
import { APP_CONFIG } from "../../../services/config";
import apiClient from "../../../services/apiClient";
import { formatDate, formatDateTime } from "../../../utils/dateUtils";
import { buildUrlWithQuery } from "../../../utils/urlUtils";
import {
  formatVisaStatusLabel,
  VISA_APPLICATIONS_COPY,
} from "../constants/visaApplications.constants";

const toNumber = (value) => Number(value) || 0;
const normalizeString = (value, fallback = "") => String(value ?? "").trim() || fallback;

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(toNumber(value));

const getServerMessage = (error) =>
  error.response?.data?.message ??
  error.response?.data?.data?.message ??
  error.response?.data?.error;

const unwrapResponseData = (responseData) => responseData?.data ?? responseData;

const toFileUrl = (path) => {
  const normalizedPath = normalizeString(path);

  if (!normalizedPath) {
    return "";
  }

  if (/^https?:\/\//i.test(normalizedPath)) {
    return normalizedPath;
  }

  const baseUrl = normalizeString(APP_CONFIG.imageBaseUrl);
  const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedResourcePath = normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`;

  return normalizedBaseUrl ? `${normalizedBaseUrl}${normalizedResourcePath}` : normalizedResourcePath;
};

export const normalizeVisaApplication = (item) => ({
  id: item?.id,
  applicationId: item?.id,
  applicationNo: normalizeString(item?.application_no, "No application number"),
  fullName: normalizeString(item?.full_name, "Unknown applicant"),
  email: normalizeString(item?.email, "No email"),
  phone: normalizeString(item?.phone, "No phone"),
  passportNo: normalizeString(item?.passport_no, "No passport"),
  packageTitle: normalizeString(item?.package_title, normalizeString(item?.visa_name, "No package")),
  visaName: normalizeString(item?.visa_name, "No visa type"),
  visaType: normalizeString(item?.visa_type, normalizeString(item?.visa_name, "No visa type")),
  countryName: normalizeString(item?.country_name, "Unknown country"),
  status: normalizeString(item?.status, "draft"),
  statusLabel: formatVisaStatusLabel(item?.status),
  paymentStatus: normalizeString(item?.payment_status, "unpaid"),
  paymentStatusLabel: formatVisaStatusLabel(item?.payment_status),
  assignedOfficerName: normalizeString(item?.assigned_officer_name, "Not assigned"),
  createdAtLabel: formatDate(item?.created_at, "MMM D, YYYY", "Not available"),
});

export const normalizeVisaApplications = (payload) => {
  const source = payload?.data ?? {};
  const applications = (source.data ?? []).map(normalizeVisaApplication);
  const approvedApplications = applications.filter((application) => application.status === "approved");
  const pendingReviewApplications = applications.filter((application) =>
    ["submitted", "under_review", "document_pending", "processing"].includes(application.status),
  );
  const unpaidApplications = applications.filter((application) => application.paymentStatus !== "paid");

  return {
    copy: VISA_APPLICATIONS_COPY,
    metrics: [
      {
        id: "visa-applications-total",
        label: "Total applications",
        value: formatNumber(source.total ?? applications.length),
        change: `Page ${formatNumber(source.current_page ?? 1)} of ${formatNumber(source.last_page ?? 1)}`,
        changeTone: "info",
      },
      {
        id: "visa-applications-visible",
        label: "Visible submissions",
        value: formatNumber(applications.length),
        change: `${formatNumber(source.from ?? 0)}-${formatNumber(source.to ?? 0)} loaded`,
        changeTone: "success",
      },
      {
        id: "visa-applications-pending",
        label: "Pending review",
        value: formatNumber(pendingReviewApplications.length),
        change: `${formatNumber(approvedApplications.length)} approved on page`,
        changeTone: "warning",
      },
      {
        id: "visa-applications-unpaid",
        label: "Unpaid on page",
        value: formatNumber(unpaidApplications.length),
        change: unpaidApplications[0]?.applicationNo ?? "No unpaid applications",
        changeTone: "danger",
      },
    ],
    applications,
    pagination: {
      currentPage: toNumber(source.current_page) || 1,
      lastPage: toNumber(source.last_page) || 1,
      total: toNumber(source.total) || applications.length,
      from: toNumber(source.from),
      to: toNumber(source.to),
      perPage: toNumber(source.per_page),
      hasPrev: Boolean(source.prev_page_url),
      hasNext: Boolean(source.next_page_url),
    },
    summary: {
      approvedApplicationsLabel: formatNumber(approvedApplications.length),
      pendingReviewApplicationsLabel: formatNumber(pendingReviewApplications.length),
      spotlightApplication: pendingReviewApplications[0] ?? applications[0] ?? null,
    },
  };
};

export const getVisaApplications = async ({ page = 1, search = "" } = {}) => {
  try {
    const response = await apiClient.get(
      buildUrlWithQuery(API_URLS.reports.visaApplications, {
        page,
        search: normalizeString(search),
      }),
    );

    if (response.data) {
      return normalizeVisaApplications(response.data);
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

  throw new Error("Unable to load visa application information right now.");
};

export const getVisaApplicationDetails = async (applicationId) => {
  try {
    const response = await apiClient.get(API_URLS.reports.singleVisaApplication(applicationId));
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

  throw new Error("Unable to load visa application details right now.");
};

export const getUsersDropdown = async () => {
  try {
    const firstResponse = await apiClient.get(
      buildUrlWithQuery(API_URLS.admin.users, { page: 1, perPage: 200 }),
    );
    const firstPayload = firstResponse.data?.data;

    if (!firstPayload) {
      return [];
    }

    const users = [...(firstPayload.data ?? [])];
    const lastPage = toNumber(firstPayload.last_page) || 1;

    for (let page = 2; page <= lastPage; page += 1) {
      const nextResponse = await apiClient.get(
        buildUrlWithQuery(API_URLS.admin.users, { page, perPage: 200 }),
      );
      users.push(...(nextResponse.data?.data?.data ?? []));
    }

    return users.map((user) => ({
      id: user.id,
      name: normalizeString(user.name, "Unknown user"),
      role: normalizeString(user.role, "staff"),
    }));
  } catch (error) {
    const serverMessage = getServerMessage(error);

    if (serverMessage) {
      throw new Error(serverMessage);
    }

    if (error instanceof Error) {
      throw error;
    }
  }

  throw new Error("Unable to load user options right now.");
};

export const updateVisaApplication = async (applicationId, payload) => {
  try {
    const response = await apiClient.post(API_URLS.reports.visaApplicationUpdate(applicationId), payload);

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

  throw new Error("Unable to update the visa application right now.");
};

export const assignVisaApplication = async (payload) => {
  try {
    const response = await apiClient.post(API_URLS.reports.visaAssign, payload);

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

  throw new Error("Unable to assign the visa application right now.");
};

export const updateVisaApplicationStatus = async (payload) => {
  try {
    const response = await apiClient.post(API_URLS.reports.visaStatusUpdate, payload);

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

  throw new Error("Unable to update visa application status right now.");
};

export const verifyVisaDocument = async (payload) => {
  try {
    const response = await apiClient.post(API_URLS.reports.visaDocumentVerify, payload);

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

  throw new Error("Unable to review the visa document right now.");
};

export const printVisaApplication = async (applicationId) => {
  try {
    const response = await apiClient.get(API_URLS.reports.visaPrint(applicationId), {
      responseType: "blob",
      headers: {
        Accept: "application/pdf",
      },
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

  throw new Error("Unable to open the visa application PDF right now.");
};

export const normalizeVisaApplicationDetails = (application = {}) => ({
  ...application,
  full_name: normalizeString(application.full_name, "Unknown applicant"),
  email: normalizeString(application.email || application.applicant_info?.email, "No email"),
  phone: normalizeString(application.phone || application.applicant_info?.phone, "No phone"),
  passport_no: normalizeString(
    application.passport_no || application.applicant_info?.passport_number,
    "No passport",
  ),
  country_name: normalizeString(application.country_name, "Unknown country"),
  visa_name: normalizeString(application.visa_name, "No visa type"),
  package_title: normalizeString(application.package_title, "No package title"),
  assigned_officer_name: normalizeString(application.assigned_officer_name, "Not assigned"),
  admin_note: normalizeString(application.admin_note, "No admin note"),
  statusLabel: formatVisaStatusLabel(application.status),
  paymentStatusLabel: formatVisaStatusLabel(application.payment_status),
  appliedAtLabel: formatDateTime(application.applied_at, "Not available"),
  createdAtLabel: formatDateTime(application.created_at, "Not available"),
  travelDateLabel: formatDate(application.travel_date, "MMM D, YYYY", "Not available"),
  documents: (application.documents ?? []).map((document) => ({
    ...document,
    fileUrl: toFileUrl(document.file_path),
    documentLabel: normalizeString(document.document_label || document.document_key, "Document"),
    originalName: normalizeString(document.original_name, "Uploaded file"),
    uploadedByName: normalizeString(document.uploaded_by_name, "Unknown uploader"),
    reviewedByName: normalizeString(document.reviewed_by_name),
    sizeLabel: document.file_size ? `${(Number(document.file_size) / 1024).toFixed(1)} KB` : "Unknown size",
    createdAtLabel: formatDateTime(document.created_at, "Not available"),
    updatedAtLabel: formatDateTime(document.updated_at, "Not available"),
    verificationStatusLabel: formatVisaStatusLabel(document.verification_status),
  })),
  status_logs: (application.status_logs ?? []).map((log) => ({
    ...log,
    createdAtLabel: formatDateTime(log.created_at, "Not available"),
    oldStatusLabel: formatVisaStatusLabel(log.old_status),
    newStatusLabel: formatVisaStatusLabel(log.new_status),
    changedByName: normalizeString(log.changed_by_name, "System"),
  })),
  payments: (application.payments ?? []).map((payment) => ({
    ...payment,
    amountLabel: normalizeString(payment.amount, "0"),
    methodLabel: normalizeString(payment.payment_method, "Not set"),
    referenceLabel: normalizeString(payment.transaction_reference || payment.transaction_id, "Not set"),
    statusLabel: formatVisaStatusLabel(payment.payment_status),
    createdAtLabel: formatDateTime(payment.created_at, "Not available"),
  })),
});
