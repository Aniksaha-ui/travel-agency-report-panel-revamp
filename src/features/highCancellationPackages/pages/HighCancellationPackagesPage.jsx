import Badge from "../../../components/common/Badge";
import RechartsRankingChart from "../../../components/charts/RechartsRankingChart";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import AdminLayout from "../../../layouts/AdminLayout";
import MetricsOverview from "../../dashboard/components/MetricsOverview";
import useHighCancellationPackages from "../hooks/useHighCancellationPackages";

const MOBILE_METRIC_BADGES = {
  "tracked-packages": "PK",
  "cancelled-bookings": "CB",
  "highest-cancellation": "HC",
};

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
  const boardDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date());

  return (
    <AdminLayout>
      <div className="d-md-none dashboard-mobile-app high-cancellation-mobile">
        <div className="container-xl">
          <div className="dashboard-mobile-app__screen">
            <section className="dashboard-mobile-card dashboard-mobile-card--hero">
              <div className="dashboard-mobile-card__header">
                <div>
                  <div className="dashboard-mobile-card__eyebrow">
                    /admin/high-cancellation-packages
                  </div>
                  <h2 className="dashboard-mobile-card__title">
                    {copy?.pageTitle ?? "High cancellation packages"}
                  </h2>
                  <p className="dashboard-mobile-hero__subtitle">
                    {copy?.pageSubtitle ??
                      "Review packages with the highest cancellation rate from the report API."}
                  </p>
                </div>
                <span className="dashboard-mobile-card__more">{boardDate}</span>
              </div>

              <div className="dashboard-mobile-spotlight">
                <div>
                  <div className="dashboard-mobile-spotlight__label">
                    Highest risk package
                  </div>
                  <div className="dashboard-mobile-spotlight__value">
                    {summary.highestPackage?.cancellationRateLabel ?? "0%"}
                  </div>
                  <div className="dashboard-mobile-spotlight__meta high-cancellation-mobile__spotlight-copy">
                    {summary.highestPackage?.packageName ?? "No package data available"}
                  </div>
                </div>
                <div className="dashboard-mobile-spotlight__stack">
                  <span>{summary.totalBookingsLabel ?? "0"} bookings</span>
                  <span>{summary.totalCancelledLabel ?? "0"} cancelled</span>
                </div>
              </div>

              <div className="dashboard-mobile-metrics dashboard-mobile-metrics--two-column">
                {metrics.map((metric) => (
                  <article
                    key={metric.id}
                    className={`dashboard-mobile-metric dashboard-mobile-metric--${metric.changeTone ?? "info"}`}
                  >
                    <div className="dashboard-mobile-metric__badge">
                      {MOBILE_METRIC_BADGES[metric.id] ?? metric.label.charAt(0)}
                    </div>
                    <div className="dashboard-mobile-metric__label">
                      {metric.label}
                    </div>
                    <div className="dashboard-mobile-metric__value">
                      {metric.value}
                    </div>
                    <div className="dashboard-mobile-metric__change">
                      {metric.change}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="dashboard-mobile-card dashboard-mobile-card--soft">
              <div className="dashboard-mobile-card__header">
                <div>
                  <div className="dashboard-mobile-card__title">
                    Cancellation rate ranking
                  </div>
                  <div className="dashboard-mobile-card__subtle">
                    Packages ordered by cancellation rate
                  </div>
                </div>
                <div className="dashboard-mobile-pill">
                  {packages.length} packages
                </div>
              </div>

              <RechartsRankingChart
                items={charts.cancellationRanking ?? []}
                labelKey="label"
                valueKey="value"
                tooltipLabel="Cancellation rate"
                valueFormatter={(value) => `${Number(value) || 0}%`}
                getCellColor={() => "#ef4444"}
              />
            </section>

            <section className="dashboard-mobile-card">
              <div className="dashboard-mobile-card__header">
                <div>
                  <div className="dashboard-mobile-card__title">
                    Package breakdown
                  </div>
                  <div className="dashboard-mobile-card__subtle">
                    Booking and cancellation details for each package
                  </div>
                </div>
                <div className="dashboard-mobile-pill">
                  Avg {summary.averageRateLabel ?? "0%"}
                </div>
              </div>

              <div className="dashboard-mobile-payment-list">
                {packages.length ? (
                  packages.map((item) => (
                    <article
                      key={item.id}
                      className="dashboard-mobile-payment-item high-cancellation-mobile__package"
                    >
                      <div className="high-cancellation-mobile__package-head">
                        <div className="high-cancellation-mobile__package-title">
                          {item.packageName}
                        </div>
                        <Badge color={item.tone}>{item.cancellationRateLabel}</Badge>
                      </div>

                      <div className="dashboard-mobile-quick-grid high-cancellation-mobile__quick-grid">
                        <div className="dashboard-mobile-quick-grid__item">
                          <div className="dashboard-mobile-quick-grid__label">
                            Total bookings
                          </div>
                          <div className="dashboard-mobile-quick-grid__value">
                            {item.totalBookingsLabel}
                          </div>
                        </div>
                        <div className="dashboard-mobile-quick-grid__item">
                          <div className="dashboard-mobile-quick-grid__label">
                            Cancelled
                          </div>
                          <div className="dashboard-mobile-quick-grid__value">
                            {item.cancelledCountLabel}
                          </div>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="dashboard-mobile-empty">
                    {isLoading
                      ? "Loading high cancellation packages..."
                      : "No high cancellation package data available yet."}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

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
