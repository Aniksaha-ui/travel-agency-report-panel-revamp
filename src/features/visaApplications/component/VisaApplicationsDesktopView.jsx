import SearchField from "../../../components/forms/SearchField";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import MetricsOverview from "../../dashboard/components/MetricsOverview";
import { getVisaApplicationColumns } from "./visaApplicationsView.config";

export default function VisaApplicationsDesktopView({
  applications,
  boardDate,
  copy,
  handleSearchChange,
  isLoading,
  metrics,
  onViewApplication,
  pagination,
  searchTerm,
  summary,
  tableFooter,
}) {
  return (
    <div className="d-none d-md-block">
      <div className="page-header d-print-none trip-performance-page-header">
        <div className="container-xl">
          <div className="trip-performance-hero">
            <div className="trip-performance-hero__copy">
              <span className="trip-performance-hero__eyebrow">/admin/visa/applications</span>
              <h2 className="page-title">{copy.pageTitle}</h2>
              <p className="text-secondary mb-0">{copy.pageSubtitle}</p>
            </div>

            <div className="trip-performance-hero__meta">
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Showing</span>
                <strong>
                  {pagination.from ?? 0}-{pagination.to ?? 0} of {pagination.total ?? 0}
                </strong>
              </div>
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Pending review</span>
                <strong>{summary.pendingReviewApplicationsLabel ?? "0"}</strong>
              </div>
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Board date</span>
                <strong>{boardDate}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          <section className="dashboard-section">
            <MetricsOverview metrics={metrics} />
          </section>

          <section className="dashboard-section">
            <Card
              title="Application review queue"
              subtitle="Search submissions, inspect assignment and payment state, and open the full visa application review workflow."
              className="trip-performance-card border-0"
              bodyClassName="p-0"
              footer={tableFooter}
              actions={
                <SearchField
                  placeholder="Search application number, applicant, package, or passport"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              }
            >
              {isLoading && !applications.length ? (
                <div className="p-4 text-center text-secondary">Loading visa applications...</div>
              ) : (
                <Table
                  columns={getVisaApplicationColumns(onViewApplication)}
                  data={applications}
                  emptyTitle="No visa applications found"
                  emptyDescription="No visa application rows matched the current filter."
                />
              )}
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
