import RechartsPieChart from "../../../components/charts/RechartsPieChart";
import RechartsRankingChart from "../../../components/charts/RechartsRankingChart";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import MetricsOverview from "../../dashboard/components/MetricsOverview";
import { bookingCountFormatter, bookingSummaryColumns } from "./bookingSummaryView.config";

export default function BookingSummaryDesktopView({
  boardDate,
  categories,
  charts,
  copy,
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
              <span className="trip-performance-hero__eyebrow">/admin/bookings/summary</span>
              <h2 className="page-title">{copy.pageTitle}</h2>
              <p className="text-secondary mb-0">{copy.pageSubtitle}</p>
            </div>

            <div className="trip-performance-hero__meta">
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Total bookings</span>
                <strong>{summary.totalBookingsLabel ?? "0"}</strong>
              </div>
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Categories</span>
                <strong>{summary.categoryCountLabel ?? "0"}</strong>
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
                  title="Booking type mix"
                  subtitle="Booking share by service category."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsPieChart
                    items={charts.bookingMix ?? []}
                    height={320}
                    totalLabel="bookings"
                    valueFormatter={(value) => `${Number(value) || 0}`}
                  />
                </Card>
              </div>

              <div className="col-12 col-xl-7">
                <Card
                  title="Booking volume ranking"
                  subtitle="Categories ranked by total booking count."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsRankingChart
                    items={charts.bookingRanking ?? []}
                    labelKey="label"
                    valueKey="value"
                    tooltipLabel="Bookings"
                    valueFormatter={bookingCountFormatter}
                    getCellColor={(entry) => (Number(entry.value) >= 20 ? "#22c55e" : "#38bdf8")}
                  />
                </Card>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <div className="row g-3">
              <div className="col-12 col-xl-5">
                <Card
                  title="Booking spotlight"
                  subtitle="Highest-volume booking category."
                  className="trip-performance-card border-0 h-100"
                >
                  <div className="trip-performance-highlight">
                    <div className="trip-performance-highlight__title">
                      {summary.topCategory?.bookingTypeLabel ?? "No booking category yet"}
                    </div>
                    <div className="trip-performance-highlight__value">
                      {summary.topCategory?.totalBookingLabel ?? "0"} bookings
                    </div>
                    <div className="trip-performance-highlight__meta">
                      {summary.topCategory?.shareLabel ?? "No share data available"}
                    </div>
                  </div>

                  <div className="trip-performance-summary-grid">
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">Total bookings</span>
                      <strong>{summary.totalBookingsLabel ?? "0"}</strong>
                    </div>
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">Categories</span>
                      <strong>{summary.categoryCountLabel ?? "0"}</strong>
                    </div>
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">Lowest category</span>
                      <strong>{summary.smallestCategory?.bookingTypeLabel ?? "N/A"}</strong>
                    </div>
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">Lowest count</span>
                      <strong>{summary.smallestCategory?.totalBookingLabel ?? "0"}</strong>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="col-12 col-xl-7">
                <Card
                  title="Booking summary ledger"
                  subtitle="Total bookings and share for each booking type."
                  className="trip-performance-card border-0 h-100"
                  bodyClassName="p-0"
                >
                  {isLoading && !categories.length ? (
                    <div className="p-4 text-center text-secondary">Loading booking summary...</div>
                  ) : (
                    <Table
                      columns={bookingSummaryColumns}
                      data={categories}
                      emptyTitle="No booking summary"
                      emptyDescription="The report endpoint did not return any booking categories."
                    />
                  )}
                </Card>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
