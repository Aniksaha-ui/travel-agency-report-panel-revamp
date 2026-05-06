import RechartsAreaChart from "../../../components/charts/RechartsAreaChart";
import RechartsRankingChart from "../../../components/charts/RechartsRankingChart";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import MetricsOverview from "../../dashboard/components/MetricsOverview";
import {
  growthDeltaFormatter,
  newUsersFormatter,
  userGrowthColumns,
} from "./userGrowthReportView.config";

const userGrowthSeries = [
  {
    key: "newUsers",
    label: "New users",
    color: "#38bdf8",
  },
];

export default function UserGrowthReportDesktopView({
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
    <div className="d-none d-md-block">
      <div className="page-header d-print-none trip-performance-page-header">
        <div className="container-xl">
          <div className="trip-performance-hero">
            <div className="trip-performance-hero__copy">
              <span className="trip-performance-hero__eyebrow">/admin/user-growth-report</span>
              <h2 className="page-title">{copy?.pageTitle ?? "User growth report"}</h2>
              <p className="text-secondary mb-0">
                {copy?.pageSubtitle ??
                  "Track newly registered users by month from the report API."}
              </p>
            </div>

            <div className="trip-performance-hero__meta">
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Tracked months</span>
                <strong>{growthRows.length}</strong>
              </div>
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Total new users</span>
                <strong>{summary.totalNewUsersLabel ?? "0"}</strong>
              </div>
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Board date</span>
                <strong>{boardDate}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          {error ? (
            <section className="dashboard-section">
              <Card title="User growth unavailable" className="trip-performance-card border-0">
                <div className="text-danger">
                  {error.message || "Unable to load the user growth report."}
                </div>
              </Card>
            </section>
          ) : null}

          <section className="dashboard-section">
            <MetricsOverview metrics={metrics} />
          </section>

          <section className="dashboard-section">
            <div className="row g-3">
              <div className="col-12 col-xl-8">
                <Card
                  title="Monthly registration flow"
                  subtitle="Month-by-month new user registrations from the legacy growth report."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsAreaChart
                    data={(charts.monthlyGrowth ?? []).map((item) => ({
                      ...item,
                      newUsers: item.value,
                    }))}
                    series={userGrowthSeries}
                    labelKey="label"
                    valueFormatter={newUsersFormatter}
                  />
                </Card>
              </div>

              <div className="col-12 col-xl-4">
                <Card
                  title="Month-over-month shift"
                  subtitle="How each month moved against the previous one."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsRankingChart
                    items={charts.growthDelta ?? []}
                    labelKey="label"
                    valueKey="value"
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
                </Card>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <Card
              title="Growth ledger"
              subtitle="Monthly registration counts and trend change from the previous month."
              className="trip-performance-card border-0"
              bodyClassName="p-0"
              actions={
                <button className="btn btn-outline-primary btn-sm" onClick={() => window.print()}>
                  Print report
                </button>
              }
            >
              {isLoading && !growthRows.length ? (
                <div className="p-4 text-center text-secondary">
                  Loading user growth report...
                </div>
              ) : (
                <Table
                  columns={userGrowthColumns}
                  data={[...growthRows].reverse()}
                  emptyTitle="No user growth data"
                  emptyDescription="The API did not return any user growth rows."
                />
              )}
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
