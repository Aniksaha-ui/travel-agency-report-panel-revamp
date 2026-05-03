import RechartsPieChart from "../../../components/charts/RechartsPieChart";
import Badge from "../../../components/common/Badge";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import AdminLayout from "../../../layouts/AdminLayout";
import MetricsOverview from "../../dashboard/components/MetricsOverview";
import useLowOccupancyReport from "../hooks/useLowOccupancyReport";

const lowOccupancyColumns = [
  {
    key: "tripName",
    header: "Trip",
    render: (row) => (
      <div>
        <div className="fw-semibold">{row.tripName}</div>
        <div className="text-secondary small">Departure {row.departureLabel}</div>
      </div>
    ),
  },
  {
    key: "totalSeatsLabel",
    header: "Total seats",
    headerClassName: "text-end",
    cellClassName: "text-end fw-semibold",
  },
  {
    key: "bookedSeatsLabel",
    header: "Booked",
    headerClassName: "text-end",
    cellClassName: "text-end fw-semibold",
  },
  {
    key: "occupancyRateLabel",
    header: "Occupancy",
    render: (row) => <Badge color={row.tone}>{row.occupancyRateLabel}</Badge>,
  },
];

export default function LowOccupancyReportPage() {
  const { data, isLoading } = useLowOccupancyReport();
  const copy = data?.copy;
  const metrics = data?.metrics ?? [];
  const trips = data?.trips ?? [];
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
              <span className="trip-performance-hero__eyebrow">/admin/low-occupancy-report</span>
              <h2 className="page-title">{copy?.pageTitle ?? "Low occupancy report"}</h2>
              <p className="text-secondary mb-0">
                {copy?.pageSubtitle ?? "Monitor trips with the lowest seat utilization before departure."}
              </p>
            </div>

            <div className="trip-performance-hero__meta">
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Trips</span>
                <strong>{trips.length}</strong>
              </div>
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Average occupancy</span>
                <strong>{summary.averageOccupancyLabel ?? "0%"}</strong>
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
                  title="Occupancy distribution"
                  subtitle="Visible occupancy rates returned by the low occupancy report API."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsPieChart
                    items={charts.occupancyMix ?? []}
                    height={300}
                    totalLabel="occupancy"
                    valueFormatter={(value) => `${Number(value) || 0}%`}
                  />
                </Card>
              </div>

              <div className="col-12 col-xl-7">
                <Card
                  title="Low occupancy trips"
                  subtitle="Trips with the lowest seat take-up on the current report."
                  className="trip-performance-card border-0 h-100"
                  bodyClassName="p-0"
                >
                  {isLoading && !trips.length ? (
                    <div className="p-4 text-center text-secondary">Loading low occupancy report...</div>
                  ) : (
                    <Table
                      columns={lowOccupancyColumns}
                      data={trips}
                      emptyTitle="No low occupancy data"
                      emptyDescription="The API did not return any trip rows."
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
