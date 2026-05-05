import Button from "../../../components/common/Button";
import SearchField from "../../../components/forms/SearchField";

export default function VehiclesMobileView({
  boardDate,
  changePage,
  copy,
  handleSearchChange,
  isFetching,
  isLoading,
  metrics,
  page,
  pagination,
  searchTerm,
  summary,
  vehicles,
}) {
  return (
    <div className="d-md-none trip-performance-mobile">
      <div className="container-xl">
        <div className="trip-performance-mobile__screen">
          <section className="trip-performance-mobile__hero">
            <div className="trip-performance-mobile__hero-top">
              <div>
                <div className="trip-performance-mobile__eyebrow">/admin/vehicles</div>
                <h2 className="trip-performance-mobile__title">{copy.pageTitle}</h2>
                <p className="trip-performance-mobile__subtitle">{copy.pageSubtitle}</p>
              </div>
              <span className="trip-performance-mobile__date">{boardDate}</span>
            </div>

            <div className="trip-performance-mobile__spotlight">
              <div>
                <div className="trip-performance-mobile__spotlight-label">Largest visible vehicle</div>
                <div className="trip-performance-mobile__spotlight-value">
                  {summary.spotlightVehicle?.vehicleName ?? "No vehicles available"}
                </div>
                <div className="trip-performance-mobile__spotlight-meta">
                  {summary.spotlightVehicle
                    ? `${summary.spotlightVehicle.totalSeatsLabel} seats on ${summary.spotlightVehicle.routeName}`
                    : "Waiting for vehicle data"}
                </div>
              </div>
              <div className="trip-performance-mobile__spotlight-stack">
                <span>{summary.totalSeatCapacityLabel ?? "0"} seats</span>
                <span>{summary.vehicleTypeCountLabel ?? "0"} types</span>
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
                <div className="trip-performance-mobile__card-title">Vehicle ledger</div>
                <div className="trip-performance-mobile__card-subtle">
                  Showing {pagination.from ?? 0}-{pagination.to ?? 0} of {pagination.total ?? 0}
                </div>
              </div>
              <div className="trip-performance-mobile__pill">
                Page {pagination.currentPage ?? 1}/{pagination.lastPage ?? 1}
              </div>
            </div>

            <div className="mb-3">
              <SearchField
                className="trip-performance-search"
                placeholder="Search vehicles"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <div className="trip-performance-mobile__list">
              {vehicles.length ? (
                vehicles.map((vehicle) => (
                  <article key={vehicle.id} className="trip-performance-mobile__item">
                    <div className="trip-performance-mobile__item-top">
                      <div>
                        <div className="trip-performance-mobile__item-title">{vehicle.vehicleName}</div>
                        <div className="trip-performance-mobile__item-meta">
                          Vehicle ID #{vehicle.vehicleId}
                        </div>
                      </div>
                      <div className="trip-performance-mobile__item-profit">
                        {vehicle.totalSeatsLabel}
                      </div>
                    </div>

                    <div className="trip-performance-mobile__item-grid">
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{vehicle.vehicleType}</div>
                        <div className="trip-performance-mobile__item-grid-label">Type</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{vehicle.routeName}</div>
                        <div className="trip-performance-mobile__item-grid-label">Route</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">
                          {vehicle.totalSeatsLabel}
                        </div>
                        <div className="trip-performance-mobile__item-grid-label">Seats</div>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="trip-performance-mobile__empty">
                  {isLoading ? "Loading vehicles..." : "No vehicles matched the current search."}
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
