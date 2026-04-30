import RechartsAreaChart from "../../../components/charts/RechartsAreaChart";
import RechartsRankingChart from "../../../components/charts/RechartsRankingChart";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import MetricsOverview from "../../dashboard/components/MetricsOverview";
import {
  assignmentTrendSeries,
  vehicleAssignmentFormatter,
  vehicleCountFormatter,
  vehicleTrackingColumns,
} from "./vehicleTrackingReportView.config";

export default function VehicleTrackingDesktopView({
  assignments,
  boardDate,
  charts,
  copy,
  isLoading,
  metrics,
  pagination,
  summary,
  tableFooter,
}) {
  return (
    <div className="d-none d-md-block">
      <div className="page-header d-print-none trip-performance-page-header">
        <div className="container-xl">
          <div className="trip-performance-hero">
            <div className="trip-performance-hero__copy">
              <span className="trip-performance-hero__eyebrow">/admin/vehicletrackingreport</span>
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
                <span className="trip-performance-hero__meta-label">Vehicles</span>
                <strong>{summary.uniqueVehiclesLabel ?? "0"}</strong>
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
                  title="Assignment trend"
                  subtitle="Departure-date volume for vehicle assignments visible on this page."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsAreaChart
                    data={charts.startDateTrend ?? []}
                    series={assignmentTrendSeries}
                    labelKey="label"
                    valueFormatter={vehicleCountFormatter}
                  />
                </Card>
              </div>

              <div className="col-12 col-xl-4">
                <Card
                  title="Vehicle usage leaders"
                  subtitle="Vehicles with the highest assignment count."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsRankingChart
                    items={charts.vehicleRanking ?? []}
                    labelKey="label"
                    valueKey="value"
                    tooltipLabel="Assignments"
                    valueFormatter={vehicleAssignmentFormatter}
                    getCellColor={(entry) => (Number(entry.value) > 1 ? "#22c55e" : "#38bdf8")}
                  />
                </Card>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <div className="row g-3">
              <div className="col-12 col-xl-5">
                <Card
                  title="Tracking spotlight"
                  subtitle="Vehicle usage and longest travel window on the visible page."
                  className="trip-performance-card border-0 h-100"
                >
                  <div className="trip-performance-highlight">
                    <div className="trip-performance-highlight__title">
                      {summary.busiestVehicleName ?? "No tracked vehicle yet"}
                    </div>
                    <div className="trip-performance-highlight__value">
                      {summary.busiestVehicleCountLabel ?? "0"} assignments
                    </div>
                    <div className="trip-performance-highlight__meta">
                      {summary.longestAssignment
                        ? `${summary.longestAssignment.tripName} - ${summary.longestAssignment.durationLabel}`
                        : "No travel windows yet"}
                    </div>
                  </div>

                  <div className="trip-performance-summary-grid">
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">Tracked trips</span>
                      <strong>{summary.uniqueTripsLabel ?? "0"}</strong>
                    </div>
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">Active days</span>
                      <strong>{summary.activeDaysLabel ?? "0"}</strong>
                    </div>
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">Total travel days</span>
                      <strong>{summary.totalTravelDaysLabel ?? "0"}</strong>
                    </div>
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">Longest window</span>
                      <strong>{summary.longestAssignment?.durationLabel ?? "0 days"}</strong>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="col-12 col-xl-7">
                <Card
                  title="Longest travel windows"
                  subtitle="Trips with the largest start-to-end travel span."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsRankingChart
                    items={charts.durationRanking ?? []}
                    labelKey="label"
                    valueKey="value"
                    tooltipLabel="Duration"
                    valueFormatter={(value) => `${Number(value) || 0} days`}
                    getCellColor={(entry) => (Number(entry.value) > 1 ? "#f59e0b" : "#38bdf8")}
                  />
                </Card>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <Card
              title="Vehicle tracking ledger"
              subtitle="Trips, vehicles, travel windows, departures, and arrivals."
              className="trip-performance-card border-0"
              bodyClassName="p-0"
              footer={tableFooter}
            >
              {isLoading && !assignments.length ? (
                <div className="p-4 text-center text-secondary">Loading vehicle tracking data...</div>
              ) : (
                <Table
                  columns={vehicleTrackingColumns}
                  data={assignments}
                  emptyTitle="No vehicle tracking data"
                  emptyDescription="The report endpoint did not return any vehicle assignment rows."
                />
              )}
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
