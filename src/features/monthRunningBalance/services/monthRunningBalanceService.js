import { API_URLS } from "../../../constants/apiUrls";
import apiClient from "../../../services/apiClient";
import {
  MONTH_RUNNING_BALANCE_COPY,
  MONTH_RUNNING_BALANCE_FALLBACK_RESPONSE,
} from "../constants/monthRunningBalance.constants";

const toNumber = (value) => Number(value) || 0;

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(toNumber(value));

const formatCurrency = (value) => `BDT ${formatNumber(value)}`;
const shortenLabel = (value, maxLength = 14) =>
  String(value ?? "").length > maxLength ? `${String(value).slice(0, maxLength - 1)}...` : String(value ?? "");

export const normalizeMonthRunningBalance = (payload) => {
  const source = payload?.data ?? {};
  const months = (source.data ?? []).map((item, index) => {
    const totalCredit = toNumber(item.total_credit);
    const totalDebit = toNumber(item.total_debit);
    const openingBalance = toNumber(item.opening_balance);
    const closingBalance = toNumber(item.closing_balance);
    const txCount = toNumber(item.tx_count);
    const netMovement = totalCredit - totalDebit;
    const balanceGrowth = openingBalance ? Math.round((netMovement / openingBalance) * 100) : null;

    return {
      id: `${item.month}-${index}`,
      monthLabel: item.month || "Unknown month",
      txCount,
      totalCredit,
      totalDebit,
      openingBalance,
      closingBalance,
      netMovement,
      balanceGrowth,
      txCountLabel: formatNumber(txCount),
      totalCreditLabel: formatCurrency(totalCredit),
      totalDebitLabel: formatCurrency(totalDebit),
      openingBalanceLabel: formatCurrency(openingBalance),
      closingBalanceLabel: formatCurrency(closingBalance),
      netMovementLabel: formatCurrency(netMovement),
      balanceGrowthLabel: balanceGrowth === null ? "New baseline month" : `${balanceGrowth}% movement`,
    };
  });

  const totalCredit = months.reduce((sum, month) => sum + month.totalCredit, 0);
  const totalDebit = months.reduce((sum, month) => sum + month.totalDebit, 0);
  const totalTransactions = months.reduce((sum, month) => sum + month.txCount, 0);
  const netMovement = months.reduce((sum, month) => sum + month.netMovement, 0);
  const avgTransactionsPerMonth = months.length ? totalTransactions / months.length : 0;
  const latestMonth = months[months.length - 1] ?? null;
  const highestClosingMonth =
    [...months].sort((first, second) => second.closingBalance - first.closingBalance)[0] ?? null;
  const largestCreditMonth =
    [...months].sort((first, second) => second.totalCredit - first.totalCredit)[0] ?? null;

  return {
    copy: MONTH_RUNNING_BALANCE_COPY,
    metrics: [
      {
        id: "months-loaded",
        label: "Months loaded",
        value: formatNumber(source.total),
        change: `Page ${formatNumber(source.current_page)} of ${formatNumber(source.last_page)}`,
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
        change: `${formatCurrency(netMovement)} net movement`,
        changeTone: "warning",
      },
      {
        id: "closing-balance",
        label: "Latest closing balance",
        value: latestMonth?.closingBalanceLabel ?? "BDT 0",
        change: latestMonth?.monthLabel ?? "No month data available",
        changeTone: "danger",
      },
    ],
    months,
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
      totalCredit,
      totalDebit,
      totalTransactions,
      netMovement,
      avgTransactionsPerMonth,
      totalCreditLabel: formatCurrency(totalCredit),
      totalDebitLabel: formatCurrency(totalDebit),
      totalTransactionsLabel: formatNumber(totalTransactions),
      netMovementLabel: formatCurrency(netMovement),
      avgTransactionsPerMonthLabel: formatNumber(avgTransactionsPerMonth),
      latestMonth,
      highestClosingMonth,
      largestCreditMonth,
    },
    charts: {
      balanceTrend: months.map((month) => ({
        id: month.id,
        label: shortenLabel(month.monthLabel, 12),
        openingBalance: month.openingBalance,
        closingBalance: month.closingBalance,
      })),
      cashFlowComposition: months.map((month) => ({
        id: month.id,
        label: shortenLabel(month.monthLabel, 18),
        credit: month.totalCredit,
        debit: month.totalDebit,
        meta: `${month.netMovementLabel} net`,
      })),
      monthlyMovement: months.map((month) => ({
        id: month.id,
        label: shortenLabel(month.monthLabel, 20),
        value: month.netMovement,
      })),
    },
  };
};

export const getMonthRunningBalance = async ({ page = 1 } = {}) => {
  try {
    const response = await apiClient.get(API_URLS.reports.monthRunningBalance, {
      params: { page },
    });

    if (response.data) {
      return normalizeMonthRunningBalance(response.data);
    }
  } catch {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 300);
    });
  }

  return normalizeMonthRunningBalance(MONTH_RUNNING_BALANCE_FALLBACK_RESPONSE);
};
