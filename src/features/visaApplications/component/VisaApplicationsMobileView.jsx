import Badge from "../../../components/common/Badge";
import Button from "../../../components/common/Button";
import SearchField from "../../../components/forms/SearchField";
import {
  getPaymentStatusColor,
  getVisaStatusColor,
} from "../constants/visaApplications.constants";

export default function VisaApplicationsMobileView({
  applications,
  boardDate,
  changePage,
  copy,
  handleSearchChange,
  isFetching,
  isLoading,
  metrics,
  onViewApplication,
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
                <div className="trip-performance-mobile__eyebrow">/admin/visa/applications</div>
                <h2 className="trip-performance-mobile__title">{copy.pageTitle}</h2>
                <p className="trip-performance-mobile__subtitle">{copy.pageSubtitle}</p>
              </div>
              <span className="trip-performance-mobile__date">{boardDate}</span>
            </div>

            <div className="trip-performance-mobile__spotlight">
              <div>
                <div className="trip-performance-mobile__spotlight-label">Review spotlight</div>
                <div className="trip-performance-mobile__spotlight-value">
                  {summary.spotlightApplication?.applicationNo ?? "No applications available"}
                </div>
                <div className="trip-performance-mobile__spotlight-meta">
                  {summary.spotlightApplication
                    ? `${summary.spotlightApplication.fullName} • ${summary.spotlightApplication.countryName}`
                    : "Waiting for application data"}
                </div>
              </div>
              <div className="trip-performance-mobile__spotlight-stack">
                <span>{summary.pendingReviewApplicationsLabel ?? "0"} pending</span>
                <span>{summary.approvedApplicationsLabel ?? "0"} approved</span>
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
                <div className="trip-performance-mobile__card-title">Application review queue</div>
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
                placeholder="Search application number, applicant, package, or passport"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <div className="trip-performance-mobile__list">
              {applications.length ? (
                applications.map((application) => (
                  <article key={application.id} className="trip-performance-mobile__item">
                    <div className="trip-performance-mobile__item-top">
                      <div>
                        <div className="trip-performance-mobile__item-title">
                          {application.applicationNo}
                        </div>
                        <div className="trip-performance-mobile__item-meta">
                          {application.fullName} • {application.countryName}
                        </div>
                      </div>
                      <div className="trip-performance-mobile__item-profit">
                        {application.createdAtLabel}
                      </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
                      <div className="text-secondary small">{application.packageTitle}</div>
                      <div className="d-flex gap-2">
                        <Badge color={getVisaStatusColor(application.status)}>
                          {application.statusLabel}
                        </Badge>
                        <Badge color={getPaymentStatusColor(application.paymentStatus)}>
                          {application.paymentStatusLabel}
                        </Badge>
                      </div>
                    </div>

                    <div className="trip-performance-mobile__item-grid">
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{application.passportNo}</div>
                        <div className="trip-performance-mobile__item-grid-label">Passport</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">
                          {application.assignedOfficerName}
                        </div>
                        <div className="trip-performance-mobile__item-grid-label">Officer</div>
                      </div>
                    </div>

                    <div className="d-flex gap-2 mt-3">
                      <Button fullWidthOnMobile onClick={() => onViewApplication(application)}>
                        View details
                      </Button>
                    </div>
                  </article>
                ))
              ) : (
                <div className="trip-performance-mobile__empty">
                  {isLoading ? "Loading visa applications..." : "No applications matched the current filter."}
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
