import { Link } from "react-router-dom";
import Badge from "../../../components/common/Badge";
import Button from "../../../components/common/Button";
import SearchField from "../../../components/forms/SearchField";
import { APP_ROUTES, getVisaTypeEditRoute } from "../../../constants/routes";

export default function VisaTypesMobileView({
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
  visaTypes,
}) {
  return (
    <div className="d-md-none trip-performance-mobile">
      <div className="container-xl">
        <div className="trip-performance-mobile__screen">
          <section className="trip-performance-mobile__hero">
            <div className="trip-performance-mobile__hero-top">
              <div>
                <div className="trip-performance-mobile__eyebrow">/admin/visa/types</div>
                <h2 className="trip-performance-mobile__title">{copy.pageTitle}</h2>
                <p className="trip-performance-mobile__subtitle">{copy.pageSubtitle}</p>
              </div>
              <span className="trip-performance-mobile__date">{boardDate}</span>
            </div>

            <div className="trip-performance-mobile__spotlight">
              <div>
                <div className="trip-performance-mobile__spotlight-label">Spotlight visa type</div>
                <div className="trip-performance-mobile__spotlight-value">
                  {summary.spotlightVisaType?.visaName ?? "No visa types available"}
                </div>
                <div className="trip-performance-mobile__spotlight-meta">
                  {summary.spotlightVisaType
                    ? `${summary.spotlightVisaType.countryName} • ${summary.spotlightVisaType.processingDaysLabel}`
                    : "Waiting for visa type data"}
                </div>
              </div>
              <div className="trip-performance-mobile__spotlight-stack">
                <span>{summary.distinctCountriesLabel ?? "0"} countries</span>
                <span>{summary.averageFeeLabel ?? "0.00"} avg fee</span>
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
                <div className="trip-performance-mobile__card-title">Visa type registry</div>
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
                placeholder="Search visa types, countries, or titles"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Link to={APP_ROUTES.visaTypeCreate} className="btn btn-primary">
                Add visa type
              </Link>
            </div>

            <div className="trip-performance-mobile__list">
              {visaTypes.length ? (
                visaTypes.map((visaType) => (
                  <article key={visaType.id} className="trip-performance-mobile__item">
                    <div className="trip-performance-mobile__item-top">
                      <div>
                        <div className="trip-performance-mobile__item-title">{visaType.visaName}</div>
                        <div className="trip-performance-mobile__item-meta">{visaType.countryName}</div>
                      </div>
                      <div className="trip-performance-mobile__item-profit">{visaType.feeLabel}</div>
                    </div>

                    <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
                      <div className="text-secondary small">{visaType.processingDaysLabel}</div>
                      <Badge color={visaType.isActive ? "success" : "neutral"}>
                        {visaType.statusLabel}
                      </Badge>
                    </div>

                    <div className="trip-performance-mobile__item-grid">
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{visaType.title}</div>
                        <div className="trip-performance-mobile__item-grid-label">Title</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{visaType.entryType}</div>
                        <div className="trip-performance-mobile__item-grid-label">Entry</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">
                          {visaType.updatedAtLabel}
                        </div>
                        <div className="trip-performance-mobile__item-grid-label">Updated</div>
                      </div>
                    </div>

                    <div className="d-flex gap-2 mt-3">
                      <Link
                        to={getVisaTypeEditRoute(visaType.visaTypeId)}
                        state={{ visaType }}
                        className="btn btn-outline-primary btn-mobile-full"
                      >
                        Edit
                      </Link>
                    </div>
                  </article>
                ))
              ) : (
                <div className="trip-performance-mobile__empty">
                  {isLoading ? "Loading visa types..." : "No visa types matched the current filter."}
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
