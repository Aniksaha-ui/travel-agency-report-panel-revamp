import RechartsAreaChart from "../../../components/charts/RechartsAreaChart";
import RechartsRankingChart from "../../../components/charts/RechartsRankingChart";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import MetricsOverview from "../../dashboard/components/MetricsOverview";
import {
  customerColumns,
  customerCompactCurrencyFormatter,
  customerCurrencyFormatter,
  spendTrendSeries,
} from "./customerValueView.config";

export default function CustomerValueDesktopView({
  boardDate,
  charts,
  copy,
  customers,
  handleSearchChange,
  isLoading,
  metrics,
  pagination,
  searchTerm,
  summary,
  tableFooter,
  topCustomer,
}) {
  return (
    <div className="d-none d-md-block">
      <div className="page-header d-print-none trip-performance-page-header">
        <div className="container-xl">
          <div className="trip-performance-hero">
            <div className="trip-performance-hero__copy">
              <span className="trip-performance-hero__eyebrow">/admin/customerValueReport</span>
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
              <div className="col-12 col-xl-8">
                <Card
                  title="Paid and retained value trend"
                  subtitle="Compare total paid against net spend for the currently visible customers."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsAreaChart
                    data={charts.spendTrend ?? []}
                    series={spendTrendSeries}
                    labelKey="label"
                    valueFormatter={customerCompactCurrencyFormatter}
                  />
                </Card>
              </div>

              <div className="col-12 col-xl-4">
                <Card
                  title="Net spend leaders"
                  subtitle="Highest retained revenue across the visible customer set."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsRankingChart
                    items={charts.spendRanking ?? []}
                    labelKey="label"
                    valueKey="value"
                    tooltipLabel="Net spent"
                    valueFormatter={customerCurrencyFormatter}
                    getCellColor={(entry) => (Number(entry.value) > 0 ? "#22c55e" : "#64748b")}
                  />
                </Card>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <div className="row g-3">
              <div className="col-12 col-xl-5">
                <Card
                  title="Customer spotlight"
                  subtitle="Top visible customer by net spend on the current page."
                  className="trip-performance-card border-0 h-100"
                >
                  <div className="trip-performance-highlight">
                    <div className="trip-performance-highlight__title">
                      {topCustomer?.customerName ?? "No highlighted customer yet"}
                    </div>
                    <div className="trip-performance-highlight__value">
                      {topCustomer?.netSpentLabel ?? "BDT 0"}
                    </div>
                    <div className="trip-performance-highlight__meta">
                      Paid {topCustomer?.totalPaidLabel ?? "BDT 0"} -{" "}
                      {topCustomer?.totalBookingsLabel ?? "0"} bookings
                    </div>
                  </div>

                  <div className="trip-performance-summary-grid">
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">Visible net spend</span>
                      <strong>{summary.visibleNetSpentLabel ?? "BDT 0"}</strong>
                    </div>
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">Visible paid</span>
                      <strong>{summary.visibleTotalPaidLabel ?? "BDT 0"}</strong>
                    </div>
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">Avg customer value</span>
                      <strong>{summary.averageCustomerValueLabel ?? "BDT 0"}</strong>
                    </div>
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">Top booking customer</span>
                      <strong>{summary.topBookingCustomer?.customerName ?? "Not available"}</strong>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="col-12 col-xl-7">
                <Card
                  title="Booking leaders"
                  subtitle="Customers generating the highest total booking count."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsRankingChart
                    items={charts.bookingRanking ?? []}
                    labelKey="label"
                    valueKey="value"
                    tooltipLabel="Bookings"
                    valueFormatter={(value) => `${Number(value) || 0} bookings`}
                    getCellColor={(entry) => (Number(entry.value) > 0 ? "#38bdf8" : "#64748b")}
                  />
                </Card>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <Card
              title="Customer value ledger"
              subtitle="Bookings, payments, refunds, and retained customer value."
              className="trip-performance-card border-0"
              bodyClassName="p-0"
              footer={tableFooter}
              actions={
                <div className="dashboard-search trip-performance-search">
                  <div className="input-icon">
                    <span className="input-icon-addon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                        <path d="M21 21l-6 -6" />
                      </svg>
                    </span>
                    <input
                      type="search"
                      className="form-control"
                      placeholder="Search customers"
                      aria-label="Search customers"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </div>
                </div>
              }
            >
              {isLoading && !customers.length ? (
                <div className="p-4 text-center text-secondary">Loading customer value data...</div>
              ) : (
                <Table
                  columns={customerColumns}
                  data={customers}
                  emptyTitle="No customer value data"
                  emptyDescription="The report endpoint did not return any customer rows."
                />
              )}
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
