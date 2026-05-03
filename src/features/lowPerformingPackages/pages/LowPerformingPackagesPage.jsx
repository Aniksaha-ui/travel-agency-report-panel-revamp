import RechartsRankingChart from "../../../components/charts/RechartsRankingChart";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import AdminLayout from "../../../layouts/AdminLayout";
import MetricsOverview from "../../dashboard/components/MetricsOverview";
import useLowPerformingPackages from "../hooks/useLowPerformingPackages";

const lowPerformingPackagesColumns = [
  {
    key: "packageName",
    header: "Package",
    render: (row) => <span className="fw-semibold">{row.packageName}</span>,
  },
  {
    key: "recentBookingCountLabel",
    header: "Recent bookings",
    headerClassName: "text-end",
    cellClassName: "text-end fw-semibold",
  },
];

export default function LowPerformingPackagesPage() {
  const { data, isLoading } = useLowPerformingPackages();
  const copy = data?.copy;
  const metrics = data?.metrics ?? [];
  const packages = data?.packages ?? [];
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
              <span className="trip-performance-hero__eyebrow">/admin/low-performing-packages</span>
              <h2 className="page-title">{copy?.pageTitle ?? "Low performing packages"}</h2>
              <p className="text-secondary mb-0">
                {copy?.pageSubtitle ?? "Monitor packages with the lowest recent booking activity."}
              </p>
            </div>

            <div className="trip-performance-hero__meta">
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Packages</span>
                <strong>{packages.length}</strong>
              </div>
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Average bookings</span>
                <strong>{summary.averageBookingsLabel ?? "0"}</strong>
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
                  title="Lowest booking activity"
                  subtitle="Packages ranked by the fewest recent bookings."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsRankingChart
                    items={charts.bookingRanking ?? []}
                    labelKey="label"
                    valueKey="value"
                    tooltipLabel="Recent bookings"
                    valueFormatter={(value) => `${Number(value) || 0} bookings`}
                    getCellColor={() => "#f59e0b"}
                  />
                </Card>
              </div>

              <div className="col-12 col-xl-7">
                <Card
                  title="Low performing package ledger"
                  subtitle="Packages and booking counts returned by the report API."
                  className="trip-performance-card border-0 h-100"
                  bodyClassName="p-0"
                >
                  {isLoading && !packages.length ? (
                    <div className="p-4 text-center text-secondary">Loading low performing packages...</div>
                  ) : (
                    <Table
                      columns={lowPerformingPackagesColumns}
                      data={packages}
                      emptyTitle="No low performing package data"
                      emptyDescription="The API did not return any package rows."
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
