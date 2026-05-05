import Badge from "../../../components/common/Badge";
import RechartsRankingChart from "../../../components/charts/RechartsRankingChart";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import AdminLayout from "../../../layouts/AdminLayout";
import MetricsOverview from "../../dashboard/components/MetricsOverview";
import HighCancellationPackagesMobileView from "../component/HighCancellationPackagesMobileView";
import useHighCancellationPackages from "../hooks/useHighCancellationPackages";
import { formatBoardDate } from "../../../utils/dateUtils";

const highCancellationPackagesColumns = [
  {
    key: "packageName",
    header: "Package",
    render: (row) => <span className="fw-semibold">{row.packageName}</span>,
  },
  {
    key: "totalBookingsLabel",
    header: "Total bookings",
    headerClassName: "text-end",
    cellClassName: "text-end fw-semibold",
  },
  {
    key: "cancelledCountLabel",
    header: "Cancelled",
    headerClassName: "text-end",
    cellClassName: "text-end fw-semibold",
  },
  {
    key: "cancellationRateLabel",
    header: "Cancellation rate",
    headerClassName: "text-end",
    cellClassName: "text-end",
    render: (row) => <Badge color={row.tone}>{row.cancellationRateLabel}</Badge>,
  },
];

export default function HighCancellationPackagesPage() {
  const { data, isLoading } = useHighCancellationPackages();
  const copy = data?.copy;
  const metrics = data?.metrics ?? [];
  const packages = data?.packages ?? [];
  const summary = data?.summary ?? {};
  const charts = data?.charts ?? {};
  const boardDate = formatBoardDate();

  return (
    <AdminLayout>
      <HighCancellationPackagesMobileView
        boardDate={boardDate}
        charts={charts}
        copy={copy}
        isLoading={isLoading}
        metrics={metrics}
        packages={packages}
        summary={summary}
      />

      <div className="d-none d-md-block">
        <div className="page-header d-print-none trip-performance-page-header">
          <div className="container-xl">
            <div className="trip-performance-hero">
              <div className="trip-performance-hero__copy">
                <span className="trip-performance-hero__eyebrow">/admin/high-cancellation-packages</span>
                <h2 className="page-title">{copy?.pageTitle ?? "High cancellation packages"}</h2>
                <p className="text-secondary mb-0">
                  {copy?.pageSubtitle ?? "Review packages with the highest cancellation rate from the report API."}
                </p>
              </div>

              <div className="trip-performance-hero__meta">
                <div className="trip-performance-hero__meta-item">
                  <span className="trip-performance-hero__meta-label">Packages</span>
                  <strong>{packages.length}</strong>
                </div>
                <div className="trip-performance-hero__meta-item">
                  <span className="trip-performance-hero__meta-label">Cancelled bookings</span>
                  <strong>{summary.totalCancelledLabel ?? "0"}</strong>
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
                    title="Cancellation rate ranking"
                    subtitle="Packages ordered by the highest cancellation rate in the current report."
                    className="trip-performance-card border-0 h-100"
                  >
                    <RechartsRankingChart
                      items={charts.cancellationRanking ?? []}
                      labelKey="label"
                      valueKey="value"
                      tooltipLabel="Cancellation rate"
                      valueFormatter={(value) => `${Number(value) || 0}%`}
                      getCellColor={() => "#ef4444"}
                    />
                  </Card>
                </div>

                <div className="col-12 col-xl-7">
                  <Card
                    title="High cancellation package ledger"
                    subtitle="Package booking and cancellation rows returned by the report API."
                    className="trip-performance-card border-0 h-100"
                    bodyClassName="p-0"
                  >
                    {isLoading && !packages.length ? (
                      <div className="p-4 text-center text-secondary">Loading high cancellation packages...</div>
                    ) : (
                      <Table
                        columns={highCancellationPackagesColumns}
                        data={packages}
                        emptyTitle="No cancellation package data"
                        emptyDescription="The API did not return any package rows."
                      />
                    )}
                  </Card>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
