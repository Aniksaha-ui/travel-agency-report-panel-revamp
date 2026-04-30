import RechartsAreaChart from "../../../components/charts/RechartsAreaChart";
import RechartsBarChart from "../../../components/charts/RechartsBarChart";
import RechartsRankingChart from "../../../components/charts/RechartsRankingChart";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import MetricsOverview from "../../dashboard/components/MetricsOverview";
import {
  compactRevenueFormatter,
  revenueTrendSeries,
  seatCompositionSegments,
  tripColumns,
} from "./tripPerformanceView.config";

export default function TripPerformanceDesktopView({
  boardDate,
  charts,
  copy,
  handleSearchChange,
  isLoading,
  metrics,
  pagination,
  searchTerm,
  summary,
  tableFooter,
  topTrip,
  trips,
}) {
  return (
    <div className="d-none d-md-block">
      <div className="page-header d-print-none trip-performance-page-header">
        <div className="container-xl">
          <div className="trip-performance-hero">
            <div className="trip-performance-hero__copy">
              <span className="trip-performance-hero__eyebrow">/admin/tripPerformance</span>
              <h2 className="page-title">{copy.pageTitle}</h2>
              <p className="text-secondary mb-0">{copy.pageSubtitle}</p>
            </div>

            <div className="trip-performance-hero__meta">
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Showing</span>
                <strong>
                  {pagination.from ?? 0}-{pagination.to ?? 0} of {pagination.total ?? 0}
                </strong>
              </div>
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Page</span>
                <strong>
                  {pagination.currentPage ?? 1}/{pagination.lastPage ?? 1}
                </strong>
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
              <div className="col-12 col-xl-8">
                <Card
                  title="Revenue and profit trend"
                  subtitle="Compare how combined revenue and profit move across the visible trips."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsAreaChart
                    data={charts.revenueTrend ?? []}
                    series={revenueTrendSeries}
                    labelKey="label"
                    valueFormatter={compactRevenueFormatter}
                  />
                </Card>
              </div>

              <div className="col-12 col-xl-4">
                <Card
                  title="Occupancy leaders"
                  subtitle="Highest seat utilization on the current result set."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsRankingChart
                    items={charts.occupancyRanking ?? []}
                    labelKey="label"
                    valueKey="value"
                    valueFormatter={(value) => `${value}%`}
                  />
                </Card>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <div className="row g-3">
              <div className="col-12 col-xl-5">
                <Card
                  title="Top performer"
                  subtitle="Best visible trip on the current page by combined profit."
                  className="trip-performance-card border-0 h-100"
                >
                  <div className="trip-performance-highlight">
                    <div className="trip-performance-highlight__title">
                      {topTrip?.tripName ?? "No highlighted trip yet"}
                    </div>
                    <div className="trip-performance-highlight__value">
                      {topTrip?.totalProfitLabel ?? "BDT 0"}
                    </div>
                    <div className="trip-performance-highlight__meta">
                      Revenue {topTrip?.totalRevenueLabel ?? "BDT 0"} -{" "}
                      {topTrip?.occupancyRateLabel ?? "0% occupied"}
                    </div>
                  </div>

                  <div className="trip-performance-summary-grid">
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">Visible revenue</span>
                      <strong>{summary.visibleRevenueLabel ?? "BDT 0"}</strong>
                    </div>
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">Visible profit</span>
                      <strong>{summary.visibleProfitLabel ?? "BDT 0"}</strong>
                    </div>
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">Booked seats</span>
                      <strong>{summary.visibleBookedSeatsLabel ?? "0"}</strong>
                    </div>
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">Seat utilization</span>
                      <strong>{summary.visibleUtilizationLabel ?? "0%"}</strong>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="col-12 col-xl-7">
                <Card
                  title="Seat composition by trip"
                  subtitle="See how direct trip seats, package seats, and remaining capacity are distributed."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsBarChart
                    items={charts.seatComposition ?? []}
                    segments={seatCompositionSegments}
                    labelKey="label"
                    height={350}
                  />
                </Card>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <Card
              title="Trip performance ledger"
              subtitle="Revenue, capacity, and profitability for each scheduled trip."
              className="trip-performance-card border-0"
              bodyClassName="p-0"
              footer={tableFooter}
              actions={
                <div className="dashboard-search trip-performance-search">
                  <div className="input-icon">
                    <span className="input-icon-addon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                        <path d="M21 21l-6 -6" />
                      </svg>
                    </span>
                    <input
                      type="search"
                      className="form-control"
                      placeholder="Search trips"
                      aria-label="Search trips"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </div>
                </div>
              }
            >
              {isLoading && !trips.length ? (
                <div className="p-4 text-center text-secondary">Loading trip performance data...</div>
              ) : (
                <Table
                  columns={tripColumns}
                  data={trips}
                  emptyTitle="No trip performance data"
                  emptyDescription="The report endpoint did not return any trip rows."
                />
              )}
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
