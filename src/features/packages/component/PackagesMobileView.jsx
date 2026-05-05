import { Link } from "react-router-dom";
import Badge from "../../../components/common/Badge";
import Button from "../../../components/common/Button";
import SearchField from "../../../components/forms/SearchField";
import { APP_ROUTES } from "../../../constants/routes";

const COVERAGE_TONE_MAP = {
  Meal: "warning",
  Hotel: "info",
  Bus: "success",
};

export default function PackagesMobileView({
  boardDate,
  changePage,
  copy,
  handleSearchChange,
  isFetching,
  isLoading,
  metrics,
  onViewDetails,
  packages,
  page,
  pagination,
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
                <div className="trip-performance-mobile__eyebrow">/admin/packages</div>
                <h2 className="trip-performance-mobile__title">{copy.pageTitle}</h2>
                <p className="trip-performance-mobile__subtitle">{copy.pageSubtitle}</p>
              </div>
              <span className="trip-performance-mobile__date">{boardDate}</span>
            </div>

            <div className="trip-performance-mobile__spotlight">
              <div>
                <div className="trip-performance-mobile__spotlight-label">Lead package</div>
                <div className="trip-performance-mobile__spotlight-value">
                  {summary.spotlightPackage?.name ?? "No packages available"}
                </div>
                <div className="trip-performance-mobile__spotlight-meta">
                  {summary.spotlightPackage?.tripName ?? "Waiting for package data"}
                </div>
              </div>
              <div className="trip-performance-mobile__spotlight-stack">
                <span>{summary.mealIncludedCountLabel ?? "0"} meals</span>
                <span>{summary.hotelIncludedCountLabel ?? "0"} hotels</span>
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
                <div className="trip-performance-mobile__card-title">Package ledger</div>
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
                placeholder="Filter loaded packages"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Link to={APP_ROUTES.packageCreate} className="btn btn-primary">
                Add package
              </Link>
            </div>

            <div className="trip-performance-mobile__list">
              {packages.length ? (
                packages.map((pkg) => (
                  <article key={pkg.id} className="trip-performance-mobile__item">
                    <div className="trip-performance-mobile__item-top">
                      <div>
                        <div className="trip-performance-mobile__item-title">{pkg.name}</div>
                        <div className="trip-performance-mobile__item-meta">{pkg.tripName}</div>
                      </div>
                      <div className="trip-performance-mobile__item-profit">#{pkg.packageId}</div>
                    </div>

                    <div className="d-flex flex-wrap gap-1 mb-3">
                      {pkg.coverageItems.length ? (
                        pkg.coverageItems.map((item) => (
                          <Badge key={item} color={COVERAGE_TONE_MAP[item] || "neutral"}>
                            {item}
                          </Badge>
                        ))
                      ) : (
                        <Badge color="neutral">Custom</Badge>
                      )}
                    </div>

                    <div className="trip-performance-mobile__item-grid">
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{pkg.createdAtLabel}</div>
                        <div className="trip-performance-mobile__item-grid-label">Created</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{pkg.updatedAtLabel}</div>
                        <div className="trip-performance-mobile__item-grid-label">Updated</div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <Button fullWidthOnMobile variant="outline" onClick={() => onViewDetails(pkg.packageId)}>
                        View details
                      </Button>
                    </div>
                  </article>
                ))
              ) : (
                <div className="trip-performance-mobile__empty">
                  {isLoading ? "Loading packages..." : "No packages matched the current filter."}
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
