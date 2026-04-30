import { API_URLS } from "../../../constants/apiUrls";
import apiClient from "../../../services/apiClient";
import {
  TRANSACTIONS_COPY,
  TRANSACTIONS_FALLBACK_RESPONSE,
} from "../constants/transactions.constants";

const toNumber = (value) => Number(value) || 0;

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(toNumber(value));

const formatCurrency = (value) => `BDT ${formatNumber(value)}`;

const formatLabel = (value) =>
  String(value ?? "Unknown")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const formatDateTime = (value) => {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(String(value).replace(" ", "T")));
};

const formatShortDateTime = (value) => {
  if (!value) {
    return "N/A";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(String(value).replace(" ", "T")));
};

const shortenLabel = (value, maxLength = 18) =>
  String(value ?? "").length > maxLength ? `${String(value).slice(0, maxLength - 1)}...` : String(value ?? "");

const countByKey = (items, key) =>
  items.reduce((accumulator, item) => {
    const value = item[key] ?? "Unknown";
    accumulator[value] = (accumulator[value] ?? 0) + 1;

    return accumulator;
  }, {});

export const normalizeTransactions = (payload) => {
  const source = payload?.data ?? {};
  const rows = source.data ?? [];
  const transactions = rows.map((item) => {
    const amount = toNumber(item.amount ?? item.customer_paid_amount ?? item.settled_amount ?? item.store_amount);
    const paymentMethod = formatLabel(item.payment_method);
    const settlementStatus = item.settlement_status ? formatLabel(item.settlement_status) : "Pending";
    const customerName = item.customer_name ?? item.cus_name ?? "Guest customer";
    const customerEmail = item.customer_email ?? item.cus_email ?? "";
    const bankTransactionId = item.bank_transaction_id ?? item.bank_tran_id ?? "Not available";

    return {
      id: item.id,
      paymentId: item.payment_id,
      transactionReference: item.transaction_reference ?? "Not available",
      shortReference: shortenLabel(item.transaction_reference, 18),
      valId: item.val_id,
      amount,
      amountLabel: formatCurrency(amount),
      paymentMethod,
      paymentMethodKey: String(item.payment_method ?? "unknown").toLowerCase(),
      settlementStatus,
      bankTransactionId,
      cardType: item.card_type ?? "Not available",
      cardBrand: item.card_brand ?? "Not available",
      riskTitle: item.risk_title ?? "No risk flag",
      customerName,
      customerEmail,
      createdAt: item.created_at,
      createdAtLabel: formatDateTime(item.created_at),
      createdAtShortLabel: formatShortDateTime(item.created_at),
      updatedAtLabel: formatDateTime(item.updated_at),
    };
  });

  const totalAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const averageAmount = transactions.length ? totalAmount / transactions.length : 0;
  const methodCounts = countByKey(transactions, "paymentMethod");
  const uniqueMethods = Object.keys(methodCounts).length;
  const pendingSettlements = transactions.filter(
    (transaction) => transaction.settlementStatus.toLowerCase() === "pending"
  ).length;
  const topTransaction =
    [...transactions].sort((first, second) => second.amount - first.amount)[0] ?? null;

  const amountTrend = [...transactions]
    .sort((first, second) => new Date(first.createdAt).getTime() - new Date(second.createdAt).getTime())
    .map((transaction) => ({
      id: transaction.id,
      label: transaction.createdAtShortLabel,
      amount: transaction.amount,
    }));

  return {
    copy: TRANSACTIONS_COPY,
    metrics: [
      {
        id: "total-transactions",
        label: "Transactions",
        value: formatNumber(source.total ?? transactions.length),
        change: `Showing ${formatNumber(transactions.length)} on this page`,
        changeTone: "info",
      },
      {
        id: "total-amount",
        label: "Total amount",
        value: formatCurrency(totalAmount),
        change: `${formatCurrency(averageAmount)} average visible payment`,
        changeTone: "success",
      },
      {
        id: "payment-methods",
        label: "Methods",
        value: formatNumber(uniqueMethods),
        change: Object.keys(methodCounts).join(", ") || "No payment methods yet",
        changeTone: "warning",
      },
      {
        id: "pending-settlements",
        label: "Pending settlements",
        value: formatNumber(pendingSettlements),
        change: topTransaction
          ? `${topTransaction.shortReference} is highest at ${topTransaction.amountLabel}`
          : "No settlement data yet",
        changeTone: "danger",
      },
    ],
    transactions,
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
    summary: {
      totalAmount,
      totalAmountLabel: formatCurrency(totalAmount),
      averageAmount,
      averageAmountLabel: formatCurrency(averageAmount),
      uniqueMethods,
      uniqueMethodsLabel: formatNumber(uniqueMethods),
      pendingSettlements,
      pendingSettlementsLabel: formatNumber(pendingSettlements),
      topTransaction,
    },
    charts: {
      amountTrend,
      methodMix: Object.entries(methodCounts).map(([label, value], index) => ({
        id: label,
        label,
        value,
        color: ["#38bdf8", "#22c55e", "#f59e0b", "#ef4444"][index % 4],
      })),
      amountRanking: transactions
        .map((transaction) => ({
          id: transaction.id,
          label: transaction.shortReference,
          value: transaction.amount,
        }))
        .sort((first, second) => second.value - first.value),
    },
  };
};

export const getTransactions = async ({ page = 1 } = {}) => {
  try {
    const response = await apiClient.post(API_URLS.reports.transactions, "", {
      params: { page },
    });

    if (response.data) {
      return normalizeTransactions(response.data);
    }
  } catch {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 300);
    });
  }

  return normalizeTransactions(TRANSACTIONS_FALLBACK_RESPONSE);
};
