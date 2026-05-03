import RechartsRankingChart from "../../../components/charts/RechartsRankingChart";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import AdminLayout from "../../../layouts/AdminLayout";
import MetricsOverview from "../../dashboard/components/MetricsOverview";
import useUserGrowthReport from "../hooks/useUserGrowthReport";

const userGrowthColumns = [
  {
    key: "monthLabel",
    header: "Month",
    render: (row) => <span className="fw-semibold">{row.monthLabel}</span>,
  },
  {
    key: "newUsersLabel",
    header: "New users",
    headerClassName: "text-end",
    cellClassName: "text-end fw-semibold",
  },
];

export default function UserGrowthReportPage() {
  const { data, isLoading } = useUserGrowthReport();
  const copy = data?.copy;
  const metrics = data?.metrics ?? [];
  const growthRows = data?.growthRows ?? [];
  const summary = data?.summary ?? {};
  const charts = data?.charts ?? {};
  const boardDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date());

  return (
    <AdminLayout>
      <div className="page-header d-print-none trip-performance-page-header">
        <div className="container-xl">
          <div className="trip-performance-hero">
            <div className="trip-performance-hero__copy">
              <span className="trip-performance-hero__eyebrow">/admin/user-growth-report</span>
              <h2 className="page-title">{copy?.pageTitle ?? "User growth report"}</h2>
              <p className="text-secondary mb-0">
                {copy?.pageSubtitle ?? "Track newly registered users by month from the report API."}
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
          <section className="dashboard-section">
            <MetricsOverview metrics={metrics} />
          </section>

          <section className="dashboard-section">
            <div className="row g-3">
              <div className="col-12 col-xl-5">
                <Card
                  title="Monthly new users"
                  subtitle="Compare how many new users were added in each reported month."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsRankingChart
                    items={charts.monthlyGrowth ?? []}
                    labelKey="label"
                    valueKey="value"
                    tooltipLabel="New users"
                    valueFormatter={(value) => `${Number(value) || 0} users`}
                    getCellColor={() => "#38bdf8"}
                  />
                </Card>
              </div>

              <div className="col-12 col-xl-7">
                <Card
                  title="User growth ledger"
                  subtitle="Monthly user registration counts returned by the growth report API."
                  className="trip-performance-card border-0 h-100"
                  bodyClassName="p-0"
                >
                  {isLoading && !growthRows.length ? (
                    <div className="p-4 text-center text-secondary">Loading user growth report...</div>
                  ) : (
                    <Table
                      columns={userGrowthColumns}
                      data={growthRows}
                      emptyTitle="No user growth data"
                      emptyDescription="The API did not return any user growth rows."
                    />
                  )}
                </Card>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}
