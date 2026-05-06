import { API_URLS } from "../../../constants/apiUrls";
import apiClient from "../../../services/apiClient";
import { formatMonthLabel } from "../../../utils/dateUtils";
import { USER_GROWTH_REPORT_COPY } from "../constants/userGrowthReport.constants";

const toNumber = (value) => Number(value) || 0;

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(toNumber(value));

export const normalizeUserGrowthReport = (payload) => {
  const source = payload?.data ?? {};
  const rows = source.data ?? payload?.data ?? payload ?? [];
  const growthRows = rows.map((item, index) => {
    const newUsers = toNumber(item.new_users);
    const previousMonthUsers = index > 0 ? toNumber(rows[index - 1]?.new_users) : 0;
    const growth = index > 0 ? newUsers - previousMonthUsers : 0;

    return {
      id: `${item.month}-${index}`,
      month: item.month,
      monthLabel: formatMonthLabel(item.month),
      newUsers,
      newUsersLabel: formatNumber(newUsers),
      growth,
      growthDirection: growth > 0 ? "up" : growth < 0 ? "down" : "flat",
      growthLabel: `${growth >= 0 ? "+" : ""}${formatNumber(growth)}`,
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
      {
        id: "latest-shift",
        label: "Latest shift",
        value: growthRows[growthRows.length - 1]?.growthLabel ?? "0",
        change: growthRows[growthRows.length - 1]
          ? `${growthRows[growthRows.length - 1].monthLabel} vs previous month`
          : "No month-over-month trend yet",
        changeTone:
          growthRows[growthRows.length - 1]?.growthDirection === "down" ? "danger" : "info",
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
      growthDelta: growthRows.map((row) => ({
        id: `${row.id}-delta`,
        label: row.monthLabel,
        value: row.growth,
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

  throw new Error("Unable to load user growth report right now.");
};
