import RechartsAreaChart from "../../../components/charts/RechartsAreaChart";
import RechartsBarChart from "../../../components/charts/RechartsBarChart";
import RechartsPieChart from "../../../components/charts/RechartsPieChart";
import Button from "../../../components/common/Button";
import {
  balanceTrendSeries,
  cashFlowSegments,
  compactDailyCurrencyFormatter,
  dailyCurrencyFormatter,
} from "./dailyBalanceView.config";
import DailyBalanceMobileHistory from "./DailyBalanceMobileHistory";

export default function DailyBalanceMobileView({
  boardDate,
  changePage,
  changeHistoryPage,
  charts,
  copy,
  days,
  history,
  isFetching,
  isHistoryFetching,
  isHistoryLoading,
  isLoading,
  latestDay,
  metrics,
  onSelectReport,
  page,
  pagination,
  selectedReport,
  summary,
}) {
  return (
    <div className="d-md-none trip-performance-mobile">
      <div className="container-xl">
        <div className="trip-performance-mobile__screen">
          <section className="trip-performance-mobile__hero">
            <div className="trip-performance-mobile__hero-top">
              <div>
                <div className="trip-performance-mobile__eyebrow">/admin/account/daily-balance</div>
                <h2 className="trip-performance-mobile__title">{copy.pageTitle}</h2>
                <p className="trip-performance-mobile__subtitle">{copy.pageSubtitle}</p>
              </div>
              <span className="trip-performance-mobile__date">{boardDate}</span>
            </div>

            <div className="trip-performance-mobile__spotlight">
              <div>
                <div className="trip-performance-mobile__spotlight-label">Latest running balance</div>
                <div className="trip-performance-mobile__spotlight-value">
                  {latestDay?.balanceLabel ?? "BDT 0"}
                </div>
                <div className="trip-performance-mobile__spotlight-meta">
                  {latestDay
                    ? `${latestDay.dateLabel} - ${latestDay.netMovementLabel} net`
                    : "No daily balance records yet."}
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
                <div className="trip-performance-mobile__card-title">Balance and net movement</div>
                <div className="trip-performance-mobile__card-subtle">
                  Track the daily running balance alongside daily net flow
                </div>
              </div>
            </div>

            <RechartsAreaChart
              data={charts.balanceTrend ?? []}
              series={balanceTrendSeries}
              height={220}
              labelKey="label"
              valueFormatter={compactDailyCurrencyFormatter}
            />
          </section>

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Monthly cash flow mix</div>
                <div className="trip-performance-mobile__card-subtle">
                  Total credit versus total debit for the selected month
                </div>
              </div>
            </div>

            <RechartsPieChart
              items={charts.cashFlowMix ?? []}
              height={240}
              centerValueFormatter={compactDailyCurrencyFormatter}
              totalLabel="cash flow"
              valueFormatter={dailyCurrencyFormatter}
            />
          </section>

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Credit and debit mix</div>
                <div className="trip-performance-mobile__card-subtle">
                  Compare daily inflow and outflow across the month
                </div>
              </div>
            </div>

            <RechartsBarChart
              items={charts.cashFlowComposition ?? []}
              segments={cashFlowSegments}
              labelKey="label"
              height={280}
            />
          </section>

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Daily ledger</div>
                <div className="trip-performance-mobile__card-subtle">
                  Showing {pagination.from ?? 0}-{pagination.to ?? 0} of {pagination.total ?? 0}
                </div>
              </div>
              <div className="trip-performance-mobile__pill">
                Page {pagination.currentPage ?? 1}/{pagination.lastPage ?? 1}
              </div>
            </div>

            <div className="trip-performance-mobile__list">
              {days.length ? (
                days.map((day) => (
                  <article key={day.id} className="trip-performance-mobile__item">
                    <div className="trip-performance-mobile__item-top">
                      <div>
                        <div className="trip-performance-mobile__item-title">{day.dateLabel}</div>
                        <div className="trip-performance-mobile__item-meta">
                          {day.txCountLabel} transactions - {day.debitShareLabel}
                        </div>
                      </div>
                      <div className="trip-performance-mobile__item-profit">{day.balanceLabel}</div>
                    </div>
                    <div className="trip-performance-mobile__item-grid">
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{day.totalCreditLabel}</div>
                        <div className="trip-performance-mobile__item-grid-label">Credit</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{day.totalDebitLabel}</div>
                        <div className="trip-performance-mobile__item-grid-label">Debit</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{day.netMovementLabel}</div>
                        <div className="trip-performance-mobile__item-grid-label">Net</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{day.txCountLabel}</div>
                        <div className="trip-performance-mobile__item-grid-label">Transactions</div>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="trip-performance-mobile__empty">
                  {isLoading ? "Loading daily balance..." : "No daily balance data available."}
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

          <DailyBalanceMobileHistory
            changeHistoryPage={changeHistoryPage}
            history={history}
            isHistoryFetching={isHistoryFetching}
            isHistoryLoading={isHistoryLoading}
            onViewReport={onSelectReport}
            selectedReport={selectedReport}
          />
        </div>
      </div>
    </div>
  );
}
