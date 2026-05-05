import { Link } from "react-router-dom";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import SearchField from "../../../components/forms/SearchField";
import { APP_ROUTES } from "../../../constants/routes";
import MetricsOverview from "../../dashboard/components/MetricsOverview";
import { tripColumns } from "./tripsView.config";

export default function TripsDesktopView({
  boardDate,
  copy,
  isLoading,
  metrics,
  pagination,
  searchTerm,
  handleSearchChange,
  summary,
  tableFooter,
  trips,
}) {
  return (
    <div className="d-none d-md-block">
      <div className="page-header d-print-none trip-performance-page-header">
        <div className="container-xl">
          <div className="trip-performance-hero">
            <div className="trip-performance-hero__copy">
              <span className="trip-performance-hero__eyebrow">/admin/trips</span>
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
                <span className="trip-performance-hero__meta-label">Visible fares</span>
                <strong>{summary.totalVisibleRevenueLabel ?? "BDT 0"}</strong>
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
              title="Trip ledger"
              subtitle="Trip names, route assignments, schedule windows, activation status, and fare values."
              className="trip-performance-card border-0"
              bodyClassName="p-0"
              footer={tableFooter}
              actions={
                <div className="d-flex flex-column flex-lg-row gap-2">
                  <SearchField
                    placeholder="Search trips"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <Link to={APP_ROUTES.tripCreate} className="btn btn-primary">
                    Add trip
                  </Link>
                </div>
              }
            >
              {isLoading && !trips.length ? (
                <div className="p-4 text-center text-secondary">Loading trips...</div>
              ) : (
                <Table
                  columns={tripColumns}
                  data={trips}
                  emptyTitle="No trips found"
                  emptyDescription="No trip rows matched the current search."
                />
              )}
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
