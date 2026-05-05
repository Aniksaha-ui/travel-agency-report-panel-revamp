import RechartsAreaChart from "../../../components/charts/RechartsAreaChart";
import RechartsRankingChart from "../../../components/charts/RechartsRankingChart";
import Badge from "../../../components/common/Badge";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import MetricsOverview from "../../dashboard/components/MetricsOverview";
import {
  monitoringDailyTrendSeries,
  monitoringLogColumns,
  monitoringNumberFormatter,
  monitoringRequestColumns,
  monitoringRouteColumns,
} from "./monitoringView.config";

export default function MonitoringDesktopView({
  boardDate,
  charts,
  copy,
  error,
  isLoading,
  latestLogs,
  metrics,
  requestReport,
  routeReport,
  summary,
}) {
  return (
    <div className="d-none d-md-block">
      <div className="page-header d-print-none trip-performance-page-header">
        <div className="container-xl">
          <div className="trip-performance-hero monitoring-hero">
            <div className="trip-performance-hero__copy">
              <span className="trip-performance-hero__eyebrow">
                /admin/monitoring
              </span>
              <h2 className="page-title">{copy.pageTitle}</h2>
              <p className="text-secondary mb-0">{copy.pageSubtitle}</p>
              <div className="monitoring-hero__signals">
                <span className="monitoring-hero__signal monitoring-hero__signal--live">
                  Live feed
                </span>
                <span className="monitoring-hero__signal">
                  Route intelligence
                </span>
                <span className="monitoring-hero__signal">SQL visibility</span>
              </div>
            </div>

            <div className="trip-performance-hero__meta">
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">
                  Requests
                </span>
                <strong>{summary.requestsTrackedLabel ?? "0"}</strong>
              </div>
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Logs</span>
                <strong>{summary.logsCapturedLabel ?? "0"}</strong>
              </div>
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">
                  Board date
                </span>
                <strong>{boardDate}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          <section className="dashboard-section">
            <MetricsOverview metrics={metrics} />
          </section>

          {error ? (
            <section className="dashboard-section">
              <Card
                title="Monitoring unavailable"
                className="trip-performance-card border-0"
              >
                <div className="text-danger">
                  {error.message || "Unable to load monitoring data."}
                </div>
              </Card>
            </section>
          ) : null}

          <section className="dashboard-section">
            <div className="row g-3">
              <div className="col-12">
                <div className="monitoring-command-grid">
                  <article className="monitoring-command-card monitoring-command-card--primary">
                    <div className="monitoring-command-card__eyebrow">
                      Latest request pulse
                    </div>
                    <div className="monitoring-command-card__title">
                      {summary.latestRequest?.route ?? "No live request pulse"}
                    </div>
                    <div className="monitoring-command-card__value">
                      {summary.latestRequest?.totalTimeLabel ?? "0.00 ms"}
                    </div>
                    <div className="monitoring-command-card__meta">
                      {summary.latestRequest
                        ? `${summary.latestRequest.controllerLabel} • ${summary.latestRequest.lastSeenLabel}`
                        : "Waiting for monitored admin traffic"}
                    </div>
                  </article>

                  <article className="monitoring-command-card monitoring-command-card--secondary">
                    <div className="monitoring-command-card__eyebrow">
                      Controller leader
                    </div>
                    <div className="monitoring-command-card__title">
                      {summary.busiestController?.controllerLabel ??
                        "No controller pressure"}
                    </div>
                    <div className="monitoring-command-card__value">
                      {summary.busiestController?.totalQueriesLabel ?? "0"}{" "}
                      queries
                    </div>
                    <div className="monitoring-command-card__meta">
                      {summary.topUser
                        ? `User #${summary.topUser.userId} leads with ${summary.topUser.totalQueriesLabel} queries`
                        : "No user pressure data available"}
                    </div>
                  </article>

                  <article className="monitoring-command-card monitoring-command-card--neutral">
                    <div className="monitoring-command-card__eyebrow">
                      Observed route stack
                    </div>
                    <div className="monitoring-command-card__list">
                      {(routeReport ?? []).slice(0, 3).map((route) => (
                        <div
                          key={route.id}
                          className="monitoring-command-card__list-item"
                        >
                          <span>{route.route}</span>
                          <Badge color="info">{route.totalQueriesLabel}</Badge>
                        </div>
                      ))}
                    </div>
                  </article>
                </div>
              </div>

              <div className="col-12 col-xl-5">
                <Card
                  title="Daily query trend"
                  subtitle="Query volume captured by day from the monitoring feed."
                  className="trip-performance-card border-0 h-100 monitoring-panel-card"
                >
                  <RechartsAreaChart
                    data={charts.dailyTrend ?? []}
                    series={monitoringDailyTrendSeries}
                    labelKey="label"
                    height={300}
                    valueFormatter={monitoringNumberFormatter}
                  />
                </Card>
              </div>

              <div className="col-12 col-xl-7">
                <div className="row g-3 h-100">
                  <div className="col-12 col-lg-6">
                    <Card
                      title="Route query ranking"
                      subtitle="Routes with the highest captured query counts."
                      className="trip-performance-card border-0 h-100 monitoring-panel-card monitoring-panel-card--green"
                    >
                      <RechartsRankingChart
                        items={charts.routeRanking ?? []}
                        height={300}
                        tooltipLabel="Queries"
                        valueFormatter={monitoringNumberFormatter}
                        getCellColor={() => "#22c55e"}
                        yAxisWidth={150}
                        chartMargin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                      />
                    </Card>
                  </div>
                  <div className="col-12 col-lg-6">
                    <Card
                      title="Controller query ranking"
                      subtitle="Controllers responsible for the most queries."
                      className="trip-performance-card border-0 h-100 monitoring-panel-card monitoring-panel-card--blue"
                    >
                      <RechartsRankingChart
                        items={charts.controllerRanking ?? []}
                        height={300}
                        tooltipLabel="Queries"
                        valueFormatter={monitoringNumberFormatter}
                        getCellColor={() => "#38bdf8"}
                        yAxisWidth={240}
                        tickFontSize={10}
                        chartMargin={{ top: 5, right: 8, left: 4, bottom: 5 }}
                      />
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <div className="row g-3">
              <div className="col-12 col-xl-6">
                <Card
                  title="Route spotlight"
                  subtitle="Fast scan of the busiest and slowest monitored routes."
                  className="trip-performance-card border-0 h-100 monitoring-panel-card"
                >
                  <div className="trip-performance-highlight">
                    <div className="trip-performance-highlight__title">
                      {summary.busiestRoute?.route ??
                        "No active routes captured"}
                    </div>
                    <div className="trip-performance-highlight__value">
                      {summary.busiestRoute?.totalQueriesLabel ?? "0"} queries
                    </div>
                    <div className="trip-performance-highlight__meta">
                      {summary.slowestRoute
                        ? `${summary.slowestRoute.route} averages ${summary.slowestRoute.averageTimeLabel}`
                        : "No route timing data available"}
                    </div>
                  </div>

                  <div className="trip-performance-summary-grid">
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">
                        Controllers
                      </span>
                      <strong>{summary.controllersTrackedLabel ?? "0"}</strong>
                    </div>
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">
                        Users tracked
                      </span>
                      <strong>{summary.usersTrackedLabel ?? "0"}</strong>
                    </div>
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">
                        Top controller
                      </span>
                      <strong>
                        {summary.busiestController?.controllerLabel ??
                          "Not available"}
                      </strong>
                    </div>
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">
                        Top user
                      </span>
                      <strong>
                        {summary.topUser
                          ? `#${summary.topUser.userId}`
                          : "Not available"}
                      </strong>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="col-12 col-xl-6">
                <Card
                  title="Latest request snapshot"
                  subtitle="Most recently seen request group from the monitoring feed."
                  className="trip-performance-card border-0 h-100 monitoring-panel-card"
                >
                  <div className="trip-performance-highlight">
                    <div className="trip-performance-highlight__title">
                      {summary.latestRequest?.route ??
                        "No recent request captured"}
                    </div>
                    <div className="trip-performance-highlight__value">
                      {summary.latestRequest?.totalTimeLabel ?? "0.00 ms"}
                    </div>
                    <div className="trip-performance-highlight__meta">
                      {summary.latestRequest
                        ? `${summary.latestRequest.controllerLabel} • ${summary.latestRequest.lastSeenLabel}`
                        : "No request timing data available"}
                    </div>
                  </div>

                  <div className="trip-performance-summary-grid">
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">
                        Method
                      </span>
                      <strong>{summary.latestRequest?.method ?? "N/A"}</strong>
                    </div>
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">
                        Queries
                      </span>
                      <strong>
                        {summary.latestRequest?.totalQueriesLabel ?? "0"}
                      </strong>
                    </div>
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">
                        Latest day
                      </span>
                      <strong>
                        {summary.latestDay?.dateLabel ?? "Not available"}
                      </strong>
                    </div>
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">
                        Day load
                      </span>
                      <strong>
                        {summary.latestDay?.totalQueriesLabel ?? "0"} queries
                      </strong>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <Card
              title="Recent request report"
              subtitle="Latest grouped request executions captured by the monitoring endpoint."
              className="trip-performance-card border-0 monitoring-table-card"
              bodyClassName="p-0"
            >
              {isLoading && !requestReport.length ? (
                <div className="p-4 text-center text-secondary">
                  Loading monitoring request activity...
                </div>
              ) : (
                <Table
                  columns={monitoringRequestColumns}
                  data={requestReport}
                  emptyTitle="No request report"
                  emptyDescription="The monitoring endpoint did not return any recent request groups."
                />
              )}
            </Card>
          </section>

          <section className="dashboard-section">
            <Card
              title="Route report"
              subtitle="Aggregated route timing and query volume from the monitoring feed."
              className="trip-performance-card border-0 monitoring-table-card"
              bodyClassName="p-0"
            >
              <Table
                columns={monitoringRouteColumns}
                data={routeReport}
                emptyTitle="No route report"
                emptyDescription="The backend has not recorded route-level monitoring activity yet."
              />
            </Card>
          </section>

          <section className="dashboard-section">
            <Card
              title="Latest SQL logs"
              subtitle="Most recent captured queries with route, controller, and timing context."
              className="trip-performance-card border-0 monitoring-table-card"
              bodyClassName="p-0"
            >
              <Table
                columns={monitoringLogColumns}
                data={latestLogs}
                emptyTitle="No SQL logs"
                emptyDescription="The monitoring feed did not include any SQL log entries."
              />
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
