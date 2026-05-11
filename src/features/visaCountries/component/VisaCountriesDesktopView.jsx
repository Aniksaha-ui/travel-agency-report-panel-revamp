import { Link } from "react-router-dom";
import SearchField from "../../../components/forms/SearchField";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import { APP_ROUTES } from "../../../constants/routes";
import MetricsOverview from "../../dashboard/components/MetricsOverview";
import { getVisaCountryColumns } from "./visaCountriesView.config";

export default function VisaCountriesDesktopView({
  boardDate,
  copy,
  countries,
  handleSearchChange,
  isLoading,
  onEditCountry,
  pagination,
  searchTerm,
  summary,
  tableFooter,
  metrics,
}) {
  return (
    <div className="d-none d-md-block">
      <div className="page-header d-print-none trip-performance-page-header">
        <div className="container-xl">
          <div className="trip-performance-hero">
            <div className="trip-performance-hero__copy">
              <span className="trip-performance-hero__eyebrow">/admin/visa/countries</span>
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
                <span className="trip-performance-hero__meta-label">Popular on page</span>
                <strong>{summary.popularCountriesLabel ?? "0"}</strong>
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
              title="Country registry"
              subtitle="Search the visa destination catalog, review country activation, and open the legacy create and edit flow."
              className="trip-performance-card border-0"
              bodyClassName="p-0"
              footer={tableFooter}
              actions={
                <div className="d-flex flex-column flex-lg-row gap-2">
                  <SearchField
                    placeholder="Search countries or ISO codes"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <Link to={APP_ROUTES.visaCountryCreate} className="btn btn-primary">
                    Add country
                  </Link>
                </div>
              }
            >
              {isLoading && !countries.length ? (
                <div className="p-4 text-center text-secondary">Loading visa countries...</div>
              ) : (
                <Table
                  columns={getVisaCountryColumns(onEditCountry)}
                  data={countries}
                  emptyTitle="No visa countries found"
                  emptyDescription="No country rows matched the current filter."
                />
              )}
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
