import { startTransition, useState } from "react";
import Button from "../../../components/common/Button";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import AdminLayout from "../../../layouts/AdminLayout";
import MetricsOverview from "../../dashboard/components/MetricsOverview";
import { TRIP_PERFORMANCE_COPY } from "../constants/tripPerformance.constants";
import useTripPerformance from "../hooks/useTripPerformance";

const renderOccupancy = (trip) => (
  <div className="trip-performance-meter">
    <div className="trip-performance-meter__label">{trip.occupancyRateLabel}</div>
    <div className="trip-performance-meter__track">
      <span
        className="trip-performance-meter__fill"
        style={{ width: `${Math.min(trip.occupancyRate, 100)}%` }}
      />
    </div>
  </div>
);

const tripColumns = [
  {
    key: "tripName",
    header: "Trip",
    render: (trip) => (
      <div>
        <div className="fw-semibold">{trip.tripName}</div>
        <div className="text-secondary small">ID #{trip.tripId}</div>
      </div>
    ),
  },
  {
    key: "scheduleLabel",
    header: "Schedule",
    render: (trip) => (
      <div>
        <div className="fw-semibold">{trip.scheduleLabel}</div>
        <div className="text-secondary small">
          Depart {trip.departureDateLabel} • Arrive {trip.arrivalDateLabel}
        </div>
      </div>
    ),
  },
  {
    key: "bookedSeatsLabel",
    header: "Seats",
    mobileLabel: "Seats",
    render: (trip) => (
      <div>
        <div className="fw-semibold">{trip.bookedSeatsLabel} booked</div>
        <div className="text-secondary small">
          {trip.availableSeatsLabel} available of {trip.capacityLabel}
        </div>
      </div>
    ),
  },
  {
    key: "occupancyRate",
    header: "Occupancy",
    render: renderOccupancy,
  },
  {
    key: "totalRevenueLabel",
    header: "Revenue",
    headerClassName: "text-end",
    cellClassName: "text-end fw-semibold",
  },
  {
    key: "totalProfitLabel",
    header: "Profit",
    headerClassName: "text-end",
    cellClassName: "text-end fw-semibold",
  },
];

export default function TripPerformancePage() {
  const [page, setPage] = useState(1);
  const { data, isFetching, isLoading } = useTripPerformance(page);
  const copy = data?.copy ?? TRIP_PERFORMANCE_COPY;
  const metrics = data?.metrics ?? [];
  const trips = data?.trips ?? [];
  const pagination = data?.pagination ?? {};
  const summary = data?.summary ?? {};
  const topTrip = summary.topTrip;
  const boardDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date());

  const changePage = (nextPage) => {
    startTransition(() => {
      setPage(nextPage);
    });
  };

  return (
    <AdminLayout>
      <div className="d-md-none trip-performance-mobile">
        <div className="container-xl">
          <div className="trip-performance-mobile__screen">
            <section className="trip-performance-mobile__hero">
              <div className="trip-performance-mobile__hero-top">
                <div>
                  <div className="trip-performance-mobile__eyebrow">/admin/tripPerformance</div>
                  <h2 className="trip-performance-mobile__title">{copy.pageTitle}</h2>
                  <p className="trip-performance-mobile__subtitle">{copy.pageSubtitle}</p>
                </div>
                <span className="trip-performance-mobile__date">{boardDate}</span>
              </div>

              <div className="trip-performance-mobile__spotlight">
                <div>
                  <div className="trip-performance-mobile__spotlight-label">Top profit trip</div>
                  <div className="trip-performance-mobile__spotlight-value">
                    {topTrip?.totalProfitLabel ?? "BDT 0"}
                  </div>
                  <div className="trip-performance-mobile__spotlight-meta">
                    {topTrip?.tripName ?? "No trip performance records yet."}
                  </div>
                </div>
                <div className="trip-performance-mobile__spotlight-stack">
                  <span>{summary.visibleUtilizationLabel ?? "0%"} full</span>
                  <span>{summary.visibleBookedSeatsLabel ?? "0"} booked</span>
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
                  <div className="trip-performance-mobile__card-title">Trip ledger</div>
                  <div className="trip-performance-mobile__card-subtle">
                    Showing {pagination.from ?? 0}-{pagination.to ?? 0} of {pagination.total ?? 0}
                  </div>
                </div>
                <div className="trip-performance-mobile__pill">
                  Page {pagination.currentPage ?? 1}/{pagination.lastPage ?? 1}
                </div>
              </div>

              <div className="trip-performance-mobile__list">
                {trips.length ? (
                  trips.map((trip) => (
                    <article key={trip.id} className="trip-performance-mobile__item">
                      <div className="trip-performance-mobile__item-top">
                        <div>
                          <div className="trip-performance-mobile__item-title">{trip.tripName}</div>
                          <div className="trip-performance-mobile__item-meta">{trip.scheduleLabel}</div>
                        </div>
                        <div className="trip-performance-mobile__item-profit">{trip.totalProfitLabel}</div>
                      </div>
                      {renderOccupancy(trip)}
                      <div className="trip-performance-mobile__item-grid">
                        <div>
                          <div className="trip-performance-mobile__item-grid-value">{trip.bookedSeatsLabel}</div>
                          <div className="trip-performance-mobile__item-grid-label">Booked</div>
                        </div>
                        <div>
                          <div className="trip-performance-mobile__item-grid-value">{trip.availableSeatsLabel}</div>
                          <div className="trip-performance-mobile__item-grid-label">Available</div>
                        </div>
                        <div>
                          <div className="trip-performance-mobile__item-grid-value">{trip.totalRevenueLabel}</div>
                          <div className="trip-performance-mobile__item-grid-label">Revenue</div>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="trip-performance-mobile__empty">
                    {isLoading ? "Loading trip performance..." : "No trip performance data available."}
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

      <div className="d-none d-md-block">
        <div className="page-header d-print-none trip-performance-page-header">
          <div className="container-xl">
            <div className="trip-performance-hero">
              <div className="trip-performance-hero__copy">
                <span className="trip-performance-hero__eyebrow">/admin/tripPerformance</span>
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
                  <span className="trip-performance-hero__meta-label">Page</span>
                  <strong>
                    {pagination.currentPage ?? 1}/{pagination.lastPage ?? 1}
                  </strong>
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
              <div className="row g-3">
                <div className="col-12 col-xl-5">
                  <Card
                    title="Top performer"
                    subtitle="Best visible trip on the current page by combined profit."
                    className="trip-performance-card border-0 h-100"
                  >
                    <div className="trip-performance-highlight">
                      <div className="trip-performance-highlight__title">
                        {topTrip?.tripName ?? "No highlighted trip yet"}
                      </div>
                      <div className="trip-performance-highlight__value">
                        {topTrip?.totalProfitLabel ?? "BDT 0"}
                      </div>
                      <div className="trip-performance-highlight__meta">
                        Revenue {topTrip?.totalRevenueLabel ?? "BDT 0"} • {topTrip?.occupancyRateLabel ?? "0% occupied"}
                      </div>
                    </div>

                    <div className="trip-performance-summary-grid">
                      <div className="trip-performance-summary-grid__item">
                        <span className="trip-performance-summary-grid__label">Visible revenue</span>
                        <strong>{summary.visibleRevenueLabel ?? "BDT 0"}</strong>
                      </div>
                      <div className="trip-performance-summary-grid__item">
                        <span className="trip-performance-summary-grid__label">Visible profit</span>
                        <strong>{summary.visibleProfitLabel ?? "BDT 0"}</strong>
                      </div>
                      <div className="trip-performance-summary-grid__item">
                        <span className="trip-performance-summary-grid__label">Booked seats</span>
                        <strong>{summary.visibleBookedSeatsLabel ?? "0"}</strong>
                      </div>
                      <div className="trip-performance-summary-grid__item">
                        <span className="trip-performance-summary-grid__label">Seat utilization</span>
                        <strong>{summary.visibleUtilizationLabel ?? "0%"}</strong>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="col-12 col-xl-7">
                  <Card
                    title="Page controls"
                    subtitle="Move through the paginated report without leaving the screen."
                    className="trip-performance-card border-0 h-100"
                  >
                    <div className="trip-performance-page-control">
                      <div className="trip-performance-page-control__copy">
                        <div className="trip-performance-page-control__value">
                          Page {pagination.currentPage ?? 1} of {pagination.lastPage ?? 1}
                        </div>
                        <p className="text-secondary mb-0">
                          The API reports {pagination.total ?? 0} total trips with {pagination.perPage ?? 0} rows per
                          page.
                        </p>
                      </div>
                      <div className="trip-performance-page-control__actions">
                        <Button
                          variant="outline"
                          disabled={!pagination.hasPrev || isFetching}
                          onClick={() => changePage(page - 1)}
                        >
                          Previous page
                        </Button>
                        <Button disabled={!pagination.hasNext || isFetching} onClick={() => changePage(page + 1)}>
                          Next page
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </section>

            <section className="dashboard-section">
              <Card
                title="Trip performance ledger"
                subtitle="Revenue, capacity, and profitability for each scheduled trip."
                className="trip-performance-card border-0"
                bodyClassName="p-0"
              >
                {isLoading && !trips.length ? (
                  <div className="p-4 text-center text-secondary">Loading trip performance data...</div>
                ) : (
                  <Table
                    columns={tripColumns}
                    data={trips}
                    emptyTitle="No trip performance data"
                    emptyDescription="The report endpoint did not return any trip rows."
                  />
                )}
              </Card>
            </section>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
