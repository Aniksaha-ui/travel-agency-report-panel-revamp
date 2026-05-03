import { API_URLS } from "../../../constants/apiUrls";
import apiClient from "../../../services/apiClient";
import {
  REFUND_STATUS_REPORT_COPY,
  REFUND_STATUS_REPORT_FALLBACK_RESPONSE,
} from "../constants/refundStatusReport.constants";

const toNumber = (value) => Number(value) || 0;

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(toNumber(value));

const formatCurrency = (value) => `BDT ${formatNumber(value)}`;

const formatLabel = (value) =>
  String(value ?? "Unknown")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

const getTone = (status) => {
  const normalizedStatus = String(status ?? "").toLowerCase();

  if (normalizedStatus.includes("disbursed") || normalizedStatus.includes("complete")) {
    return "success";
  }

  if (normalizedStatus.includes("pending")) {
    return "warning";
  }

  if (normalizedStatus.includes("cancel") || normalizedStatus.includes("reject")) {
    return "danger";
  }

  return "info";
};

export const normalizeRefundStatusReport = (payload) => {
  const rows = payload?.data ?? payload ?? [];
  const statuses = rows.map((item, index) => {
    const totalRefunds = toNumber(item.total_refunds);
    const totalAmount = toNumber(item.total_amount);

    return {
      id: `${item.status}-${index}`,
      status: formatLabel(item.status),
      totalRefunds,
      totalRefundsLabel: formatNumber(totalRefunds),
      totalAmount,
      totalAmountLabel: formatCurrency(totalAmount),
      tone: getTone(item.status),
    };
  });

  const totalRefunds = statuses.reduce((sum, item) => sum + item.totalRefunds, 0);
  const totalAmount = statuses.reduce((sum, item) => sum + item.totalAmount, 0);

  return {
    copy: REFUND_STATUS_REPORT_COPY,
    metrics: [
      {
        id: "refund-statuses",
        label: "Statuses",
        value: formatNumber(statuses.length),
        change: `${formatNumber(totalRefunds)} refunds tracked`,
        changeTone: "info",
      },
      {
        id: "refund-count",
        label: "Total refunds",
        value: formatNumber(totalRefunds),
        change: `${formatCurrency(totalAmount)} total value`,
        changeTone: "warning",
      },
      {
        id: "refund-amount",
        label: "Refund amount",
        value: formatCurrency(totalAmount),
        change: statuses[0]?.status ?? "No statuses available",
        changeTone: "success",
      },
    ],
    statuses,
    summary: {
      totalRefundsLabel: formatNumber(totalRefunds),
      totalAmountLabel: formatCurrency(totalAmount),
    },
    charts: {
      amountMix: statuses.map((item) => ({
        id: item.id,
        label: item.status,
        value: item.totalAmount,
      })),
    },
  };
};

export const getRefundStatusReport = async () => {
  try {
    const response = await apiClient.get(API_URLS.reports.refundStatusReport);

    if (response.data) {
      return normalizeRefundStatusReport(response.data);
    }
  } catch {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 300);
    });
  }

  return normalizeRefundStatusReport(REFUND_STATUS_REPORT_FALLBACK_RESPONSE);
};
