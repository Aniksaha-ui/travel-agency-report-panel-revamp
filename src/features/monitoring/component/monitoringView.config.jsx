import Badge from "../../../components/common/Badge";
import CopyButton from "../../../components/common/CopyButton";

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Number(value) || 0);

const getMethodTone = (method) => {
  const normalizedMethod = String(method ?? "").toUpperCase();

  if (normalizedMethod === "GET") {
    return "info";
  }

  if (normalizedMethod === "POST") {
    return "success";
  }

  if (normalizedMethod === "PUT" || normalizedMethod === "PATCH") {
    return "warning";
  }

  if (normalizedMethod === "DELETE") {
    return "danger";
  }

  return "neutral";
};

const getLatencyTone = (value) => {
  const latency = Number(value) || 0;

  if (latency >= 10) {
    return "danger";
  }

  if (latency >= 5) {
    return "warning";
  }

  return "success";
};

export const monitoringRequestColumns = [
  {
    key: "route",
    header: "Request",
    render: (row) => (
      <div>
        <div className="fw-semibold">{row.route}</div>
        <div className="text-secondary small">{row.controllerLabel}</div>
      </div>
    ),
  },
  {
    key: "method",
    header: "Method",
    mobileLabel: "Method",
    render: (row) => <Badge color={getMethodTone(row.method)}>{row.method}</Badge>,
  },
  {
    key: "totalQueriesLabel",
    header: "Queries",
    mobileLabel: "Queries",
    cellClassName: "fw-semibold",
  },
  {
    key: "totalTimeLabel",
    header: "Duration",
    mobileLabel: "Duration",
    render: (row) => <Badge color={getLatencyTone(row.totalTimeMs)}>{row.totalTimeLabel}</Badge>,
  },
  {
    key: "lastSeenLabel",
    header: "Last Seen",
    mobileLabel: "Last Seen",
  },
];

export const monitoringRouteColumns = [
  {
    key: "route",
    header: "Route",
    render: (row) => (
      <div>
        <div className="fw-semibold">{row.route}</div>
        <div className="text-secondary small">Last seen {row.lastSeenLabel}</div>
      </div>
    ),
  },
  {
    key: "totalQueriesLabel",
    header: "Queries",
    mobileLabel: "Queries",
    cellClassName: "fw-semibold",
  },
  {
    key: "averageTimeLabel",
    header: "Avg Time",
    mobileLabel: "Avg Time",
    render: (row) => <Badge color={getLatencyTone(row.averageTime)}>{row.averageTimeLabel}</Badge>,
  },
  {
    key: "maxTimeLabel",
    header: "Max Time",
    mobileLabel: "Max Time",
  },
];

export const monitoringLogColumns = [
  {
    key: "route",
    header: "Log",
    render: (row) => (
      <div>
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <span className="fw-semibold">{row.route}</span>
          <Badge color={getMethodTone(row.method)}>{row.method}</Badge>
          {row.isSlow ? <Badge color="danger">Slow</Badge> : null}
        </div>
        <div className="text-secondary small">{row.controllerLabel}</div>
      </div>
    ),
  },
  {
    key: "shortenedSql",
    header: "SQL",
    render: (row) => (
      <div className="d-flex align-items-start gap-2">
        <span className="font-monospace small flex-grow-1">{row.shortenedSql}</span>
        <CopyButton
          copyTextValue={row.sql}
          title="Copy SQL query"
          copiedLabel="Query copied"
          successMessage="SQL query copied."
        />
      </div>
    ),
  },
  {
    key: "timeLabel",
    header: "Time",
    mobileLabel: "Time",
    render: (row) => <Badge color={getLatencyTone(row.timeMs)}>{row.timeLabel}</Badge>,
  },
  {
    key: "createdAtLabel",
    header: "Logged",
    mobileLabel: "Logged",
  },
];

export const monitoringDailyTrendSeries = [{ key: "totalQueries", label: "Queries", color: "#38bdf8" }];

export const monitoringNumberFormatter = (value) => formatNumber(value);
