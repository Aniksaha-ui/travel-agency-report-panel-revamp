import { API_URLS } from "../../../constants/apiUrls";
import apiClient from "../../../services/apiClient";
import {
  formatDateTime,
  formatShortDate,
  formatTravelDate,
  toDayjs,
} from "../../../utils/dateUtils";
import { MONITORING_COPY } from "../constants/monitoring.constants";

const toNumber = (value) => {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(
    toNumber(value),
  );

const formatDuration = (value) => `${toNumber(value).toFixed(2)} ms`;

const shortenText = (value, maxLength = 120) => {
  const normalizedValue = String(value ?? "");

  return normalizedValue.length > maxLength
    ? `${normalizedValue.slice(0, maxLength - 1)}...`
    : normalizedValue;
};

const getControllerLabel = (value) => {
  const normalizedValue = String(value ?? "").trim();

  if (!normalizedValue) {
    return "Unknown controller";
  }

  const segments = normalizedValue.split("\\");

  return segments[segments.length - 1] || normalizedValue;
};

const sortByDateAscending = (items, key) =>
  [...items].sort((first, second) => {
    const firstValue = toDayjs(first[key])?.valueOf() ?? 0;
    const secondValue = toDayjs(second[key])?.valueOf() ?? 0;

    return firstValue - secondValue;
  });

export const normalizeMonitoring = (payload) => {
  const source = payload?.data ?? {};
  const requestReport = (source.request_report ?? []).map((item) => {
    const totalQueries = toNumber(item.total_queries);
    const totalTimeMs = toNumber(item.total_time_ms);

    return {
      id: item.request_id,
      requestId: item.request_id,
      controller: item.controller ?? "",
      controllerLabel: getControllerLabel(item.controller),
      route: item.route ?? "Unknown route",
      method: item.method ?? "GET",
      url: item.url ?? "",
      totalQueries,
      totalQueriesLabel: formatNumber(totalQueries),
      totalTimeMs,
      totalTimeLabel: formatDuration(totalTimeMs),
      lastSeen: item.last_seen,
      lastSeenLabel: formatDateTime(item.last_seen),
    };
  });

  const routeReport = (source.route_report ?? []).map((item, index) => {
    const totalQueries = toNumber(item.total_queries);
    const averageTime = toNumber(item.avg_time);
    const maxTime = toNumber(item.max_time);

    return {
      id: `${item.route}-${index}`,
      route: item.route ?? "Unknown route",
      totalQueries,
      totalQueriesLabel: formatNumber(totalQueries),
      averageTime,
      averageTimeLabel: formatDuration(averageTime),
      maxTime,
      maxTimeLabel: formatDuration(maxTime),
      lastSeen: item.last_seen,
      lastSeenLabel: formatDateTime(item.last_seen),
    };
  });

  const controllerReport = (source.controller_report ?? []).map(
    (item, index) => {
      const totalQueries = toNumber(item.total_queries);
      const totalTime = toNumber(item.total_time);

      return {
        id: `${item.controller}-${index}`,
        controller: item.controller ?? "",
        controllerLabel: getControllerLabel(item.controller),
        totalQueries,
        totalQueriesLabel: formatNumber(totalQueries),
        totalTime,
        totalTimeLabel: formatDuration(totalTime),
        lastSeen: item.last_seen,
        lastSeenLabel: formatDateTime(item.last_seen),
      };
    },
  );

  const userReport = (source.user_report ?? []).map((item, index) => {
    const totalQueries = toNumber(item.total_queries);
    const totalTime = toNumber(item.total_time);

    return {
      id: `${item.user_id}-${index}`,
      userId: item.user_id,
      totalQueries,
      totalQueriesLabel: formatNumber(totalQueries),
      totalTime,
      totalTimeLabel: formatDuration(totalTime),
      lastSeen: item.last_seen,
      lastSeenLabel: formatDateTime(item.last_seen),
    };
  });

  const dailyReport = (source.daily_report ?? []).map((item, index) => {
    const totalQueries = toNumber(item.total_queries);
    const totalTime = toNumber(item.total_time);

    return {
      id: `${item.date}-${index}`,
      date: item.date,
      dateLabel: formatTravelDate(item.date),
      shortDateLabel: formatShortDate(item.date),
      totalQueries,
      totalQueriesLabel: formatNumber(totalQueries),
      totalTime,
      totalTimeLabel: formatDuration(totalTime),
    };
  });

  const latestLogs = (source.latest_logs ?? []).map((item) => {
    const timeMs = toNumber(item.time_ms);

    return {
      id: item.id,
      route: item.route ?? "Unknown route",
      method: item.method ?? "GET",
      controller: item.controller ?? "",
      controllerLabel: getControllerLabel(item.controller),
      sql: item.sql ?? "",
      shortenedSql: shortenText(item.sql, 180),
      bindings: item.bindings ?? "[]",
      timeMs,
      timeLabel: formatDuration(timeMs),
      url: item.url ?? "",
      userId: item.user_id,
      isSlow: Boolean(item.is_slow),
      createdAt: item.created_at,
      createdAtLabel: formatDateTime(item.created_at),
    };
  });

  const slowQueries = latestLogs.filter((item) => item.isSlow);
  const latestDay = dailyReport[0] ?? null;
  const latestRequest = requestReport[0] ?? null;
  const busiestRoute =
    [...routeReport].sort(
      (first, second) => second.totalQueries - first.totalQueries,
    )[0] ?? null;
  const slowestRoute =
    [...routeReport].sort(
      (first, second) => second.averageTime - first.averageTime,
    )[0] ?? null;
  const busiestController =
    [...controllerReport].sort(
      (first, second) => second.totalQueries - first.totalQueries,
    )[0] ?? null;
  const topUser =
    [...userReport].sort(
      (first, second) => second.totalQueries - first.totalQueries,
    )[0] ?? null;

  return {
    copy: MONITORING_COPY,
    metrics: [
      {
        id: "requests-tracked",
        label: "Requests tracked",
        value: formatNumber(requestReport.length),
        change: latestRequest?.route ?? "No request activity yet",
        changeTone: "info",
      },
      {
        id: "routes-monitored",
        label: "Routes monitored",
        value: formatNumber(routeReport.length),
        change: busiestRoute
          ? `${busiestRoute.totalQueriesLabel} queries on ${busiestRoute.route}`
          : "No route activity yet",
        changeTone: "success",
      },
      {
        id: "latest-day-queries",
        label: "Latest day queries",
        value: latestDay?.totalQueriesLabel ?? "0",
        change: latestDay
          ? `${latestDay.dateLabel} spent ${latestDay.totalTimeLabel}`
          : "No daily usage data yet",
        changeTone: "warning",
      },
      {
        id: "slow-query-count",
        label: "Slow queries",
        value: formatNumber(slowQueries.length),
        change: slowestRoute
          ? `${slowestRoute.route} peaks at ${slowestRoute.averageTimeLabel} avg`
          : "No slow route data yet",
        changeTone: "danger",
      },
    ],
    requestReport,
    routeReport,
    controllerReport,
    userReport,
    dailyReport,
    latestLogs,
    slowQueries,
    summary: {
      latestRequest,
      latestDay,
      busiestRoute,
      slowestRoute,
      busiestController,
      topUser,
      requestsTrackedLabel: formatNumber(requestReport.length),
      logsCapturedLabel: formatNumber(latestLogs.length),
      controllersTrackedLabel: formatNumber(controllerReport.length),
      usersTrackedLabel: formatNumber(userReport.length),
    },
    charts: {
      dailyTrend: sortByDateAscending(dailyReport, "date").map((item) => ({
        id: item.id,
        label: item.shortDateLabel,
        totalQueries: item.totalQueries,
      })),
      routeRanking: routeReport.slice(0, 8).map((item) => ({
        id: item.id,
        label: shortenText(item.route, 32),
        value: item.totalQueries,
      })),
      controllerRanking: controllerReport.slice(0, 8).map((item) => ({
        id: item.id,
        label: item.controllerLabel,
        value: item.totalQueries,
      })),
    },
  };
};

export const getMonitoring = async () => {
  try {
    const response = await apiClient.get(API_URLS.admin.monitoring, "");

    if (response.data?.data) {
      return normalizeMonitoring(response.data);
    }
  } catch (error) {
    const serverMessage = error.response?.data?.message;

    if (serverMessage) {
      throw new Error(serverMessage);
    }

    if (error instanceof Error) {
      throw error;
    }
  }

  throw new Error("Unable to load monitoring data right now.");
};
