import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import AdminLayout from "../../../layouts/AdminLayout";
import MetricsOverview from "../components/MetricsOverview";
import { DASHBOARD_COPY } from "../constants/dashboard.constants";
import useDashboard from "../hooks/useDashboard";

const TONE_CLASS_MAP = {
  success: "dashboard-share__fill--success",
  info: "dashboard-share__fill--info",
  warning: "dashboard-share__fill--warning",
};

const renderShareMeter = (value, tone) => (
  <div className="dashboard-share">
    <div className="dashboard-share__label">{value.shareLabel}</div>
    <div className="dashboard-share__track">
      <span
        className={`dashboard-share__fill ${TONE_CLASS_MAP[tone] ?? ""}`}
        style={{ width: `${value.share}%` }}
      />
    </div>
  </div>
);

const tripColumns = [
  { key: "origin", header: "Trip origin" },
  {
    key: "tripCountLabel",
    header: "Trips",
    headerClassName: "text-end",
    cellClassName: "text-end fw-semibold",
  },
  {
    key: "share",
    header: "Coverage",
    render: (row) => renderShareMeter(row, row.tone),
  },
];

const paymentColumns = [
  { key: "paymentMethod", header: "Payment method" },
  {
    key: "paymentHeldLabel",
    header: "Payments held",
    headerClassName: "text-end",
    cellClassName: "text-end fw-semibold",
  },
  {
    key: "totalAmountLabel",
    header: "Collected value",
    headerClassName: "text-end",
    cellClassName: "text-end fw-semibold",
  },
  {
    key: "share",
    header: "Share",
    render: (row) => renderShareMeter(row, row.tone),
  },
];

export default function DashboardPage() {
  const { data, isLoading } = useDashboard();
  const copy = data?.copy ?? DASHBOARD_COPY;
  const metrics = data?.metrics ?? [];
  const summaryStats = data?.summaryStats ?? [];
  const tripOrigins = data?.tripOrigins ?? [];
  const paymentMethods = data?.paymentMethods ?? [];
  const totals = data?.totals ?? {};
  const paymentCaptureRate = data?.paymentCaptureRate ?? 0;
  const boardDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date());

  return (
    <AdminLayout>
      <div className="d-md-none dashboard-mobile-app">
        <div className="container-xl">
          <div className="dashboard-mobile-app__screen">
            <section className="dashboard-mobile-card dashboard-mobile-card--hero mt-5">
              <div className="dashboard-mobile-card__header">
                <div>
                  <div className="dashboard-mobile-card__eyebrow">
                    Live admin summary
                  </div>
                  <h2 className="dashboard-mobile-card__title">
                    {copy.pageTitle}
                  </h2>
                  <p className="dashboard-mobile-hero__subtitle">
                    {copy.pageSubtitle}
                  </p>
                </div>
                <span className="dashboard-mobile-card__more">{boardDate}</span>
              </div>

              <div className="dashboard-mobile-spotlight">
                <div>
                  <div className="dashboard-mobile-spotlight__label">
                    Monthly payments
                  </div>
                  <div className="dashboard-mobile-spotlight__value">
                    {totals.monthlyPayments ?? "BDT 0"}
                  </div>
                  <div className="dashboard-mobile-spotlight__meta">
                    {totals.totalPayments ?? "0"} payments across{" "}
                    {totals.totalTransactions ?? "0"} transactions
                  </div>
                </div>
                <div className="dashboard-mobile-spotlight__stack">
                  <span>{totals.totalBookings ?? "0"} bookings</span>
                  <span>{paymentCaptureRate}% captured</span>
                </div>
              </div>

              <div className="dashboard-mobile-metrics dashboard-mobile-metrics--two-column">
                {metrics.map((metric) => (
                  <article
                    key={metric.id}
                    className={`dashboard-mobile-metric dashboard-mobile-metric--${metric.changeTone ?? "info"}`}
                  >
                    <div className="dashboard-mobile-metric__badge">
                      {metric.label.charAt(0)}
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
                    Trip origin coverage
                  </div>
                  <div className="dashboard-mobile-card__subtle">
                    Regional trip distribution from the API
                  </div>
                </div>
                <div className="dashboard-mobile-pill">
                  {totals.totalTripRegions ?? "0"} trips
                </div>
              </div>

              <div className="dashboard-mobile-origin-list">
                {tripOrigins.length ? (
                  tripOrigins.map((region) => (
                    <article
                      key={region.id}
                      className="dashboard-mobile-origin-item"
                    >
                      <div className="dashboard-mobile-origin-item__topline">
                        <span className="dashboard-mobile-origin-item__name">
                          {region.origin}
                        </span>
                        <span className="dashboard-mobile-origin-item__value">
                          {region.tripCountLabel}
                        </span>
                      </div>
                      {renderShareMeter(region, region.tone)}
                    </article>
                  ))
                ) : (
                  <div className="dashboard-mobile-empty">
                    {isLoading
                      ? "Loading trip coverage..."
                      : "Trip origin data is not available yet."}
                  </div>
                )}
              </div>
            </section>

            <section className="dashboard-mobile-card">
              <div className="dashboard-mobile-card__header">
                <div>
                  <div className="dashboard-mobile-card__title">
                    Payment channels
                  </div>
                  <div className="dashboard-mobile-card__subtle">
                    Collection mix by payment method
                  </div>
                </div>
                <div className="dashboard-mobile-pill">
                  {paymentMethods.length} methods
                </div>
              </div>

              <div className="dashboard-mobile-payment-list">
                {paymentMethods.length ? (
                  paymentMethods.map((channel) => (
                    <div
                      key={channel.id}
                      className="dashboard-mobile-payment-item"
                    >
                      <div>
                        <div className="dashboard-mobile-payment-item__title">
                          {channel.paymentMethod}
                        </div>
                        <div className="dashboard-mobile-payment-item__meta">
                          {channel.paymentHeldLabel} payments held
                        </div>
                      </div>
                      <div className="dashboard-mobile-payment-item__aside">
                        <div className="dashboard-mobile-payment-item__value">
                          {channel.totalAmountLabel}
                        </div>
                        <div className="dashboard-mobile-payment-item__share">
                          {channel.shareLabel}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="dashboard-mobile-empty">
                    {isLoading
                      ? "Loading payment channels..."
                      : "Payment method data is not available yet."}
                  </div>
                )}
              </div>

              <div className="dashboard-mobile-progress">
                <div className="dashboard-mobile-progress__header">
                  <span>Payment capture rate</span>
                  <span>{paymentCaptureRate}%</span>
                </div>
                <div className="dashboard-mobile-progress__bar">
                  <span
                    className="dashboard-mobile-progress__fill"
                    style={{ width: `${Math.min(paymentCaptureRate, 100)}%` }}
                  />
                </div>
              </div>
            </section>

            <section className="dashboard-mobile-card">
              <div className="dashboard-mobile-card__header">
                <div>
                  <div className="dashboard-mobile-card__title">
                    Operational inventory
                  </div>
                  <div className="dashboard-mobile-card__subtle">
                    Supporting counts across travel operations
                  </div>
                </div>
              </div>

              <div className="dashboard-mobile-quick-grid">
                {summaryStats.map((item) => (
                  <div
                    key={item.id}
                    className="dashboard-mobile-quick-grid__item"
                  >
                    <div className="dashboard-mobile-quick-grid__value">
                      {item.value}
                    </div>
                    <div className="dashboard-mobile-quick-grid__label">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      <div className="d-none d-md-block">
        <div className="page-header d-print-none dashboard-page-header">
          <div className="container-xl">
            <div className="dashboard-desktop-hero">
              <div className="dashboard-desktop-hero__copy">
                <span className="dashboard-heading__eyebrow">Overview</span>
                <h2 className="page-title">{copy.pageTitle}</h2>
                <p className="text-secondary mb-0">{copy.pageSubtitle}</p>
              </div>
              <div className="dashboard-desktop-hero__stats">
                <div className="dashboard-desktop-hero__stat">
                  <span className="dashboard-desktop-hero__stat-label">
                    Monthly payments
                  </span>
                  <strong>{totals.monthlyPayments ?? "BDT 0"}</strong>
                </div>
                <div className="dashboard-desktop-hero__stat">
                  <span className="dashboard-desktop-hero__stat-label">
                    Capture rate
                  </span>
                  <strong>{paymentCaptureRate}%</strong>
                </div>
                <div className="dashboard-desktop-hero__stat">
                  <span className="dashboard-desktop-hero__stat-label">
                    Today board
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

            <section className="dashboard-section">
              <div className="row g-3">
                <div className="col-12 col-xl-8">
                  <Card
                    title="Trip origin performance"
                    subtitle="See where current tour activity is concentrated across regions."
                    className="dashboard-table-card border-0 h-100"
                    bodyClassName="p-0"
                  >
                    {isLoading && !tripOrigins.length ? (
                      <div className="p-4 text-center text-secondary">
                        Loading trip origin data...
                      </div>
                    ) : (
                      <Table
                        columns={tripColumns}
                        data={tripOrigins}
                        emptyTitle="No trip origin data"
                        emptyDescription="The dashboard API did not return any trip coverage rows."
                      />
                    )}
                  </Card>
                </div>
                <div className="col-12 col-xl-4">
                  <Card
                    title="Operational inventory"
                    subtitle="Live totals for core travel management resources."
                    className="dashboard-table-card border-0 h-100"
                  >
                    <div className="dashboard-summary-grid">
                      {summaryStats.map((item) => (
                        <div
                          key={item.id}
                          className="dashboard-summary-grid__item"
                        >
                          <span className="dashboard-summary-grid__label">
                            {item.label}
                          </span>
                          <strong className="dashboard-summary-grid__value">
                            {item.value}
                          </strong>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            </section>

            <section className="dashboard-section">
              <div className="row g-3">
                <div className="col-12 col-xl-7">
                  <Card
                    title="Payment method analysis"
                    subtitle="Compare collected value and handled payment counts by channel."
                    className="dashboard-table-card border-0 h-100"
                    bodyClassName="p-0"
                  >
                    {isLoading && !paymentMethods.length ? (
                      <div className="p-4 text-center text-secondary">
                        Loading payment method data...
                      </div>
                    ) : (
                      <Table
                        columns={paymentColumns}
                        data={paymentMethods}
                        emptyTitle="No payment data"
                        emptyDescription="The dashboard API did not return any payment channel rows."
                      />
                    )}
                  </Card>
                </div>
                <div className="col-12 col-xl-5">
                  <Card
                    title="Booking pulse"
                    subtitle="High-level totals for current booking and transport operations."
                    className="dashboard-table-card border-0 h-100"
                  >
                    <div className="dashboard-pulse-list">
                      <div className="dashboard-pulse-list__item">
                        <span>Total bookings</span>
                        <strong>{totals.totalBookings ?? "0"}</strong>
                      </div>
                      <div className="dashboard-pulse-list__item">
                        <span>This month bookings</span>
                        <strong>{totals.thisMonthTotalBookings ?? "0"}</strong>
                      </div>
                      <div className="dashboard-pulse-list__item">
                        <span>Total tours</span>
                        <strong>{totals.totalTours ?? "0"}</strong>
                      </div>
                      <div className="dashboard-pulse-list__item">
                        <span>Vehicles in service</span>
                        <strong>{totals.totalVehicles ?? "0"}</strong>
                      </div>
                    </div>

                    <div className="dashboard-progress-card">
                      <div className="dashboard-progress-card__header">
                        <span>Payments captured</span>
                        <strong>{paymentCaptureRate}%</strong>
                      </div>
                      <div className="dashboard-share__track dashboard-share__track--large">
                        <span
                          className="dashboard-share__fill dashboard-share__fill--success"
                          style={{
                            width: `${Math.min(paymentCaptureRate, 100)}%`,
                          }}
                        />
                      </div>
                      <p className="text-secondary mb-0">
                        {totals.totalPayments ?? "0"} captured payments from{" "}
                        {totals.totalTransactions ?? "0"} total transactions.
                      </p>
                    </div>
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
