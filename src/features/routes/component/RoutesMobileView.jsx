import Button from "../../../components/common/Button";
import ViewIcon from "../../../components/common/ViewIcon";
import SearchField from "../../../components/forms/SearchField";

export default function RoutesMobileView({
  boardDate,
  changePage,
  copy,
  handleSearchChange,
  isFetching,
  isLoading,
  metrics,
  onViewDetails,
  page,
  pagination,
  routes,
  searchTerm,
  summary,
}) {
  return (
    <div className="d-md-none trip-performance-mobile">
      <div className="container-xl">
        <div className="trip-performance-mobile__screen">
          <section className="trip-performance-mobile__hero">
            <div className="trip-performance-mobile__hero-top">
              <div>
                <div className="trip-performance-mobile__eyebrow">/admin/routes</div>
                <h2 className="trip-performance-mobile__title">{copy.pageTitle}</h2>
                <p className="trip-performance-mobile__subtitle">{copy.pageSubtitle}</p>
              </div>
              <span className="trip-performance-mobile__date">{boardDate}</span>
            </div>

            <div className="trip-performance-mobile__spotlight">
              <div>
                <div className="trip-performance-mobile__spotlight-label">Lead route</div>
                <div className="trip-performance-mobile__spotlight-value">
                  {summary.spotlightRoute?.routeName ?? "No routes available"}
                </div>
                <div className="trip-performance-mobile__spotlight-meta">
                  {summary.spotlightRoute
                    ? `${summary.spotlightRoute.origin} to ${summary.spotlightRoute.destination}`
                    : "Waiting for route data"}
                </div>
              </div>
              <div className="trip-performance-mobile__spotlight-stack">
                <span>{summary.uniqueOriginsLabel ?? "0"} origins</span>
                <span>{summary.uniqueDestinationsLabel ?? "0"} destinations</span>
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
                <div className="trip-performance-mobile__card-title">Route ledger</div>
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
                placeholder="Search routes"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <div className="trip-performance-mobile__list">
              {routes.length ? (
                routes.map((route) => (
                  <article key={route.id} className="trip-performance-mobile__item">
                    <div className="trip-performance-mobile__item-top">
                      <div>
                        <div className="trip-performance-mobile__item-title">{route.routeName}</div>
                        <div className="trip-performance-mobile__item-meta">Route ID #{route.routeId}</div>
                      </div>
                    </div>
                    <div className="trip-performance-mobile__item-grid">
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{route.origin}</div>
                        <div className="trip-performance-mobile__item-grid-label">Origin</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{route.destination}</div>
                        <div className="trip-performance-mobile__item-grid-label">Destination</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{route.updatedAtLabel}</div>
                        <div className="trip-performance-mobile__item-grid-label">Updated</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{route.createdAtLabel}</div>
                        <div className="trip-performance-mobile__item-grid-label">Created</div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Button
                        variant="outline"
                        className="btn-icon"
                        aria-label={`View ${route.routeName}`}
                        title={`View ${route.routeName}`}
                        icon={<ViewIcon />}
                        onClick={() => onViewDetails(route.routeId)}
                      />
                    </div>
                  </article>
                ))
              ) : (
                <div className="trip-performance-mobile__empty">
                  {isLoading ? "Loading routes..." : "No routes matched the current search."}
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
