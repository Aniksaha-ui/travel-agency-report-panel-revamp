import { API_URLS } from "../../../constants/apiUrls";
import apiClient from "../../../services/apiClient";
import { formatTravelDate } from "../../../utils/dateUtils";
import {
  FINANCIAL_REPORT_COPY,
  FINANCIAL_REPORT_FALLBACK_RESPONSE,
} from "../constants/financialReport.constants";

const toNumber = (value) => Number(value) || 0;

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(toNumber(value));

const formatCurrency = (value) => `BDT ${formatNumber(value)}`;
const shortenLabel = (value, maxLength = 18) =>
  String(value ?? "").length > maxLength ? `${String(value).slice(0, maxLength - 1)}...` : String(value ?? "");

const formatFiscalYear = (start, end) => `${formatTravelDate(start)} - ${formatTravelDate(end)}`;

export const normalizeFinancialReport = (payload) => {
  const reports = (Array.isArray(payload?.data) ? payload.data : []).map((item) => {
    const paymentAmount = toNumber(item.payment_amount);
    const refund = toNumber(item.refund);
    const costing = toNumber(item.costing);
    const grossAfterRefund = paymentAmount - refund;
    const retainedAmount = grossAfterRefund - costing;
    const marginRate = paymentAmount ? Math.round((retainedAmount / paymentAmount) * 100) : 0;
    const costRate = paymentAmount ? Math.round((costing / paymentAmount) * 100) : 0;

    return {
      id: item.id,
      fiscalYearId: item.id,
      fyStart: item.fy_start,
      fyEnd: item.fy_end,
      fiscalYearLabel: formatFiscalYear(item.fy_start, item.fy_end),
      shortFiscalYearLabel: `${new Date(item.fy_start).getFullYear()}-${new Date(item.fy_end).getFullYear()}`,
      paymentAmount,
      refund,
      costing,
      grossAfterRefund,
      retainedAmount,
      marginRate,
      costRate,
      paymentAmountLabel: formatCurrency(paymentAmount),
      refundLabel: formatCurrency(refund),
      costingLabel: formatCurrency(costing),
      grossAfterRefundLabel: formatCurrency(grossAfterRefund),
      retainedAmountLabel: formatCurrency(retainedAmount),
      marginRateLabel: `${marginRate}% margin`,
      costRateLabel: `${costRate}% cost ratio`,
    };
  });

  const totalPayments = reports.reduce((sum, report) => sum + report.paymentAmount, 0);
  const totalRefunds = reports.reduce((sum, report) => sum + report.refund, 0);
  const totalCosting = reports.reduce((sum, report) => sum + report.costing, 0);
  const totalRetained = reports.reduce((sum, report) => sum + report.retainedAmount, 0);
  const totalMarginRate = totalPayments ? Math.round((totalRetained / totalPayments) * 100) : 0;
  const latestReport = reports[reports.length - 1] ?? null;
  const strongestReport =
    [...reports].sort((first, second) => second.retainedAmount - first.retainedAmount)[0] ?? null;

  return {
    copy: FINANCIAL_REPORT_COPY,
    metrics: [
      {
        id: "fiscal-reports",
        label: "Fiscal reports",
        value: formatNumber(reports.length),
        change: latestReport?.shortFiscalYearLabel ?? "No report data available",
        changeTone: "info",
      },
      {
        id: "total-payments",
        label: "Total payments",
        value: formatCurrency(totalPayments),
        change: `${formatCurrency(totalRefunds)} refunded`,
        changeTone: "success",
      },
      {
        id: "total-costing",
        label: "Total costing",
        value: formatCurrency(totalCosting),
        change: `${totalMarginRate}% retained margin`,
        changeTone: "warning",
      },
      {
        id: "retained-amount",
        label: "Retained amount",
        value: formatCurrency(totalRetained),
        change: strongestReport?.shortFiscalYearLabel ?? "No retained amount yet",
        changeTone: "danger",
      },
    ],
    reports,
    pagination: {
      currentPage: 1,
      lastPage: 1,
      total: reports.length,
      from: reports.length ? 1 : 0,
      to: reports.length,
      perPage: reports.length,
      hasPrev: false,
      hasNext: false,
    },
    summary: {
      totalPayments,
      totalPaymentsLabel: formatCurrency(totalPayments),
      totalRefunds,
      totalRefundsLabel: formatCurrency(totalRefunds),
      totalCosting,
      totalCostingLabel: formatCurrency(totalCosting),
      totalRetained,
      totalRetainedLabel: formatCurrency(totalRetained),
      totalMarginRate,
      totalMarginRateLabel: `${totalMarginRate}%`,
      latestReport,
      strongestReport,
    },
    charts: {
      fiscalTrend: reports.map((report) => ({
        id: report.id,
        label: shortenLabel(report.shortFiscalYearLabel, 12),
        payments: report.paymentAmount,
        retained: report.retainedAmount,
      })),
      financialComposition: reports.map((report) => ({
        id: report.id,
        label: shortenLabel(report.shortFiscalYearLabel, 18),
        refunds: report.refund,
        costing: report.costing,
        retained: Math.max(report.retainedAmount, 0),
      })),
      marginRanking: reports.map((report) => ({
        id: report.id,
        label: shortenLabel(report.shortFiscalYearLabel, 20),
        value: report.marginRate,
      })),
    },
  };
};

export const getFinancialReport = async ({ page = 1 } = {}) => {
  try {
    const response = await apiClient.get(API_URLS.reports.financialReport, {
      params: { page },
    });

    if (response.data) {
      return normalizeFinancialReport(response.data);
    }
  } catch {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 300);
    });
  }

  return normalizeFinancialReport(FINANCIAL_REPORT_FALLBACK_RESPONSE);
};
