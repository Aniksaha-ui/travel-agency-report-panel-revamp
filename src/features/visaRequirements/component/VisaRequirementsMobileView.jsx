import { Link } from "react-router-dom";
import Badge from "../../../components/common/Badge";
import Button from "../../../components/common/Button";
import SearchField from "../../../components/forms/SearchField";
import { APP_ROUTES, getVisaRequirementEditRoute } from "../../../constants/routes";

export default function VisaRequirementsMobileView({
  boardDate,
  changePage,
  copy,
  handleSearchChange,
  isFetching,
  isLoading,
  metrics,
  page,
  pagination,
  requirements,
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
                <div className="trip-performance-mobile__eyebrow">/admin/visa/requirements</div>
                <h2 className="trip-performance-mobile__title">{copy.pageTitle}</h2>
                <p className="trip-performance-mobile__subtitle">{copy.pageSubtitle}</p>
              </div>
              <span className="trip-performance-mobile__date">{boardDate}</span>
            </div>

            <div className="trip-performance-mobile__spotlight">
              <div>
                <div className="trip-performance-mobile__spotlight-label">Spotlight document</div>
                <div className="trip-performance-mobile__spotlight-value">
                  {summary.spotlightRequirement?.documentName ?? "No requirements available"}
                </div>
                <div className="trip-performance-mobile__spotlight-meta">
                  {summary.spotlightRequirement
                    ? `${summary.spotlightRequirement.countryName} • ${summary.spotlightRequirement.visaName}`
                    : "Waiting for requirement data"}
                </div>
              </div>
              <div className="trip-performance-mobile__spotlight-stack">
                <span>{summary.requiredDocumentsLabel ?? "0"} required</span>
                <span>{summary.multiUploadDocumentsLabel ?? "0"} multi-upload</span>
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
                <div className="trip-performance-mobile__card-title">Requirement registry</div>
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
                placeholder="Search documents, countries, or visa types"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Link to={APP_ROUTES.visaRequirementCreate} className="btn btn-primary">
                Add requirement
              </Link>
            </div>

            <div className="trip-performance-mobile__list">
              {requirements.length ? (
                requirements.map((requirement) => (
                  <article key={requirement.id} className="trip-performance-mobile__item">
                    <div className="trip-performance-mobile__item-top">
                      <div>
                        <div className="trip-performance-mobile__item-title">{requirement.documentName}</div>
                        <div className="trip-performance-mobile__item-meta">{requirement.countryName}</div>
                      </div>
                      <div className="trip-performance-mobile__item-profit">#{requirement.sortOrderLabel}</div>
                    </div>

                    <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
                      <div className="text-secondary small">{requirement.visaName}</div>
                      <div className="d-flex gap-2">
                        <Badge color={requirement.isRequired ? "success" : "neutral"}>
                          {requirement.requiredLabel}
                        </Badge>
                        <Badge color={requirement.allowMultiple ? "info" : "warning"}>
                          {requirement.multipleLabel}
                        </Badge>
                      </div>
                    </div>

                    <div className="trip-performance-mobile__item-grid">
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">
                          {requirement.instructions.length > 52
                            ? `${requirement.instructions.slice(0, 52)}...`
                            : requirement.instructions}
                        </div>
                        <div className="trip-performance-mobile__item-grid-label">Instructions</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">
                          {requirement.updatedAtLabel}
                        </div>
                        <div className="trip-performance-mobile__item-grid-label">Updated</div>
                      </div>
                    </div>

                    <div className="d-flex gap-2 mt-3">
                      <Link
                        to={getVisaRequirementEditRoute(requirement.requirementId)}
                        state={{ requirement }}
                        className="btn btn-outline-primary btn-mobile-full"
                      >
                        Edit
                      </Link>
                    </div>
                  </article>
                ))
              ) : (
                <div className="trip-performance-mobile__empty">
                  {isLoading ? "Loading visa requirements..." : "No requirements matched the current filter."}
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
