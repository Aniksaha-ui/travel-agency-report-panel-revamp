import RechartsAreaChart from "../../../components/charts/RechartsAreaChart";
import RechartsBarChart from "../../../components/charts/RechartsBarChart";
import Button from "../../../components/common/Button";
import {
  compactRevenueFormatter,
  renderOccupancy,
  revenueTrendSeries,
  seatCompositionSegments,
} from "./tripPerformanceView.config";

export default function TripPerformanceMobileView({
  boardDate,
  changePage,
  charts,
  copy,
  handleSearchChange,
  isFetching,
  isLoading,
  metrics,
  page,
  pagination,
  searchTerm,
  summary,
  topTrip,
  trips,
}) {
  return (
    <div className="d-md-none trip-performance-mobile">
      <div className="container-xl">
        <div className="trip-performance-mobile__screen">
          <section className="trip-performance-mobile__hero">
            <div className="trip-performance-mobile__hero-top">
              <div>
                <div className="trip-performance-mobile__eyebrow">/admin/tripPerformance</div>
                <h2 className="trip-performance-mobile__title">{copy.pageTitle}</h2>
                <p className="trip-performance-mobile__subtitle">{copy.pageSubtitle}</p>
              </div>
              <span className="trip-performance-mobile__date">{boardDate}</span>
            </div>

            <div className="trip-performance-mobile__spotlight">
              <div>
                <div className="trip-performance-mobile__spotlight-label">Top profit trip</div>
                <div className="trip-performance-mobile__spotlight-value">
                  {topTrip?.totalProfitLabel ?? "BDT 0"}
                </div>
                <div className="trip-performance-mobile__spotlight-meta">
                  {topTrip?.tripName ?? "No trip performance records yet."}
                </div>
              </div>
              <div className="trip-performance-mobile__spotlight-stack">
                <span>{summary.visibleUtilizationLabel ?? "0%"} full</span>
                <span>{summary.visibleBookedSeatsLabel ?? "0"} booked</span>
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
                <div className="trip-performance-mobile__card-title">Revenue vs profit</div>
                <div className="trip-performance-mobile__card-subtle">
                  Trend across the visible trip list
                </div>
              </div>
            </div>

            <RechartsAreaChart
              data={charts.revenueTrend ?? []}
              series={revenueTrendSeries}
              height={210}
              labelKey="label"
              valueFormatter={compactRevenueFormatter}
            />
          </section>

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Seat composition</div>
                <div className="trip-performance-mobile__card-subtle">
                  Booked and available seats for top revenue trips
                </div>
              </div>
            </div>

            <RechartsBarChart
              items={charts.seatComposition ?? []}
              segments={seatCompositionSegments}
              labelKey="label"
              height={250}
            />
          </section>

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Trip ledger</div>
                <div className="trip-performance-mobile__card-subtle">
                  Showing {pagination.from ?? 0}-{pagination.to ?? 0} of {pagination.total ?? 0}
                </div>
              </div>
              <div className="trip-performance-mobile__pill">
                Page {pagination.currentPage ?? 1}/{pagination.lastPage ?? 1}
              </div>
            </div>

            <div className="trip-performance-mobile__search">
              <span className="trip-performance-mobile__search-icon" aria-hidden="true">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={18}
                  height={18}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                  <path d="M21 21l-6 -6" />
                </svg>
              </span>
              <input
                type="search"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search trips"
                aria-label="Search trips"
              />
            </div>

            <div className="trip-performance-mobile__list">
              {trips.length ? (
                trips.map((trip) => (
                  <article key={trip.id} className="trip-performance-mobile__item">
                    <div className="trip-performance-mobile__item-top">
                      <div>
                        <div className="trip-performance-mobile__item-title">{trip.tripName}</div>
                        <div className="trip-performance-mobile__item-meta">{trip.scheduleLabel}</div>
                      </div>
                      <div className="trip-performance-mobile__item-profit">{trip.totalProfitLabel}</div>
                    </div>
                    {renderOccupancy(trip)}
                    <div className="trip-performance-mobile__item-grid">
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{trip.bookedSeatsLabel}</div>
                        <div className="trip-performance-mobile__item-grid-label">Booked</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{trip.availableSeatsLabel}</div>
                        <div className="trip-performance-mobile__item-grid-label">Available</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{trip.totalRevenueLabel}</div>
                        <div className="trip-performance-mobile__item-grid-label">Revenue</div>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="trip-performance-mobile__empty">
                  {isLoading ? "Loading trip performance..." : "No trip performance data available."}
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
