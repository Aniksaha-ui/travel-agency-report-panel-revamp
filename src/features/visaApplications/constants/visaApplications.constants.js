export const VISA_APPLICATIONS_COPY = {
  pageTitle: "Visa applications",
  pageSubtitle:
    "Track applicant submissions, review payment and status progress, assign officers, and validate documents before approval.",
};

export const VISA_APPLICATION_STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "submitted", label: "Submitted" },
  { value: "under_review", label: "Under Review" },
  { value: "document_pending", label: "Document Pending" },
  { value: "processing", label: "Processing" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export const VISA_DOCUMENT_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export const formatVisaStatusLabel = (value) =>
  value
    ? String(value)
        .split("_")
        .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
        .join(" ")
    : "-";

export const getVisaStatusColor = (status) => {
  switch (status) {
    case "approved":
      return "success";
    case "submitted":
      return "info";
    case "under_review":
      return "warning";
    case "document_pending":
      return "warning";
    case "processing":
      return "info";
    case "rejected":
      return "danger";
    default:
      return "neutral";
  }
};

export const getPaymentStatusColor = (status) => {
  switch (status) {
    case "paid":
      return "success";
    case "unpaid":
      return "danger";
    default:
      return "neutral";
  }
};
