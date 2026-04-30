import RechartsAreaChart from "../../../components/charts/RechartsAreaChart";
import RechartsRankingChart from "../../../components/charts/RechartsRankingChart";
import Button from "../../../components/common/Button";
import {
  customerCompactCurrencyFormatter,
  customerCurrencyFormatter,
  renderSpendShare,
  spendTrendSeries,
} from "./customerValueView.config";

export default function CustomerValueMobileView({
  boardDate,
  changePage,
  charts,
  copy,
  customers,
  handleSearchChange,
  isFetching,
  isLoading,
  metrics,
  page,
  pagination,
  searchTerm,
  summary,
  topCustomer,
}) {
  return (
    <div className="d-md-none trip-performance-mobile">
      <div className="container-xl">
        <div className="trip-performance-mobile__screen">
          <section className="trip-performance-mobile__hero">
            <div className="trip-performance-mobile__hero-top">
              <div>
                <div className="trip-performance-mobile__eyebrow">/admin/customerValueReport</div>
                <h2 className="trip-performance-mobile__title">{copy.pageTitle}</h2>
                <p className="trip-performance-mobile__subtitle">{copy.pageSubtitle}</p>
              </div>
              <span className="trip-performance-mobile__date">{boardDate}</span>
            </div>

            <div className="trip-performance-mobile__spotlight">
              <div>
                <div className="trip-performance-mobile__spotlight-label">Top customer by net spend</div>
                <div className="trip-performance-mobile__spotlight-value">
                  {topCustomer?.netSpentLabel ?? "BDT 0"}
                </div>
                <div className="trip-performance-mobile__spotlight-meta">
                  {topCustomer
                    ? `${topCustomer.customerName} - ${topCustomer.totalBookingsLabel} bookings`
                    : "No customer value records yet."}
                </div>
              </div>
              <div className="trip-performance-mobile__spotlight-stack">
                <span>{summary.visibleBookingsLabel ?? "0"} bookings</span>
                <span>{summary.averageCustomerValueLabel ?? "BDT 0"} avg</span>
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
                <div className="trip-performance-mobile__card-title">Paid vs net spent</div>
                <div className="trip-performance-mobile__card-subtle">
                  Compare gross spend and retained spend across the visible list
                </div>
              </div>
            </div>

            <RechartsAreaChart
              data={charts.spendTrend ?? []}
              series={spendTrendSeries}
              height={210}
              labelKey="label"
              valueFormatter={customerCompactCurrencyFormatter}
            />
          </section>

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Net spend leaders</div>
                <div className="trip-performance-mobile__card-subtle">
                  Highest visible net spend across customers
                </div>
              </div>
            </div>

            <RechartsRankingChart
              items={charts.spendRanking ?? []}
              labelKey="label"
              valueKey="value"
              height={250}
              tooltipLabel="Net spent"
              valueFormatter={customerCurrencyFormatter}
              getCellColor={(entry) => (Number(entry.value) > 0 ? "#22c55e" : "#64748b")}
            />
          </section>

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Customer ledger</div>
                <div className="trip-performance-mobile__card-subtle">
                  Showing {pagination.from ?? 0}-{pagination.to ?? 0} of {pagination.total ?? 0}
                </div>
              </div>
              <div className="trip-performance-mobile__pill">
                Page {pagination.currentPage ?? 1}/{pagination.lastPage ?? 1}
              </div>
            </div>

            <div className="trip-performance-mobile__search">
              <span className="trip-performance-mobile__search-icon" aria-hidden="true">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={18}
                  height={18}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                  <path d="M21 21l-6 -6" />
                </svg>
              </span>
              <input
                type="search"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search customers"
                aria-label="Search customers"
              />
            </div>

            <div className="trip-performance-mobile__list">
              {customers.length ? (
                customers.map((customer) => (
                  <article key={customer.id} className="trip-performance-mobile__item">
                    <div className="trip-performance-mobile__item-top">
                      <div>
                        <div className="trip-performance-mobile__item-title">{customer.customerName}</div>
                        <div className="trip-performance-mobile__item-meta">
                          {customer.totalBookingsLabel} bookings - {customer.customerTierLabel}
                        </div>
                      </div>
                      <div className="trip-performance-mobile__item-profit">{customer.netSpentLabel}</div>
                    </div>
                    {renderSpendShare(customer)}
                    <div className="trip-performance-mobile__item-grid">
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">
                          {customer.tripBookingsLabel}
                        </div>
                        <div className="trip-performance-mobile__item-grid-label">Trip bookings</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">
                          {customer.packageBookingsLabel}
                        </div>
                        <div className="trip-performance-mobile__item-grid-label">Package bookings</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">
                          {customer.totalPaidLabel}
                        </div>
                        <div className="trip-performance-mobile__item-grid-label">Paid</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">
                          {customer.averageBookingValueLabel}
                        </div>
                        <div className="trip-performance-mobile__item-grid-label">Avg booking value</div>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="trip-performance-mobile__empty">
                  {isLoading ? "Loading customer value..." : "No customer value data available."}
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
