import RechartsPieChart from "../../../components/charts/RechartsPieChart";
import RechartsRankingChart from "../../../components/charts/RechartsRankingChart";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import MetricsOverview from "../../dashboard/components/MetricsOverview";
import OverallSalesTabs from "./OverallSalesTabs";
import {
  overallSalesCompactCurrencyFormatter,
  overallSalesCurrencyFormatter,
  routeBookingFormatter,
  routeSalesColumns,
  sourceSalesColumns,
} from "./overallSalesView.config";

export default function OverallSalesDesktopView({
  activeReport,
  boardDate,
  copy,
  isLoading,
  metrics,
  onChangeReport,
  overall,
  routeWise,
}) {
  return (
    <div className="d-none d-md-block">
      <div className="page-header d-print-none trip-performance-page-header">
        <div className="container-xl">
          <div className="trip-performance-hero">
            <div className="trip-performance-hero__copy">
              <span className="trip-performance-hero__eyebrow">/admin/account/overall-sales</span>
              <h2 className="page-title">{copy.pageTitle}</h2>
              <p className="text-secondary mb-0">{copy.pageSubtitle}</p>
            </div>

            <div className="trip-performance-hero__meta">
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Overall sales</span>
                <strong>{overall.totalSalesLabel ?? "BDT 0"}</strong>
              </div>
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Route revenue</span>
                <strong>{routeWise.totalRouteRevenueLabel ?? "BDT 0"}</strong>
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
            <OverallSalesTabs
              activeReport={activeReport}
              onChangeReport={onChangeReport}
              overall={overall}
              routeWise={routeWise}
            />
          </section>

          {activeReport === "overall" ? (
          <section className="dashboard-section">
            <div className="row g-3">
              <div className="col-12">
                <h3 className="section-title mb-3">Overall Sales Summary</h3>
              </div>
              <div className="col-12 col-xl-5">
                <Card
                  title="Sales by source"
                  subtitle="Total sales amount split across trip, package, and hotel sources."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsPieChart
                    items={overall.charts?.salesMix ?? []}
                    height={320}
                    centerValueFormatter={overallSalesCompactCurrencyFormatter}
                    totalLabel="sales"
                    valueFormatter={overallSalesCurrencyFormatter}
                  />
                </Card>
              </div>

              <div className="col-12 col-xl-7">
                <Card
                  title="Source sales ranking"
                  subtitle="Sales sources ranked by total amount."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsRankingChart
                    items={overall.charts?.sourceRanking ?? []}
                    labelKey="label"
                    valueKey="value"
                    tooltipLabel="Sales"
                    valueFormatter={overallSalesCurrencyFormatter}
                    getCellColor={(entry) => (Number(entry.value) > 1000000 ? "#22c55e" : "#38bdf8")}
                  />
                </Card>
              </div>

              <div className="col-12">
                <Card
                  title="Overall sales ledger"
                  subtitle="Total amount and share by source."
                  className="trip-performance-card border-0"
                  bodyClassName="p-0"
                >
                  {isLoading && !overall.sources?.length ? (
                    <div className="p-4 text-center text-secondary">Loading overall sales summary...</div>
                  ) : (
                    <Table
                      columns={sourceSalesColumns}
                      data={overall.sources ?? []}
                      emptyTitle="No overall sales data"
                      emptyDescription="The report endpoint did not return any sales source rows."
                    />
                  )}
                </Card>
              </div>
            </div>
          </section>
          ) : null}

          {activeReport === "routeWise" ? (
          <section className="dashboard-section">
            <div className="row g-3">
              <div className="col-12">
                <h3 className="section-title mb-3">Route-Wise Sales Summary</h3>
              </div>
              <div className="col-12 col-xl-5">
                <Card
                  title="Route spotlight"
                  subtitle="Highest revenue route in the current route-wise report."
                  className="trip-performance-card border-0 h-100"
                >
                  <div className="trip-performance-highlight">
                    <div className="trip-performance-highlight__title">
                      {routeWise.topRoute?.routeName ?? "No route sales yet"}
                    </div>
                    <div className="trip-performance-highlight__value">
                      {routeWise.topRoute?.totalRevenueLabel ?? "BDT 0"}
                    </div>
                    <div className="trip-performance-highlight__meta">
                      {routeWise.topRoute
                        ? `${routeWise.topRoute.totalBookingsLabel} bookings - ${routeWise.topRoute.averageRevenueLabel} avg`
                        : "No route data available"}
                    </div>
                  </div>

                  <div className="trip-performance-summary-grid">
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">Route revenue</span>
                      <strong>{routeWise.totalRouteRevenueLabel ?? "BDT 0"}</strong>
                    </div>
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">Route bookings</span>
                      <strong>{routeWise.totalRouteBookingsLabel ?? "0"}</strong>
                    </div>
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">Routes</span>
                      <strong>{routeWise.routes?.length ?? 0}</strong>
                    </div>
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">Top route avg</span>
                      <strong>{routeWise.topRoute?.averageRevenueLabel ?? "BDT 0"}</strong>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="col-12 col-xl-7">
                <Card
                  title="Route revenue ranking"
                  subtitle="Routes ranked by total revenue."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsRankingChart
                    items={routeWise.charts?.routeRevenueRanking ?? []}
                    labelKey="label"
                    valueKey="value"
                    tooltipLabel="Revenue"
                    valueFormatter={overallSalesCurrencyFormatter}
                    getCellColor={(entry) => (Number(entry.value) > 1000000 ? "#22c55e" : "#38bdf8")}
                  />
                </Card>
              </div>

              <div className="col-12 col-xl-5">
                <Card
                  title="Route booking volume"
                  subtitle="Routes ranked by total booking count."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsRankingChart
                    items={routeWise.charts?.routeBookingRanking ?? []}
                    labelKey="label"
                    valueKey="value"
                    tooltipLabel="Bookings"
                    valueFormatter={routeBookingFormatter}
                    getCellColor={(entry) => (Number(entry.value) >= 10 ? "#f59e0b" : "#38bdf8")}
                  />
                </Card>
              </div>

              <div className="col-12 col-xl-7">
                <Card
                  title="Route-wise sales ledger"
                  subtitle="Bookings, revenue, and average revenue by route."
                  className="trip-performance-card border-0 h-100"
                  bodyClassName="p-0"
                >
                  {isLoading && !routeWise.routes?.length ? (
                    <div className="p-4 text-center text-secondary">Loading route-wise sales summary...</div>
                  ) : (
                    <Table
                      columns={routeSalesColumns}
                      data={routeWise.routes ?? []}
                      emptyTitle="No route-wise sales data"
                      emptyDescription="The report endpoint did not return any route rows."
                    />
                  )}
                </Card>
              </div>
            </div>
          </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
