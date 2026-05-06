import SearchField from "../../../components/forms/SearchField";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import MetricsOverview from "../../dashboard/components/MetricsOverview";
import { getBookingColumns } from "./bookingsView.config";

export default function BookingsDesktopView({
  boardDate,
  copy,
  error,
  bookings,
  handleSearchChange,
  isLoading,
  metrics,
  onOpenInvoice,
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
              <span className="trip-performance-hero__eyebrow">/admin/bookings</span>
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
                <span className="trip-performance-hero__meta-label">Paid</span>
                <strong>{summary.paidBookingsLabel ?? "0"}</strong>
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
              <Card title="Bookings unavailable" className="trip-performance-card border-0">
                <div className="text-danger">
                  {error.message || "Unable to load booking information."}
                </div>
              </Card>
            </section>
          ) : null}

          <section className="dashboard-section">
            <MetricsOverview metrics={metrics} />
          </section>

          <section className="dashboard-section">
            <Card
              title="Booking ledger"
              subtitle="Review bookings, payment status, seat assignment, and invoice access."
              className="trip-performance-card border-0"
              bodyClassName="p-0"
              footer={tableFooter}
              actions={
                <SearchField
                  placeholder="Search bookings"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              }
            >
              {isLoading && !bookings.length ? (
                <div className="p-4 text-center text-secondary">Loading bookings...</div>
              ) : (
                <Table
                  columns={getBookingColumns({ onOpenInvoice })}
                  data={bookings}
                  emptyTitle="No bookings found"
                  emptyDescription="No booking rows matched the current search."
                />
              )}
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}

