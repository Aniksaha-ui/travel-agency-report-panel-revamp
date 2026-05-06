import { API_URLS } from "../../../constants/apiUrls";
import apiClient from "../../../services/apiClient";
import { formatDateTime, formatTravelDate, toDateKey, toDayjs } from "../../../utils/dateUtils";
import { buildUrlWithQuery } from "../../../utils/urlUtils";
import { ACCOUNT_HISTORY_COPY } from "../constants/accountHistory.constants";

const toNumber = (value) => {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const normalizeString = (value, fallback = "") => String(value ?? "").trim() || fallback;
const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(toNumber(value));
const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(toNumber(value));
const shortenLabel = (value, maxLength = 16) =>
  String(value ?? "").length > maxLength ? `${String(value).slice(0, maxLength - 1)}...` : String(value ?? "");

const getTransactionTone = (value) => (String(value ?? "").trim().toLowerCase() === "c" ? "success" : "danger");
const getTransactionLabel = (value) => (String(value ?? "").trim().toLowerCase() === "c" ? "Credit" : "Debit");

const getSource = (payload) => payload?.data?.data ?? payload?.data ?? payload ?? {};

const normalizeHistoryRow = (item, index) => {
  const amount = toNumber(item?.amount);
  const transactionType = normalizeString(item?.transaction_type, "d");
  const gateway = normalizeString(item?.getaway ?? item?.gateway, "Unknown gateway");
  const transactionDate = item?.tran_date ?? item?.created_at ?? "";

  return {
    id: item?.id ?? `${item?.transaction_reference ?? gateway}-${index}`,
    transactionDate,
    transactionDateLabel: formatDateTime(transactionDate, "Not available"),
    shortDateLabel: formatTravelDate(transactionDate, "Not available"),
    purpose: normalizeString(item?.purpose, "Not specified"),
    gateway,
    userAccountNo: normalizeString(item?.user_account_no, "Not provided"),
    companyAccountNo: normalizeString(item?.com_account_no, "Not provided"),
    transactionReference: normalizeString(item?.transaction_reference, "Not provided"),
    amount,
    amountLabel: formatCurrency(amount),
    transactionType,
    transactionTypeLabel: getTransactionLabel(transactionType),
    transactionTone: getTransactionTone(transactionType),
    signedAmount: getTransactionLabel(transactionType) === "Credit" ? amount : -amount,
  };
};

const buildDailyTrend = (rows) => {
  const grouped = rows.reduce((accumulator, row) => {
    const dateKey = toDateKey(row.transactionDate);

    if (!dateKey) {
      return accumulator;
    }

    const currentItem = accumulator.get(dateKey) ?? {
      id: dateKey,
      label: row.shortDateLabel,
      credit: 0,
      debit: 0,
    };

    if (row.transactionTypeLabel === "Credit") {
      currentItem.credit += row.amount;
    } else {
      currentItem.debit += row.amount;
    }

    accumulator.set(dateKey, currentItem);

    return accumulator;
  }, new Map());

  return [...grouped.values()]
    .sort((first, second) => {
      const firstValue = toDayjs(first.id)?.valueOf() ?? 0;
      const secondValue = toDayjs(second.id)?.valueOf() ?? 0;

      return firstValue - secondValue;
    })
    .map((item) => ({
      ...item,
      net: item.credit - item.debit,
    }));
};

const buildGatewayMix = (rows) => {
  const gatewayMap = rows.reduce((accumulator, row) => {
    const currentItem = accumulator.get(row.gateway) ?? {
      id: row.gateway,
      label: row.gateway,
      value: 0,
    };

    currentItem.value += row.amount;
    accumulator.set(row.gateway, currentItem);

    return accumulator;
  }, new Map());

  return [...gatewayMap.values()]
    .sort((first, second) => second.value - first.value)
    .slice(0, 6);
};

const buildPurposeRanking = (rows) => {
  const purposeMap = rows.reduce((accumulator, row) => {
    const key = row.purpose;
    const currentItem = accumulator.get(key) ?? {
      id: key,
      label: shortenLabel(key, 20),
      value: 0,
    };

    currentItem.value += row.amount;
    accumulator.set(key, currentItem);

    return accumulator;
  }, new Map());

  return [...purposeMap.values()]
    .sort((first, second) => second.value - first.value)
    .slice(0, 6);
};

export const normalizeAccountHistory = (payload) => {
  const source = getSource(payload);
  const paginationSource = source.accountHistoryList ?? source.list ?? source;
  const rows = (paginationSource.data ?? []).map(normalizeHistoryRow);
  const totalAmount = toNumber(source.accountHistorySummary ?? source.summary ?? source.total_amount);
  const creditRows = rows.filter((row) => row.transactionTypeLabel === "Credit");
  const debitRows = rows.filter((row) => row.transactionTypeLabel === "Debit");
  const creditedAmount = creditRows.reduce((sum, row) => sum + row.amount, 0);
  const debitedAmount = debitRows.reduce((sum, row) => sum + row.amount, 0);
  const latestTransaction =
    [...rows].sort((first, second) => {
      const firstValue = toDayjs(first.transactionDate)?.valueOf() ?? 0;
      const secondValue = toDayjs(second.transactionDate)?.valueOf() ?? 0;

      return secondValue - firstValue;
    })[0] ?? null;

  return {
    copy: ACCOUNT_HISTORY_COPY,
    metrics: [
      {
        id: "history-total",
        label: "Transactions loaded",
        value: formatNumber(paginationSource.total ?? rows.length),
        change: `Page ${formatNumber(paginationSource.current_page ?? 1)} of ${formatNumber(
          paginationSource.last_page ?? 1,
        )}`,
        changeTone: "info",
      },
      {
        id: "history-credit",
        label: "Credited amount",
        value: formatCurrency(totalAmount || creditedAmount),
        change: `${formatNumber(creditRows.length)} credit row${creditRows.length === 1 ? "" : "s"}`,
        changeTone: "success",
      },
      {
        id: "history-debit",
        label: "Debited amount",
        value: formatCurrency(debitedAmount),
        change: `${formatNumber(debitRows.length)} debit row${debitRows.length === 1 ? "" : "s"}`,
        changeTone: "warning",
      },
      {
        id: "history-latest",
        label: "Latest transaction",
        value: latestTransaction?.amountLabel ?? "BDT 0.00",
        change: latestTransaction?.shortDateLabel ?? "No transaction available",
        changeTone: "danger",
      },
    ],
    rows,
    pagination: {
      currentPage: toNumber(paginationSource.current_page) || 1,
      lastPage: toNumber(paginationSource.last_page) || 1,
      total: toNumber(paginationSource.total) || rows.length,
      from: toNumber(paginationSource.from),
      to: toNumber(paginationSource.to),
      perPage: toNumber(paginationSource.per_page),
      hasPrev: Boolean(paginationSource.prev_page_url),
      hasNext: Boolean(paginationSource.next_page_url),
    },
    summary: {
      totalAmountLabel: formatCurrency(totalAmount || creditedAmount),
      creditedAmountLabel: formatCurrency(creditedAmount),
      debitedAmountLabel: formatCurrency(debitedAmount),
      creditCountLabel: formatNumber(creditRows.length),
      debitCountLabel: formatNumber(debitRows.length),
      latestTransaction,
    },
    charts: {
      dailyTrend: buildDailyTrend(rows),
      gatewayMix: buildGatewayMix(rows),
      purposeRanking: buildPurposeRanking(rows),
    },
  };
};

export const getAccountHistory = async ({ page = 1, startDate, endDate }) => {
  try {
    const response = await apiClient.post(
      buildUrlWithQuery(API_URLS.reports.accountHistorySearch, { page }),
      {
        start_date: startDate,
        end_date: endDate,
      },
    );

    if (response.data) {
      return normalizeAccountHistory(response.data);
    }
  } catch (error) {
    const serverMessage =
      error.response?.data?.message ?? error.response?.data?.data?.message;

    if (serverMessage) {
      throw new Error(serverMessage);
    }

    if (error instanceof Error) {
      throw error;
    }
  }

  throw new Error("Unable to load account history right now.");
};
