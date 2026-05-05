import { API_URLS } from "../../../constants/apiUrls";
import apiClient from "../../../services/apiClient";
import { formatMonthLabel } from "../../../utils/dateUtils";
import {
  USER_GROWTH_REPORT_COPY,
  USER_GROWTH_REPORT_FALLBACK_RESPONSE,
} from "../constants/userGrowthReport.constants";

const toNumber = (value) => Number(value) || 0;

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(toNumber(value));

export const normalizeUserGrowthReport = (payload) => {
  const source = payload?.data ?? {};
  const rows = source.data ?? payload?.data ?? payload ?? [];
  const growthRows = rows.map((item, index) => {
    const newUsers = toNumber(item.new_users);

    return {
      id: `${item.month}-${index}`,
      month: item.month,
      monthLabel: formatMonthLabel(item.month),
      newUsers,
      newUsersLabel: formatNumber(newUsers),
    };
  });

  const totalNewUsers = growthRows.reduce((sum, row) => sum + row.newUsers, 0);
  const highestMonth = [...growthRows].sort((first, second) => second.newUsers - first.newUsers)[0] ?? null;
  const averagePerMonth = growthRows.length ? Math.round(totalNewUsers / growthRows.length) : 0;

  return {
    copy: USER_GROWTH_REPORT_COPY,
    metrics: [
      {
        id: "tracked-months",
        label: "Tracked months",
        value: formatNumber(growthRows.length),
        change: `${formatNumber(totalNewUsers)} new users total`,
        changeTone: "info",
      },
      {
        id: "new-users",
        label: "New users",
        value: formatNumber(totalNewUsers),
        change: `${formatNumber(averagePerMonth)} average per month`,
        changeTone: "success",
      },
      {
        id: "top-month",
        label: "Top month",
        value: highestMonth?.monthLabel ?? "No data",
        change: highestMonth ? `${highestMonth.newUsersLabel} users added` : "No monthly growth data",
        changeTone: "warning",
      },
    ],
    growthRows,
    pagination: {
      currentPage: toNumber(source.current_page) || 1,
      lastPage: toNumber(source.last_page) || 1,
      total: toNumber(source.total) || growthRows.length,
      from: toNumber(source.from) || (growthRows.length ? 1 : 0),
      to: toNumber(source.to) || growthRows.length,
      perPage: toNumber(source.per_page),
      hasPrev: Boolean(source.prev_page_url),
      hasNext: Boolean(source.next_page_url),
    },
    summary: {
      totalNewUsersLabel: formatNumber(totalNewUsers),
      averagePerMonthLabel: formatNumber(averagePerMonth),
      highestMonth,
    },
    charts: {
      monthlyGrowth: growthRows.map((row) => ({
        id: row.id,
        label: row.monthLabel,
        value: row.newUsers,
      })),
    },
  };
};

export const getUserGrowthReport = async () => {
  try {
    const response = await apiClient.get(API_URLS.reports.userGrowthReport);

    if (response.data) {
      return normalizeUserGrowthReport(response.data);
    }
  } catch {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 300);
    });
  }

  return normalizeUserGrowthReport(USER_GROWTH_REPORT_FALLBACK_RESPONSE);
};
