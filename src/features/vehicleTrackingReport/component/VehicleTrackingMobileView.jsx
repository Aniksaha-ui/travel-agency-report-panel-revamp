import RechartsAreaChart from "../../../components/charts/RechartsAreaChart";
import RechartsRankingChart from "../../../components/charts/RechartsRankingChart";
import Button from "../../../components/common/Button";
import {
  assignmentTrendSeries,
  vehicleAssignmentFormatter,
  vehicleCountFormatter,
} from "./vehicleTrackingReportView.config";

export default function VehicleTrackingMobileView({
  assignments,
  boardDate,
  changePage,
  charts,
  copy,
  isFetching,
  isLoading,
  metrics,
  page,
  pagination,
  summary,
}) {
  return (
    <div className="d-md-none trip-performance-mobile">
      <div className="container-xl">
        <div className="trip-performance-mobile__screen">
          <section className="trip-performance-mobile__hero">
            <div className="trip-performance-mobile__hero-top">
              <div>
                <div className="trip-performance-mobile__eyebrow">/admin/vehicletrackingreport</div>
                <h2 className="trip-performance-mobile__title">{copy.pageTitle}</h2>
                <p className="trip-performance-mobile__subtitle">{copy.pageSubtitle}</p>
              </div>
              <span className="trip-performance-mobile__date">{boardDate}</span>
            </div>

            <div className="trip-performance-mobile__spotlight">
              <div>
                <div className="trip-performance-mobile__spotlight-label">Most used vehicle</div>
                <div className="trip-performance-mobile__spotlight-value">
                  {summary.busiestVehicleName ?? "Not available"}
                </div>
                <div className="trip-performance-mobile__spotlight-meta">
                  {summary.busiestVehicleCountLabel ?? "0"} assignments on the current page
                </div>
              </div>
              <div className="trip-performance-mobile__spotlight-stack">
                <span>{summary.uniqueVehiclesLabel ?? "0"} vehicles</span>
                <span>{summary.activeDaysLabel ?? "0"} days</span>
              </div>
            </div>

            <div className="trip-performance-mobile__metric-grid">
              {metrics.map((metric) => (
                <article key={metric.id} className="trip-performance-mobile__metric">
                  <div className="trip-performance-mobile__metric-label">{metric.label}</div>
                  <div className="trip-performance-mobile__metric-value">{metric.value}</div>
                  <div className="trip-performance-mobile__metric-meta">{metric.change}</div>
                </article>
              ))}
            </div>
          </section>

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Assignment trend</div>
                <div className="trip-performance-mobile__card-subtle">
                  Departure-date volume for visible vehicle usage
                </div>
              </div>
            </div>

            <RechartsAreaChart
              data={charts.startDateTrend ?? []}
              series={assignmentTrendSeries}
              height={220}
              labelKey="label"
              valueFormatter={vehicleCountFormatter}
            />
          </section>

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Vehicle usage leaders</div>
                <div className="trip-performance-mobile__card-subtle">
                  Vehicles with the highest assignment count
                </div>
              </div>
            </div>

            <RechartsRankingChart
              items={charts.vehicleRanking ?? []}
              labelKey="label"
              valueKey="value"
              height={250}
              tooltipLabel="Assignments"
              valueFormatter={vehicleAssignmentFormatter}
              getCellColor={(entry) => (Number(entry.value) > 1 ? "#22c55e" : "#38bdf8")}
            />
          </section>

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Vehicle ledger</div>
                <div className="trip-performance-mobile__card-subtle">
                  Showing {pagination.from ?? 0}-{pagination.to ?? 0} of {pagination.total ?? 0}
                </div>
              </div>
              <div className="trip-performance-mobile__pill">
                Page {pagination.currentPage ?? 1}/{pagination.lastPage ?? 1}
              </div>
            </div>

            <div className="trip-performance-mobile__list">
              {assignments.length ? (
                assignments.map((assignment) => (
                  <article key={assignment.id} className="trip-performance-mobile__item">
                    <div className="trip-performance-mobile__item-top">
                      <div>
                        <div className="trip-performance-mobile__item-title">{assignment.vehicleName}</div>
                        <div className="trip-performance-mobile__item-meta">{assignment.tripName}</div>
                      </div>
                      <div className="trip-performance-mobile__item-profit">
                        {assignment.durationLabel}
                      </div>
                    </div>
                    <div className="trip-performance-mobile__item-grid">
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">
                          {assignment.shortStartLabel}
                        </div>
                        <div className="trip-performance-mobile__item-grid-label">Start</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">
                          {assignment.departureAt}
                        </div>
                        <div className="trip-performance-mobile__item-grid-label">Departure</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{assignment.arrivalAt}</div>
                        <div className="trip-performance-mobile__item-grid-label">Arrival</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">
                          #{assignment.vehicleId}
                        </div>
                        <div className="trip-performance-mobile__item-grid-label">Vehicle ID</div>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="trip-performance-mobile__empty">
                  {isLoading ? "Loading vehicle tracking..." : "No vehicle tracking data available."}
                </div>
              )}
            </div>

            <div className="trip-performance-mobile__pager">
              <Button
                variant="outline"
                fullWidthOnMobile
                disabled={!pagination.hasPrev || isFetching}
                onClick={() => changePage(page - 1)}
              >
                Previous
              </Button>
              <Button
                fullWidthOnMobile
                disabled={!pagination.hasNext || isFetching}
                onClick={() => changePage(page + 1)}
              >
                Next
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
