import Badge from "../../../components/common/Badge";
import CopyButton from "../../../components/common/CopyButton";
import RechartsAreaChart from "../../../components/charts/RechartsAreaChart";
import Button from "../../../components/common/Button";
import {
  monitoringDailyTrendSeries,
  monitoringNumberFormatter,
} from "./monitoringView.config";

export default function MonitoringMobileView({
  boardDate,
  charts,
  copy,
  error,
  latestLogs,
  metrics,
  requestReport,
  routeReport,
  summary,
}) {
  return (
    <div className="d-md-none trip-performance-mobile">
      <div className="container-xl">
        <div className="trip-performance-mobile__screen">
          <section className="trip-performance-mobile__hero">
            <div className="trip-performance-mobile__hero-top">
              <div>
                <div className="trip-performance-mobile__eyebrow">/admin/monitoring</div>
                <h2 className="trip-performance-mobile__title">{copy.pageTitle}</h2>
                <p className="trip-performance-mobile__subtitle">{copy.pageSubtitle}</p>
              </div>
              <span className="trip-performance-mobile__date">{boardDate}</span>
            </div>

            <div className="trip-performance-mobile__spotlight">
              <div>
                <div className="trip-performance-mobile__spotlight-label">Busiest route</div>
                <div className="trip-performance-mobile__spotlight-value">
                  {summary.busiestRoute?.totalQueriesLabel ?? "0"} queries
                </div>
                <div className="trip-performance-mobile__spotlight-meta">
                  {summary.busiestRoute?.route ?? "No route activity available"}
                </div>
              </div>
              <div className="trip-performance-mobile__spotlight-stack">
                <span>{summary.logsCapturedLabel ?? "0"} logs</span>
                <span>{summary.controllersTrackedLabel ?? "0"} controllers</span>
              </div>
            </div>

            <div className="monitoring-mobile-ribbon">
              <span className="monitoring-mobile-ribbon__item">Live feed</span>
              <span className="monitoring-mobile-ribbon__item">Controller pressure</span>
              <span className="monitoring-mobile-ribbon__item">SQL watch</span>
            </div>

            <div className="trip-performance-mobile__metric-grid">
              {metrics.map((metric) => (
                <article key={metric.id} className="trip-performance-mobile__metric">
                  <div className="trip-performance-mobile__metric-label">{metric.label}</div>
                  <div className="trip-performance-mobile__metric-value">{metric.value}</div>
                  <div className="trip-performance-mobile__metric-meta">{metric.change}</div>
                </article>
              ))}
            </div>
          </section>

          {error ? (
            <section className="trip-performance-mobile__card">
              <div className="text-danger">{error.message || "Unable to load monitoring data."}</div>
            </section>
          ) : null}

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Daily query trend</div>
                <div className="trip-performance-mobile__card-subtle">
                  Query volume recorded by day
                </div>
              </div>
            </div>

            <RechartsAreaChart
              data={charts.dailyTrend ?? []}
              series={monitoringDailyTrendSeries}
              height={220}
              labelKey="label"
              valueFormatter={monitoringNumberFormatter}
            />
          </section>

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Recent requests</div>
                <div className="trip-performance-mobile__card-subtle">
                  Latest grouped admin requests
                </div>
              </div>
              <div className="trip-performance-mobile__pill">{requestReport.length}</div>
            </div>

            <div className="trip-performance-mobile__list">
              {requestReport.length ? (
                requestReport.slice(0, 8).map((request) => (
                  <article key={request.id} className="trip-performance-mobile__item">
                    <div className="trip-performance-mobile__item-top">
                      <div>
                        <div className="trip-performance-mobile__item-title">{request.route}</div>
                        <div className="trip-performance-mobile__item-meta">{request.controllerLabel}</div>
                      </div>
                      <Badge color="info">{request.method}</Badge>
                    </div>

                    <div className="trip-performance-mobile__item-grid">
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{request.totalQueriesLabel}</div>
                        <div className="trip-performance-mobile__item-grid-label">Queries</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{request.totalTimeLabel}</div>
                        <div className="trip-performance-mobile__item-grid-label">Duration</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{request.lastSeenLabel}</div>
                        <div className="trip-performance-mobile__item-grid-label">Last seen</div>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="trip-performance-mobile__empty">No request activity captured yet.</div>
              )}
            </div>
          </section>

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Route report</div>
                <div className="trip-performance-mobile__card-subtle">
                  Route query counts and timing
                </div>
              </div>
            </div>

            <div className="trip-performance-mobile__list">
              {routeReport.length ? (
                routeReport.slice(0, 8).map((route) => (
                  <article key={route.id} className="trip-performance-mobile__item">
                    <div className="trip-performance-mobile__item-top">
                      <div>
                        <div className="trip-performance-mobile__item-title">{route.route}</div>
                        <div className="trip-performance-mobile__item-meta">{route.lastSeenLabel}</div>
                      </div>
                      <div className="trip-performance-mobile__item-profit">{route.totalQueriesLabel}</div>
                    </div>

                    <div className="trip-performance-mobile__item-grid">
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{route.averageTimeLabel}</div>
                        <div className="trip-performance-mobile__item-grid-label">Avg time</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{route.maxTimeLabel}</div>
                        <div className="trip-performance-mobile__item-grid-label">Max time</div>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="trip-performance-mobile__empty">No route monitoring rows available.</div>
              )}
            </div>
          </section>

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Latest SQL logs</div>
                <div className="trip-performance-mobile__card-subtle">
                  Most recent captured backend queries
                </div>
              </div>
            </div>

            <div className="trip-performance-mobile__list">
              {latestLogs.length ? (
                latestLogs.slice(0, 8).map((log) => (
                  <article key={log.id} className="trip-performance-mobile__item">
                    <div className="trip-performance-mobile__item-top">
                      <div>
                        <div className="trip-performance-mobile__item-title">{log.route}</div>
                        <div className="trip-performance-mobile__item-meta">{log.createdAtLabel}</div>
                      </div>
                      <Badge color={log.isSlow ? "danger" : "success"}>{log.timeLabel}</Badge>
                    </div>

                    <div className="d-flex align-items-start gap-2 mt-2">
                      <div className="font-monospace small text-secondary flex-grow-1">
                        {log.shortenedSql}
                      </div>
                      <CopyButton
                        copyTextValue={log.sql}
                        title="Copy SQL query"
                        copiedLabel="Query copied"
                        successMessage="SQL query copied."
                      />
                    </div>
                  </article>
                ))
              ) : (
                <div className="trip-performance-mobile__empty">No SQL logs captured yet.</div>
              )}
            </div>

            {summary.latestRequest?.url ? (
              <div className="mt-3">
                <Button variant="outline" fullWidthOnMobile disabled>
                  Latest URL: {summary.latestRequest.url}
                </Button>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
}
