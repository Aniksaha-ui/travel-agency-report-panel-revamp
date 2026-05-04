import SearchField from "../../../components/forms/SearchField";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import MetricsOverview from "../../dashboard/components/MetricsOverview";
import { getRouteColumns } from "./routesView.config";

export default function RoutesDesktopView({
  boardDate,
  copy,
  handleSearchChange,
  isLoading,
  metrics,
  onViewDetails,
  pagination,
  routes,
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
              <span className="trip-performance-hero__eyebrow">/admin/routes</span>
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
                <span className="trip-performance-hero__meta-label">Origins</span>
                <strong>{summary.uniqueOriginsLabel ?? "0"}</strong>
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
              title="Route ledger"
              subtitle="Origins, destinations, route names, and quick access to the full route payload."
              className="trip-performance-card border-0"
              bodyClassName="p-0"
              footer={tableFooter}
              actions={
                <SearchField
                  placeholder="Search routes"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              }
            >
              {isLoading && !routes.length ? (
                <div className="p-4 text-center text-secondary">Loading routes...</div>
              ) : (
                <Table
                  columns={getRouteColumns(onViewDetails)}
                  data={routes}
                  emptyTitle="No routes found"
                  emptyDescription="No route rows matched the current search."
                />
              )}
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
