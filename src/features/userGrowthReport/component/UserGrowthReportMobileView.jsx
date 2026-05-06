import RechartsRankingChart from "../../../components/charts/RechartsRankingChart";
import { growthDeltaFormatter } from "./userGrowthReportView.config";

export default function UserGrowthReportMobileView({
  boardDate,
  charts,
  copy,
  error,
  growthRows,
  isLoading,
  metrics,
  summary,
}) {
  return (
    <div className="d-md-none trip-performance-mobile">
      <div className="container-xl">
        <div className="trip-performance-mobile__screen">
          <section className="trip-performance-mobile__hero">
            <div className="trip-performance-mobile__hero-top">
              <div>
                <div className="trip-performance-mobile__eyebrow">/admin/user-growth-report</div>
                <h2 className="trip-performance-mobile__title">
                  {copy?.pageTitle ?? "User growth report"}
                </h2>
                <p className="trip-performance-mobile__subtitle">
                  {copy?.pageSubtitle ??
                    "Track newly registered users by month from the report API."}
                </p>
              </div>
              <span className="trip-performance-mobile__date">{boardDate}</span>
            </div>

            <div className="trip-performance-mobile__spotlight">
              <div>
                <div className="trip-performance-mobile__spotlight-label">Top growth month</div>
                <div className="trip-performance-mobile__spotlight-value">
                  {summary.highestMonth?.newUsersLabel ?? "0"}
                </div>
                <div className="trip-performance-mobile__spotlight-meta">
                  {summary.highestMonth?.monthLabel ?? "No user growth records yet."}
                </div>
              </div>
              <div className="trip-performance-mobile__spotlight-stack">
                <span>{summary.totalNewUsersLabel ?? "0"} users</span>
                <span>{summary.averagePerMonthLabel ?? "0"} avg/month</span>
              </div>
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
              <div className="text-danger">
                {error.message || "Unable to load the user growth report."}
              </div>
            </section>
          ) : null}

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Monthly new users</div>
                <div className="trip-performance-mobile__card-subtle">
                  Compare how many users were added in each reported month
                </div>
              </div>
            </div>

            <RechartsRankingChart
              items={charts.monthlyGrowth ?? []}
              labelKey="label"
              valueKey="value"
              tooltipLabel="New users"
              valueFormatter={(value) => `${Number(value) || 0} users`}
              getCellColor={() => "#38bdf8"}
            />
          </section>

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">User growth ledger</div>
                <div className="trip-performance-mobile__card-subtle">
                  Monthly registration totals from the report API
                </div>
              </div>
              <div className="trip-performance-mobile__pill">{growthRows.length} months</div>
            </div>

            <div className="trip-performance-mobile__list">
              {growthRows.length ? (
                [...growthRows].reverse().map((row) => (
                  <article key={row.id} className="trip-performance-mobile__item">
                    <div className="trip-performance-mobile__item-top">
                      <div>
                        <div className="trip-performance-mobile__item-title">{row.monthLabel}</div>
                        <div className="trip-performance-mobile__item-meta">
                          {row.newUsersLabel} newly registered users
                        </div>
                      </div>
                      <div className="trip-performance-mobile__item-profit">
                        {row.newUsersLabel}
                      </div>
                    </div>
                    <div className="trip-performance-mobile__item-grid">
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">
                          {row.newUsersLabel}
                        </div>
                        <div className="trip-performance-mobile__item-grid-label">New users</div>
                      </div>
                      <div>
                        <div
                          className={`trip-performance-mobile__item-grid-value ${
                            row.growthDirection === "up"
                              ? "text-success"
                              : row.growthDirection === "down"
                                ? "text-danger"
                                : "text-secondary"
                          }`}
                        >
                          {row.growthLabel}
                        </div>
                        <div className="trip-performance-mobile__item-grid-label">Trend</div>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="trip-performance-mobile__empty">
                  {isLoading ? "Loading user growth report..." : "No user growth data available."}
                </div>
              )}
            </div>
          </section>

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Growth delta</div>
                <div className="trip-performance-mobile__card-subtle">
                  Month-over-month movement in registrations
                </div>
              </div>
            </div>

            <RechartsRankingChart
              items={charts.growthDelta ?? []}
              labelKey="label"
              valueKey="value"
              height={250}
              tooltipLabel="Growth delta"
              valueFormatter={growthDeltaFormatter}
              getCellColor={(entry) =>
                Number(entry.value) > 0
                  ? "#22c55e"
                  : Number(entry.value) < 0
                    ? "#ef4444"
                    : "#94a3b8"
              }
            />
          </section>
        </div>
      </div>
    </div>
  );
}
