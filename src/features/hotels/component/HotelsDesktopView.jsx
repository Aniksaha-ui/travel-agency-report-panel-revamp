import { Link } from "react-router-dom";
import SearchField from "../../../components/forms/SearchField";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import { APP_ROUTES } from "../../../constants/routes";
import MetricsOverview from "../../dashboard/components/MetricsOverview";
import { getHotelColumns } from "./hotelsView.config";

export default function HotelsDesktopView({
  boardDate,
  copy,
  handleSearchChange,
  isLoading,
  metrics,
  onViewDetails,
  pagination,
  searchTerm,
  summary,
  tableFooter,
  hotels,
}) {
  return (
    <div className="d-none d-md-block">
      <div className="page-header d-print-none trip-performance-page-header">
        <div className="container-xl">
          <div className="trip-performance-hero">
            <div className="trip-performance-hero__copy">
              <span className="trip-performance-hero__eyebrow">/admin/hotel</span>
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
                <span className="trip-performance-hero__meta-label">Average rating</span>
                <strong>{summary.averageRatingLabel ?? "0.0"}</strong>
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
              title="Hotel ledger"
              subtitle="Review hotel contact details, accommodation status, and open the full room-pricing payload."
              className="trip-performance-card border-0"
              bodyClassName="p-0"
              footer={tableFooter}
              actions={
                <div className="d-flex flex-column flex-lg-row gap-2">
                  <SearchField
                    placeholder="Filter loaded hotels"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <Link to={APP_ROUTES.hotelCreate} className="btn btn-primary">
                    Add hotel
                  </Link>
                </div>
              }
            >
              {isLoading && !hotels.length ? (
                <div className="p-4 text-center text-secondary">Loading hotels...</div>
              ) : (
                <Table
                  columns={getHotelColumns(onViewDetails)}
                  data={hotels}
                  emptyTitle="No hotels found"
                  emptyDescription="No hotel rows matched the current filter."
                />
              )}
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
