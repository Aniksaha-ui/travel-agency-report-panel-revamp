import { Link } from "react-router-dom";
import SearchField from "../../../components/forms/SearchField";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import { APP_ROUTES } from "../../../constants/routes";
import MetricsOverview from "../../dashboard/components/MetricsOverview";
import { getVisaTypeColumns } from "./visaTypesView.config";

export default function VisaTypesDesktopView({
  boardDate,
  copy,
  handleSearchChange,
  isLoading,
  metrics,
  onEditVisaType,
  pagination,
  searchTerm,
  summary,
  tableFooter,
  visaTypes,
}) {
  return (
    <div className="d-none d-md-block">
      <div className="page-header d-print-none trip-performance-page-header">
        <div className="container-xl">
          <div className="trip-performance-hero">
            <div className="trip-performance-hero__copy">
              <span className="trip-performance-hero__eyebrow">/admin/visa/types</span>
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
                <span className="trip-performance-hero__meta-label">Average fee</span>
                <strong>{summary.averageFeeLabel ?? "0.00"}</strong>
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
              title="Visa type registry"
              subtitle="Search country-specific visa packages, compare fees and processing times, and open the legacy add and edit flow."
              className="trip-performance-card border-0"
              bodyClassName="p-0"
              footer={tableFooter}
              actions={
                <div className="d-flex flex-column flex-lg-row gap-2">
                  <SearchField
                    placeholder="Search visa types, countries, or titles"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <Link to={APP_ROUTES.visaTypeCreate} className="btn btn-primary">
                    Add visa type
                  </Link>
                </div>
              }
            >
              {isLoading && !visaTypes.length ? (
                <div className="p-4 text-center text-secondary">Loading visa types...</div>
              ) : (
                <Table
                  columns={getVisaTypeColumns(onEditVisaType)}
                  data={visaTypes}
                  emptyTitle="No visa types found"
                  emptyDescription="No visa type rows matched the current filter."
                />
              )}
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
