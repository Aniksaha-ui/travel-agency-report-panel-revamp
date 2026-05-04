import RechartsPieChart from "../../../components/charts/RechartsPieChart";
import RechartsRankingChart from "../../../components/charts/RechartsRankingChart";
import Button from "../../../components/common/Button";

export default function VehicleWiseSeatReportMobileView({
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
  return (
    <div className="d-md-none trip-performance-mobile">
      <div className="container-xl">
        <div className="trip-performance-mobile__screen">
          <section className="trip-performance-mobile__hero">
            <div className="trip-performance-mobile__hero-top">
              <div>
                <div className="trip-performance-mobile__eyebrow">/admin/vehiclewiseseatreport</div>
                <h2 className="trip-performance-mobile__title">
                  {copy?.pageTitle ?? "Vehicle wise total seat report"}
                </h2>
                <p className="trip-performance-mobile__subtitle">
                  {copy?.pageSubtitle ?? "Track available seat inventory by vehicle and vehicle type from the report API."}
                </p>
              </div>
              <span className="trip-performance-mobile__date">{boardDate}</span>
            </div>

            <div className="trip-performance-mobile__spotlight">
              <div>
                <div className="trip-performance-mobile__spotlight-label">Top seat inventory</div>
                <div className="trip-performance-mobile__spotlight-value">
                  {summary.topVehicleSeatsLabel ?? "0"}
                </div>
                <div className="trip-performance-mobile__spotlight-meta">
                  {summary.topVehicleName ?? "No vehicle data available"}
                </div>
              </div>
              <div className="trip-performance-mobile__spotlight-stack">
                <span>{summary.totalSeatsLabel ?? "0"} seats</span>
                <span>{summary.uniqueTypesLabel ?? "0"} types</span>
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
                <div className="trip-performance-mobile__card-title">Seat mix by vehicle type</div>
                <div className="trip-performance-mobile__card-subtle">
                  Available seat distribution across reported vehicle categories
                </div>
              </div>
            </div>

            <RechartsPieChart
              items={charts.typeMix ?? []}
              height={240}
              totalLabel="available seats"
              valueFormatter={(value) => `${Number(value) || 0} seats`}
            />
          </section>

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Seat capacity leaders</div>
                <div className="trip-performance-mobile__card-subtle">
                  Vehicles with the highest visible available seat count
                </div>
              </div>
            </div>

            <RechartsRankingChart
              items={charts.seatRanking ?? []}
              labelKey="label"
              valueKey="value"
              tooltipLabel="Available seats"
              valueFormatter={(value) => `${Number(value) || 0} seats`}
              getCellColor={() => "#38bdf8"}
            />
          </section>

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Vehicle seat ledger</div>
                <div className="trip-performance-mobile__card-subtle">
                  Showing {pagination.from ?? 0}-{pagination.to ?? 0} of {pagination.total ?? 0}
                </div>
              </div>
              <div className="trip-performance-mobile__pill">
                Page {pagination.currentPage ?? 1}/{pagination.lastPage ?? 1}
              </div>
            </div>

            <div className="trip-performance-mobile__list">
              {vehicles.length ? (
                vehicles.map((vehicle) => (
                  <article key={vehicle.id} className="trip-performance-mobile__item">
                    <div className="trip-performance-mobile__item-top">
                      <div>
                        <div className="trip-performance-mobile__item-title">{vehicle.vehicleName}</div>
                        <div className="trip-performance-mobile__item-meta">{vehicle.vehicleType}</div>
                      </div>
                      <div className="trip-performance-mobile__item-profit">{vehicle.availableSeatsLabel}</div>
                    </div>
                    <div className="trip-performance-mobile__item-grid">
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">#{vehicle.vehicleId}</div>
                        <div className="trip-performance-mobile__item-grid-label">Vehicle ID</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{vehicle.vehicleType}</div>
                        <div className="trip-performance-mobile__item-grid-label">Type</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{vehicle.availableSeatsLabel}</div>
                        <div className="trip-performance-mobile__item-grid-label">Seats</div>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="trip-performance-mobile__empty">
                  {isLoading ? "Loading vehicle seat report..." : "No vehicle seat data available."}
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
  );
}
