import { Link } from "react-router-dom";
import { APP_ROUTES, getTripEditRoute } from "../../../constants/routes";
import Button from "../../../components/common/Button";
import Badge from "../../../components/common/Badge";
import SearchField from "../../../components/forms/SearchField";
import { EditIcon } from "../../../components/common/ActionIcons";

export default function TripsMobileView({
  boardDate,
  changePage,
  copy,
  isFetching,
  isLoading,
  searchTerm,
  handleSearchChange,
  metrics,
  page,
  pagination,
  summary,
  trips,
}) {
  return (
    <div className="d-md-none trip-performance-mobile">
      <div className="container-xl">
        <div className="trip-performance-mobile__screen">
          <section className="trip-performance-mobile__hero">
            <div className="trip-performance-mobile__hero-top">
              <div>
                <div className="trip-performance-mobile__eyebrow">/admin/trips</div>
                <h2 className="trip-performance-mobile__title">{copy.pageTitle}</h2>
                <p className="trip-performance-mobile__subtitle">{copy.pageSubtitle}</p>
              </div>
              <span className="trip-performance-mobile__date">{boardDate}</span>
            </div>

            <div className="trip-performance-mobile__spotlight">
              <div>
                <div className="trip-performance-mobile__spotlight-label">Highest visible fare</div>
                <div className="trip-performance-mobile__spotlight-value">
                  {summary.highlightedTrip?.priceLabel ?? "BDT 0"}
                </div>
                <div className="trip-performance-mobile__spotlight-meta">
                  {summary.highlightedTrip?.tripName ?? "No trip data available"}
                </div>
              </div>
              <div className="trip-performance-mobile__spotlight-stack">
                <span>{summary.totalVisibleRevenueLabel ?? "BDT 0"} total</span>
                <span>{summary.activeTripsLabel ?? "0"} active</span>
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
                <div className="trip-performance-mobile__card-title">Trip ledger</div>
                <div className="trip-performance-mobile__card-subtle">
                  Showing {pagination.from ?? 0}-{pagination.to ?? 0} of {pagination.total ?? 0}
                </div>
              </div>
              <div className="trip-performance-mobile__pill">
                Page {pagination.currentPage ?? 1}/{pagination.lastPage ?? 1}
              </div>
            </div>

            <div className="d-grid gap-2 mb-3">
              <SearchField
                className="trip-performance-search"
                placeholder="Search trips"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Link to={APP_ROUTES.tripCreate} className="btn btn-primary">
                Add trip
              </Link>
            </div>

            <div className="trip-performance-mobile__list">
              {trips.length ? (
                trips.map((trip) => (
                  <article key={trip.id} className="trip-performance-mobile__item">
                    <div className="trip-performance-mobile__item-top">
                      <div>
                        <div className="trip-performance-mobile__item-title">{trip.tripName}</div>
                        <div className="trip-performance-mobile__item-meta">{trip.routeName}</div>
                      </div>
                      <div className="trip-performance-mobile__item-profit">{trip.priceLabel}</div>
                    </div>

                    <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
                      <div className="text-secondary small">{trip.vehicleName}</div>
                      <Badge color={trip.isActive ? "success" : "neutral"}>{trip.statusLabel}</Badge>
                    </div>

                    <div className="trip-performance-mobile__item-grid">
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{trip.departureLabel}</div>
                        <div className="trip-performance-mobile__item-grid-label">Departure</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{trip.arrivalLabel}</div>
                        <div className="trip-performance-mobile__item-grid-label">Arrival</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">#{trip.tripId}</div>
                        <div className="trip-performance-mobile__item-grid-label">Trip ID</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{trip.statusLabel}</div>
                        <div className="trip-performance-mobile__item-grid-label">Status</div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <Link
                        to={getTripEditRoute(trip.tripId)}
                        className="btn btn-outline-primary btn-icon"
                        aria-label={`Edit ${trip.tripName}`}
                        title={`Edit ${trip.tripName}`}
                      >
                        <EditIcon />
                      </Link>
                    </div>
                  </article>
                ))
              ) : (
                <div className="trip-performance-mobile__empty">
                  {isLoading ? "Loading trips..." : "No trips matched the current search."}
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
