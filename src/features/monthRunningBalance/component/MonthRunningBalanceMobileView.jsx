import RechartsAreaChart from "../../../components/charts/RechartsAreaChart";
import RechartsBarChart from "../../../components/charts/RechartsBarChart";
import Button from "../../../components/common/Button";
import {
  balanceTrendSeries,
  cashFlowSegments,
  compactBalanceFormatter,
} from "./monthRunningBalanceView.config";

export default function MonthRunningBalanceMobileView({
  boardDate,
  changePage,
  charts,
  copy,
  isFetching,
  isLoading,
  latestMonth,
  metrics,
  months,
  page,
  pagination,
  summary,
}) {
  return (
    <div className="d-md-none trip-performance-mobile">
      <div className="container-xl">
        <div className="trip-performance-mobile__screen">
          <section className="trip-performance-mobile__hero">
            <div className="trip-performance-mobile__hero-top">
              <div>
                <div className="trip-performance-mobile__eyebrow">/admin/monthRunningBalance</div>
                <h2 className="trip-performance-mobile__title">{copy.pageTitle}</h2>
                <p className="trip-performance-mobile__subtitle">{copy.pageSubtitle}</p>
              </div>
              <span className="trip-performance-mobile__date">{boardDate}</span>
            </div>

            <div className="trip-performance-mobile__spotlight">
              <div>
                <div className="trip-performance-mobile__spotlight-label">Latest closing balance</div>
                <div className="trip-performance-mobile__spotlight-value">
                  {latestMonth?.closingBalanceLabel ?? "BDT 0"}
                </div>
                <div className="trip-performance-mobile__spotlight-meta">
                  {latestMonth
                    ? `${latestMonth.monthLabel} - ${latestMonth.netMovementLabel} net`
                    : "No running balance records yet."}
                </div>
              </div>
              <div className="trip-performance-mobile__spotlight-stack">
                <span>{summary.totalCreditLabel ?? "BDT 0"} credit</span>
                <span>{summary.totalDebitLabel ?? "BDT 0"} debit</span>
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
                <div className="trip-performance-mobile__card-title">Opening vs closing balance</div>
                <div className="trip-performance-mobile__card-subtle">
                  Follow how the balance rolls from month to month
                </div>
              </div>
            </div>

            <RechartsAreaChart
              data={charts.balanceTrend ?? []}
              series={balanceTrendSeries}
              height={220}
              labelKey="label"
              valueFormatter={compactBalanceFormatter}
            />
          </section>

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Credit and debit mix</div>
                <div className="trip-performance-mobile__card-subtle">
                  Compare the monthly inflow and outflow side by side
                </div>
              </div>
            </div>

            <RechartsBarChart
              items={charts.cashFlowComposition ?? []}
              segments={cashFlowSegments}
              labelKey="label"
              height={260}
            />
          </section>

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Monthly ledger</div>
                <div className="trip-performance-mobile__card-subtle">
                  Showing {pagination.from ?? 0}-{pagination.to ?? 0} of {pagination.total ?? 0}
                </div>
              </div>
              <div className="trip-performance-mobile__pill">
                Page {pagination.currentPage ?? 1}/{pagination.lastPage ?? 1}
              </div>
            </div>

            <div className="trip-performance-mobile__list">
              {months.length ? (
                months.map((month) => (
                  <article key={month.id} className="trip-performance-mobile__item">
                    <div className="trip-performance-mobile__item-top">
                      <div>
                        <div className="trip-performance-mobile__item-title">{month.monthLabel}</div>
                        <div className="trip-performance-mobile__item-meta">
                          {month.txCountLabel} transactions - {month.balanceGrowthLabel}
                        </div>
                      </div>
                      <div className="trip-performance-mobile__item-profit">{month.closingBalanceLabel}</div>
                    </div>
                    <div className="trip-performance-mobile__item-grid">
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">
                          {month.openingBalanceLabel}
                        </div>
                        <div className="trip-performance-mobile__item-grid-label">Opening</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">
                          {month.totalCreditLabel}
                        </div>
                        <div className="trip-performance-mobile__item-grid-label">Credit</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">
                          {month.totalDebitLabel}
                        </div>
                        <div className="trip-performance-mobile__item-grid-label">Debit</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">
                          {month.netMovementLabel}
                        </div>
                        <div className="trip-performance-mobile__item-grid-label">Net</div>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="trip-performance-mobile__empty">
                  {isLoading ? "Loading monthly running balance..." : "No monthly running balance data available."}
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
