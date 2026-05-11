import { Link } from "react-router-dom";
import Badge from "../../../components/common/Badge";
import Button from "../../../components/common/Button";
import SearchField from "../../../components/forms/SearchField";
import { APP_ROUTES, getVisaCountryEditRoute } from "../../../constants/routes";

export default function VisaCountriesMobileView({
  boardDate,
  changePage,
  copy,
  countries,
  handleSearchChange,
  isFetching,
  isLoading,
  metrics,
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
                <div className="trip-performance-mobile__eyebrow">/admin/visa/countries</div>
                <h2 className="trip-performance-mobile__title">{copy.pageTitle}</h2>
                <p className="trip-performance-mobile__subtitle">{copy.pageSubtitle}</p>
              </div>
              <span className="trip-performance-mobile__date">{boardDate}</span>
            </div>

            <div className="trip-performance-mobile__spotlight">
              <div>
                <div className="trip-performance-mobile__spotlight-label">Spotlight country</div>
                <div className="trip-performance-mobile__spotlight-value">
                  {summary.spotlightCountry?.name ?? "No countries available"}
                </div>
                <div className="trip-performance-mobile__spotlight-meta">
                  {summary.spotlightCountry
                    ? `${summary.spotlightCountry.isoCode || "N/A"} • ${summary.spotlightCountry.nationalityName}`
                    : "Waiting for country data"}
                </div>
              </div>
              <div className="trip-performance-mobile__spotlight-stack">
                <span>{summary.activeCountriesLabel ?? "0"} active</span>
                <span>{summary.popularCountriesLabel ?? "0"} popular</span>
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
                <div className="trip-performance-mobile__card-title">Country registry</div>
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
                placeholder="Search countries or ISO codes"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Link to={APP_ROUTES.visaCountryCreate} className="btn btn-primary">
                Add country
              </Link>
            </div>

            <div className="trip-performance-mobile__list">
              {countries.length ? (
                countries.map((country) => (
                  <article key={country.id} className="trip-performance-mobile__item">
                    <div className="trip-performance-mobile__item-top">
                      <div>
                        <div className="trip-performance-mobile__item-title">{country.name}</div>
                        <div className="trip-performance-mobile__item-meta">
                          {country.isoCode || "N/A"} • {country.nationalityName}
                        </div>
                      </div>
                      <div className="trip-performance-mobile__item-profit">
                        #{country.displayOrderLabel}
                      </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
                      <div className="text-secondary small">Updated {country.updatedAtLabel}</div>
                      <div className="d-flex gap-2">
                        <Badge color={country.isActive ? "success" : "neutral"}>
                          {country.statusLabel}
                        </Badge>
                        {country.isPopular ? <Badge color="warning">Popular</Badge> : null}
                      </div>
                    </div>

                    <div className="d-flex gap-2 mt-3">
                      <Link
                        to={getVisaCountryEditRoute(country.countryId)}
                        state={{ country }}
                        className="btn btn-outline-primary btn-mobile-full"
                      >
                        Edit
                      </Link>
                    </div>
                  </article>
                ))
              ) : (
                <div className="trip-performance-mobile__empty">
                  {isLoading ? "Loading visa countries..." : "No countries matched the current filter."}
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
