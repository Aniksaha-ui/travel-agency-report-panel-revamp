import { API_URLS } from "../../../constants/apiUrls";
import apiClient from "../../../services/apiClient";
import { APP_CONFIG } from "../../../services/config";
import { formatTravelDate } from "../../../utils/dateUtils";
import {
  DAILY_BALANCE_COPY,
  DAILY_BALANCE_HISTORY_FALLBACK_RESPONSE,
  DAILY_BALANCE_FALLBACK_RESPONSE,
} from "../constants/dailyBalance.constants";

const toNumber = (value) => Number(value) || 0;

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(toNumber(value));

const formatCurrency = (value) => `BDT ${formatNumber(value)}`;
const shortenLabel = (value, maxLength = 14) =>
  String(value ?? "").length > maxLength ? `${String(value).slice(0, maxLength - 1)}...` : String(value ?? "");

const formatShortDate = (value) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));

const formatMonth = (value) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(parseDateKey(value));

const formatDateTime = (value) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(String(value ?? "").replace(" ", "T")));

const buildReportFileUrl = (filePath) => {
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

const toDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const parseDateKey = (value) => {
  const [year, month, day] = String(value ?? "")
    .split("-")
    .map((part) => Number(part));

  return Number.isFinite(year) && Number.isFinite(month) && Number.isFinite(day)
    ? new Date(year, month - 1, day)
    : new Date();
};

const getMonthDateKeys = (rows) => {
  const firstDate = rows.find((item) => item.date)?.date;
  const seedDate = firstDate ? parseDateKey(firstDate) : new Date();
  const year = seedDate.getFullYear();
  const month = seedDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return Array.from({ length: daysInMonth }, (_, index) =>
    toDateKey(new Date(year, month, index + 1))
  );
};

export const normalizeDailyBalance = (payload) => {
  const source = payload?.data ?? {};
  const rows = source.data ?? [];
  const rowsByDate = new Map(rows.map((item) => [item.date, item]));
  const days = getMonthDateKeys(rows).map((date, index) => {
    const item = rowsByDate.get(date) ?? {
      date,
      tx_count: 0,
      total_credit: 0,
      total_debit: 0,
      balance: 0,
    };
    const totalCredit = toNumber(item.total_credit);
    const totalDebit = toNumber(item.total_debit);
    const balance = toNumber(item.balance);
    const txCount = toNumber(item.tx_count);
    const netMovement = totalCredit - totalDebit;
    const debitShare = totalCredit ? Math.round((totalDebit / totalCredit) * 100) : 0;
    const hasApiData = rowsByDate.has(date);

    return {
      id: `${item.date}-${index}`,
      date: item.date,
      hasApiData,
      dateLabel: formatTravelDate(item.date),
      shortDateLabel: formatShortDate(item.date),
      txCount,
      totalCredit,
      totalDebit,
      balance,
      netMovement,
      debitShare,
      txCountLabel: formatNumber(txCount),
      totalCreditLabel: formatCurrency(totalCredit),
      totalDebitLabel: formatCurrency(totalDebit),
      balanceLabel: formatCurrency(balance),
      netMovementLabel: formatCurrency(netMovement),
      debitShareLabel: `${debitShare}% debit against credit`,
    };
  });

  const totalCredit = days.reduce((sum, day) => sum + day.totalCredit, 0);
  const totalDebit = days.reduce((sum, day) => sum + day.totalDebit, 0);
  const totalTransactions = days.reduce((sum, day) => sum + day.txCount, 0);
  const netMovement = days.reduce((sum, day) => sum + day.netMovement, 0);
  const latestDay = days[days.length - 1] ?? null;
  const highestBalanceDay = [...days].sort((first, second) => second.balance - first.balance)[0] ?? null;
  const highestCreditDay = [...days].sort((first, second) => second.totalCredit - first.totalCredit)[0] ?? null;
  const debitDays = days.filter((day) => day.totalDebit > 0).length;

  return {
    copy: DAILY_BALANCE_COPY,
    metrics: [
      {
        id: "days-loaded",
        label: "Days loaded",
        value: formatNumber(days.length),
        change: `${formatNumber(rows.length)} reported day${rows.length === 1 ? "" : "s"} from API`,
        changeTone: "info",
      },
      {
        id: "total-credit",
        label: "Total credit",
        value: formatCurrency(totalCredit),
        change: `${formatNumber(totalTransactions)} transactions visible`,
        changeTone: "success",
      },
      {
        id: "total-debit",
        label: "Total debit",
        value: formatCurrency(totalDebit),
        change: `${formatNumber(debitDays)} debit day${debitDays === 1 ? "" : "s"}`,
        changeTone: "warning",
      },
      {
        id: "latest-balance",
        label: "Latest balance",
        value: latestDay?.balanceLabel ?? "BDT 0",
        change: latestDay?.dateLabel ?? "No daily balance data",
        changeTone: "danger",
      },
    ],
    days,
    pagination: {
      currentPage: toNumber(source.current_page) || 1,
      lastPage: toNumber(source.last_page) || 1,
      total: days.length,
      from: days.length ? 1 : 0,
      to: days.length,
      perPage: toNumber(source.per_page),
      hasPrev: Boolean(source.prev_page_url),
      hasNext: Boolean(source.next_page_url),
    },
    summary: {
      totalCredit,
      totalCreditLabel: formatCurrency(totalCredit),
      totalDebit,
      totalDebitLabel: formatCurrency(totalDebit),
      totalTransactions,
      totalTransactionsLabel: formatNumber(totalTransactions),
      netMovement,
      netMovementLabel: formatCurrency(netMovement),
      debitDays,
      debitDaysLabel: formatNumber(debitDays),
      latestDay,
      highestBalanceDay,
      highestCreditDay,
    },
    charts: {
      balanceTrend: days.map((day) => ({
        id: day.id,
        label: shortenLabel(day.shortDateLabel, 10),
        balance: day.balance,
        netMovement: day.netMovement,
      })),
      cashFlowComposition: days.map((day) => ({
        id: day.id,
        label: shortenLabel(day.shortDateLabel, 12),
        credit: day.totalCredit,
        debit: day.totalDebit,
      })),
      cashFlowMix: [
        {
          id: "credit",
          label: "Credit",
          value: totalCredit,
          color: "#22c55e",
        },
        {
          id: "debit",
          label: "Debit",
          value: totalDebit,
          color: "#f59e0b",
        },
      ],
      transactionRanking: days.map((day) => ({
        id: day.id,
        label: shortenLabel(day.shortDateLabel, 20),
        value: day.txCount,
      })),
    },
  };
};

export const normalizeDailyBalanceHistory = (payload) => {
  const source = payload?.data ?? {};
  const reports = (source.data ?? []).map((item) => {
    const fileUrl = buildReportFileUrl(item.file_path);

    return {
      id: item.id,
      reportName: item.report_name ?? "Daily Balance Report",
      filePath: item.file_path ?? "",
      fileUrl,
      reportMonth: item.report_month,
      reportMonthLabel: formatMonth(item.report_month),
      createdAt: item.created_at,
      createdAtLabel: item.created_at ? formatDateTime(item.created_at) : "Not available",
      updatedAt: item.updated_at,
    };
  });

  return {
    reports,
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
  };
};

export const getDailyBalance = async ({ page = 1 } = {}) => {
  try {
    const response = await apiClient.get(API_URLS.reports.dailyBalance, {
      params: { page },
    });

    if (response.data) {
      return normalizeDailyBalance(response.data);
    }
  } catch {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 300);
    });
  }

  return normalizeDailyBalance(DAILY_BALANCE_FALLBACK_RESPONSE);
};

export const getDailyBalanceHistory = async ({ page = 1 } = {}) => {
  try {
    const response = await apiClient.get(API_URLS.reports.dailyBalanceHistory, {
      params: { page },
    });

    if (response.data) {
      return normalizeDailyBalanceHistory(response.data);
    }
  } catch {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 300);
    });
  }

  return normalizeDailyBalanceHistory(DAILY_BALANCE_HISTORY_FALLBACK_RESPONSE);
};
