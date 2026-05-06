import { Link } from "react-router-dom";
import Badge from "../../../components/common/Badge";
import Button from "../../../components/common/Button";
import { APP_ROUTES } from "../../../constants/routes";

export default function GuidesMobileView({
  boardDate,
  changePage,
  copy,
  error,
  guides,
  handleSearchChange,
  isFetching,
  isLoading,
  metrics,
  onEditGuide,
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
                <div className="trip-performance-mobile__eyebrow">/admin/guide</div>
                <h2 className="trip-performance-mobile__title">{copy.pageTitle}</h2>
                <p className="trip-performance-mobile__subtitle">{copy.pageSubtitle}</p>
              </div>
              <span className="trip-performance-mobile__date">{boardDate}</span>
            </div>

            <div className="trip-performance-mobile__spotlight">
              <div>
                <div className="trip-performance-mobile__spotlight-label">Top rated guide</div>
                <div className="trip-performance-mobile__spotlight-value">
                  {summary.topRatedGuide?.ratingLabel ?? "Unrated"}
                </div>
                <div className="trip-performance-mobile__spotlight-meta">
                  {summary.topRatedGuide?.name ?? "No guide ratings available yet."}
                </div>
              </div>
              <div className="trip-performance-mobile__spotlight-stack">
                <span>{summary.totalGuidesLabel ?? "0"} total</span>
                <span>{summary.completeProfilesLabel ?? "0"} complete</span>
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

          {error ? (
            <section className="trip-performance-mobile__card">
              <div className="text-danger">
                {error.message || "Unable to load guide information."}
              </div>
            </section>
          ) : null}

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Guide roster</div>
                <div className="trip-performance-mobile__card-subtle">
                  Search and update the guide list from mobile
                </div>
              </div>
              <Link to={APP_ROUTES.guideCreate} className="btn btn-primary btn-sm">
                Add new
              </Link>
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
                placeholder="Search guides"
                aria-label="Search guides"
              />
            </div>

            <div className="trip-performance-mobile__list">
              {guides.length ? (
                guides.map((guide) => (
                  <article key={guide.id} className="trip-performance-mobile__item">
                    <div className="trip-performance-mobile__item-top">
                      <div>
                        <div className="trip-performance-mobile__item-title">{guide.name}</div>
                        <div className="trip-performance-mobile__item-meta">
                          #{guide.guideId} • {guide.email}
                        </div>
                      </div>
                      <Badge color={guide.signalTone}>{guide.ratingLabel}</Badge>
                    </div>

                    <div className="trip-performance-mobile__item-grid">
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{guide.phone}</div>
                        <div className="trip-performance-mobile__item-grid-label">Phone</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">
                          {guide.signalLabel}
                        </div>
                        <div className="trip-performance-mobile__item-grid-label">Signal</div>
                      </div>
                    </div>

                    <div className="text-secondary small mb-3">{guide.bioPreview}</div>

                    <Button fullWidthOnMobile variant="outline" onClick={() => onEditGuide(guide)}>
                      Edit guide
                    </Button>
                  </article>
                ))
              ) : (
                <div className="trip-performance-mobile__empty">
                  {isLoading ? "Loading guides..." : "No guide rows available."}
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
