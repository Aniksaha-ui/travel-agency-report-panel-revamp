import { Link } from "react-router-dom";
import SearchField from "../../../components/forms/SearchField";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import { APP_ROUTES } from "../../../constants/routes";
import MetricsOverview from "../../dashboard/components/MetricsOverview";
import { getGuideColumns } from "./guidesView.config";

export default function GuidesDesktopView({
  boardDate,
  copy,
  error,
  guides,
  handleSearchChange,
  isLoading,
  metrics,
  onEditGuide,
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
              <span className="trip-performance-hero__eyebrow">/admin/guide</span>
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
                <span className="trip-performance-hero__meta-label">Rated guides</span>
                <strong>{summary.ratedGuidesLabel ?? "0"}</strong>
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
          {error ? (
            <section className="dashboard-section">
              <Card title="Guide roster unavailable" className="trip-performance-card border-0">
                <div className="text-danger">
                  {error.message || "Unable to load guide information."}
                </div>
              </Card>
            </section>
          ) : null}

          <section className="dashboard-section">
            <MetricsOverview metrics={metrics} />
          </section>

          <section className="dashboard-section">
            <Card
              title="Guide ledger"
              subtitle="Review the current guide roster, contact details, ratings, and profile readiness."
              className="trip-performance-card border-0"
              bodyClassName="p-0"
              footer={tableFooter}
              actions={
                <div className="d-flex align-items-center gap-2">
                  <SearchField
                    placeholder="Search guides"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <Link to={APP_ROUTES.guideCreate} className="btn btn-primary">
                    Add new
                  </Link>
                </div>
              }
            >
              {isLoading && !guides.length ? (
                <div className="p-4 text-center text-secondary">Loading guides...</div>
              ) : (
                <Table
                  columns={getGuideColumns({ onEditGuide })}
                  data={guides}
                  emptyTitle="No guides found"
                  emptyDescription="No guide rows matched the current search."
                />
              )}
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
