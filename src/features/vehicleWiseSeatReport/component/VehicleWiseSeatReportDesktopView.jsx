import RechartsPieChart from "../../../components/charts/RechartsPieChart";
import RechartsRankingChart from "../../../components/charts/RechartsRankingChart";
import Button from "../../../components/common/Button";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import MetricsOverview from "../../dashboard/components/MetricsOverview";

const vehicleWiseSeatColumns = [
  {
    key: "vehicleName",
    header: "Vehicle",
    render: (row) => (
      <div>
        <div className="fw-semibold">{row.vehicleName}</div>
        <div className="text-secondary small">{row.vehicleType}</div>
      </div>
    ),
  },

  {
    key: "availableSeatsLabel",
    header: "Available seats",
    headerClassName: "text-end",
    cellClassName: "text-end fw-semibold",
  },
];

export default function VehicleWiseSeatReportDesktopView({
  boardDate,
  changePage,
  charts,
  copy,
  isFetching,
  isLoading,
  metrics,
  page,
  pagination,
  summary,
  vehicles,
}) {
  const footer = (
    <div className="trip-performance-table-footer">
      <div className="trip-performance-table-footer__summary">
        <strong>
          {pagination.from ?? 0}-{pagination.to ?? 0} of {pagination.total ?? 0}
        </strong>
        <span>Visible vehicles on the current seat report page.</span>
      </div>
      <div className="trip-performance-table-footer__actions">
        <Button
          variant="outline"
          disabled={!pagination.hasPrev || isFetching}
          onClick={() => changePage(page - 1)}
        >
          Previous
        </Button>
        <Button
          disabled={!pagination.hasNext || isFetching}
          onClick={() => changePage(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );

  return (
    <div className="d-none d-md-block">
      <div className="page-header d-print-none trip-performance-page-header">
        <div className="container-xl">
          <div className="trip-performance-hero">
            <div className="trip-performance-hero__copy">
              <span className="trip-performance-hero__eyebrow">
                /admin/vehiclewiseseatreport
              </span>
              <h2 className="page-title">
                {copy?.pageTitle ?? "Vehicle wise total seat report"}
              </h2>
              <p className="text-secondary mb-0">
                {copy?.pageSubtitle ??
                  "Track available seat inventory by vehicle and vehicle type from the report API."}
              </p>
            </div>

            <div className="trip-performance-hero__meta">
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">
                  Showing
                </span>
                <strong>
                  {pagination.from ?? 0}-{pagination.to ?? 0} of{" "}
                  {pagination.total ?? 0}
                </strong>
              </div>
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">
                  Available seats
                </span>
                <strong>{summary.totalSeatsLabel ?? "0"}</strong>
              </div>
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">
                  Board date
                </span>
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
                  title="Seat mix by vehicle type"
                  subtitle="Available seat distribution across reported vehicle categories."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsPieChart
                    items={charts.typeMix ?? []}
                    height={300}
                    totalLabel="available seats"
                    valueFormatter={(value) => `${Number(value) || 0} seats`}
                  />
                </Card>
              </div>

              <div className="col-12 col-xl-7">
                <Card
                  title="Seat capacity leaders"
                  subtitle="Vehicles with the highest visible available seat count."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsRankingChart
                    items={charts.seatRanking ?? []}
                    labelKey="label"
                    valueKey="value"
                    tooltipLabel="Available seats"
                    valueFormatter={(value) => `${Number(value) || 0} seats`}
                    getCellColor={() => "#38bdf8"}
                  />
                </Card>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <Card
              title="Vehicle seat ledger"
              subtitle="Vehicle name, type, id, and available seat count."
              className="trip-performance-card border-0"
              bodyClassName="p-0"
              footer={footer}
            >
              {isLoading && !vehicles.length ? (
                <div className="p-4 text-center text-secondary">
                  Loading vehicle seat report...
                </div>
              ) : (
                <Table
                  columns={vehicleWiseSeatColumns}
                  data={vehicles}
                  emptyTitle="No vehicle seat data"
                  emptyDescription="The report endpoint did not return any vehicle seat rows."
                />
              )}
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
