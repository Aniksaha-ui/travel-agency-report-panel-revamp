import { API_URLS } from "../../../constants/apiUrls";
import apiClient from "../../../services/apiClient";
import { formatDateTime, formatTravelDate, toDayjs } from "../../../utils/dateUtils";
import { ACCOUNT_BALANCE_COPY } from "../constants/accountBalance.constants";

const toNumber = (value) => {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const normalizeString = (value, fallback = "") => String(value ?? "").trim() || fallback;
const normalizeTypeKey = (value) => normalizeString(value).toLowerCase().replace(/\s+/g, "_");

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(toNumber(value));

const formatCurrency = (value) => `BDT ${formatNumber(value)}`;
const shortenLabel = (value, maxLength = 18) =>
  String(value ?? "").length > maxLength ? `${String(value).slice(0, maxLength - 1)}...` : String(value ?? "");

const buildAccountDistribution = (accounts) => {
  const rankedAccounts = [...accounts].sort((first, second) => second.amount - first.amount);
  const primaryAccounts = rankedAccounts.slice(0, 5).map((account) => ({
    id: account.id,
    label: shortenLabel(account.accountName, 20),
    value: account.amount,
  }));
  const remainingBalance = rankedAccounts.slice(5).reduce((sum, account) => sum + account.amount, 0);

  if (remainingBalance > 0) {
    primaryAccounts.push({
      id: "others",
      label: "Others",
      value: remainingBalance,
      color: "#94a3b8",
    });
  }

  return primaryAccounts.filter((item) => item.value > 0);
};

const getTypeTone = (type) => {
  const normalizedType = normalizeTypeKey(type);

  if (normalizedType.includes("bank")) {
    return "info";
  }

  if (normalizedType.includes("cash")) {
    return "warning";
  }

  if (normalizedType.includes("card") || normalizedType.includes("gateway")) {
    return "success";
  }

  return "neutral";
};

const getRowsFromPayload = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.data?.data)) {
    return payload.data.data;
  }

  if (Array.isArray(payload?.accounts)) {
    return payload.accounts;
  }

  return [];
};

const normalizeAccount = (item, index) => {
  const accountName = normalizeString(item?.account_name, "Unknown account");
  const typeLabel = normalizeString(item?.type, "Unclassified");
  const amount = toNumber(item?.amount);

  return {
    id: item?.id ?? `${accountName}-${typeLabel}-${index}`,
    accountName,
    accountNumber: normalizeString(item?.account_number, "Not provided"),
    amount,
    amountLabel: formatCurrency(amount),
    type: typeLabel,
    typeLabel,
    typeTone: getTypeTone(typeLabel),
  };
};

export const normalizeAccountBalance = (payload) => {
  const accounts = getRowsFromPayload(payload).map(normalizeAccount);
  const totalBalance = accounts.reduce((sum, account) => sum + account.amount, 0);
  const topAccount = [...accounts].sort((first, second) => second.amount - first.amount)[0] ?? null;
  const typeGroups = accounts.reduce((accumulator, account) => {
    const key = normalizeTypeKey(account.type);
    const currentItem = accumulator.get(key) ?? {
      id: key || `type-${accumulator.size + 1}`,
      label: account.typeLabel,
      value: 0,
      color:
        account.typeTone === "info"
          ? "#38bdf8"
          : account.typeTone === "warning"
            ? "#f59e0b"
            : account.typeTone === "success"
              ? "#22c55e"
              : "#94a3b8",
    };

    currentItem.value += account.amount;
    accumulator.set(key, currentItem);

    return accumulator;
  }, new Map());
  const typeDistribution = [...typeGroups.values()].sort((first, second) => second.value - first.value);
  const uniqueTypeCount = typeDistribution.length;
  const fundedAccountCount = accounts.filter((account) => account.amount > 0).length;

  return {
    copy: ACCOUNT_BALANCE_COPY,
    metrics: [
      {
        id: "account-count",
        label: "Accounts tracked",
        value: formatNumber(accounts.length),
        change: `${formatNumber(uniqueTypeCount)} balance type${uniqueTypeCount === 1 ? "" : "s"}`,
        changeTone: "info",
      },
      {
        id: "balance-total",
        label: "Visible balance",
        value: formatCurrency(totalBalance),
        change: topAccount ? `${topAccount.accountName} leads the balance board` : "No accounts available",
        changeTone: "success",
      },
      {
        id: "top-balance",
        label: "Top account",
        value: topAccount?.amountLabel ?? "BDT 0",
        change: topAccount?.typeLabel ?? "Not available",
        changeTone: "warning",
      },
      {
        id: "channels",
        label: "Payment channels",
        value: formatNumber(uniqueTypeCount),
        change: `${formatNumber(fundedAccountCount)} funded account${fundedAccountCount === 1 ? "" : "s"}`,
        changeTone: "danger",
      },
    ],
    accounts,
    summary: {
      totalBalance,
      totalBalanceLabel: formatCurrency(totalBalance),
      accountCountLabel: formatNumber(accounts.length),
      uniqueTypeCountLabel: formatNumber(uniqueTypeCount),
      topAccount,
      typeDistribution,
    },
    charts: {
      accountDistribution: buildAccountDistribution(accounts),
      accountRanking: [...accounts]
        .sort((first, second) => second.amount - first.amount)
        .slice(0, 6)
        .map((account) => ({
          id: account.id,
          label: shortenLabel(account.accountName, 20),
          value: account.amount,
          meta: account.typeLabel,
        })),
      typeRanking: typeDistribution.slice(0, 6).map((item) => ({
        id: item.id,
        label: shortenLabel(item.label, 20),
        value: item.value,
      })),
      typeDistribution,
    },
  };
};

const normalizeHistoryRow = (item, index) => {
  const amount = toNumber(item?.amount);
  const transactionDate = item?.tran_date ?? item?.created_at ?? item?.updated_at ?? "";

  return {
    id: item?.id ?? `${item?.transaction_reference ?? item?.user_account_no ?? "history"}-${index}`,
    userAccountNo: normalizeString(item?.user_account_no, "Not provided"),
    gateway: normalizeString(item?.getaway ?? item?.gateway, "Not provided"),
    amount,
    amountLabel: formatCurrency(amount),
    transactionReference: normalizeString(item?.transaction_reference, "Not provided"),
    purpose: normalizeString(item?.purpose, "Not specified"),
    transactionDate,
    transactionDateLabel: formatDateTime(transactionDate, "Not available"),
    shortTransactionDateLabel: formatTravelDate(transactionDate, "Not available"),
  };
};

export const normalizeAccountBalanceHistory = (payload) => {
  const history = getRowsFromPayload(payload).map(normalizeHistoryRow);
  const totalAmount = history.reduce((sum, item) => sum + item.amount, 0);
  const latestEntry =
    [...history].sort((first, second) => {
      const firstValue = toDayjs(first.transactionDate)?.valueOf() ?? 0;
      const secondValue = toDayjs(second.transactionDate)?.valueOf() ?? 0;

      return secondValue - firstValue;
    })[0] ?? null;

  return {
    history,
    summary: {
      totalRowsLabel: formatNumber(history.length),
      totalAmountLabel: formatCurrency(totalAmount),
      latestTransactionLabel: latestEntry?.transactionDateLabel ?? "Not available",
    },
  };
};

export const getAccountBalance = async () => {
  try {
    const response = await apiClient.get(API_URLS.reports.accountBalance);

    if (response.data) {
      return normalizeAccountBalance(response.data);
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

  throw new Error("Unable to load account balance data right now.");
};

export const getAccountBalanceHistory = async (type) => {
  try {
    const response = await apiClient.get(API_URLS.reports.accountHistory(encodeURIComponent(type)));

    if (response.data) {
      return normalizeAccountBalanceHistory(response.data);
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
