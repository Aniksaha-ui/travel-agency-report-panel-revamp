import RechartsAreaChart from "../../../components/charts/RechartsAreaChart";
import RechartsBarChart from "../../../components/charts/RechartsBarChart";
import RechartsPieChart from "../../../components/charts/RechartsPieChart";
import RechartsRankingChart from "../../../components/charts/RechartsRankingChart";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import MetricsOverview from "../../dashboard/components/MetricsOverview";
import DailyBalanceHistorySection from "./DailyBalanceHistorySection";
import {
  balanceTrendSeries,
  cashFlowSegments,
  dailyCurrencyFormatter,
  compactDailyCurrencyFormatter,
  dailyBalanceColumns,
} from "./dailyBalanceView.config";

export default function DailyBalanceDesktopView({
  boardDate,
  changeHistoryPage,
  charts,
  copy,
  days,
  history,
  isHistoryFetching,
  isHistoryLoading,
  isLoading,
  latestDay,
  metrics,
  onSelectReport,
  pagination,
  selectedReport,
  summary,
  tableFooter,
}) {
  return (
    <div className="d-none d-md-block">
      <div className="page-header d-print-none trip-performance-page-header">
        <div className="container-xl">
          <div className="trip-performance-hero">
            <div className="trip-performance-hero__copy">
              <span className="trip-performance-hero__eyebrow">/admin/account/daily-balance</span>
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
                <span className="trip-performance-hero__meta-label">Latest balance</span>
                <strong>{latestDay?.balanceLabel ?? "BDT 0"}</strong>
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
                  title="Balance and net flow trend"
                  subtitle="Follow the daily running balance and net movement across visible dates."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsAreaChart
                    data={charts.balanceTrend ?? []}
                    series={balanceTrendSeries}
                    labelKey="label"
                    valueFormatter={compactDailyCurrencyFormatter}
                  />
                </Card>
              </div>

              <div className="col-12 col-xl-4">
                <Card
                  title="Transaction activity"
                  subtitle="Highest transaction counts by visible day."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsRankingChart
                    items={charts.transactionRanking ?? []}
                    labelKey="label"
                    valueKey="value"
                    tooltipLabel="Transactions"
                    valueFormatter={(value) => `${Number(value) || 0} transactions`}
                    getCellColor={(entry) => (Number(entry.value) > 3 ? "#38bdf8" : "#f59e0b")}
                  />
                </Card>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <div className="row g-3">
              <div className="col-12 col-xl-5">
                <Card
                  title="Daily balance spotlight"
                  subtitle="Latest visible balance and strongest balance checkpoint."
                  className="trip-performance-card border-0 h-100"
                >
                  <div className="trip-performance-highlight">
                    <div className="trip-performance-highlight__title">
                      {latestDay?.dateLabel ?? "No highlighted day yet"}
                    </div>
                    <div className="trip-performance-highlight__value">
                      {latestDay?.balanceLabel ?? "BDT 0"}
                    </div>
                    <div className="trip-performance-highlight__meta">
                      Credit {latestDay?.totalCreditLabel ?? "BDT 0"} - Debit{" "}
                      {latestDay?.totalDebitLabel ?? "BDT 0"}
                    </div>
                  </div>

                  <div className="trip-performance-summary-grid">
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">Total credit</span>
                      <strong>{summary.totalCreditLabel ?? "BDT 0"}</strong>
                    </div>
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">Total debit</span>
                      <strong>{summary.totalDebitLabel ?? "BDT 0"}</strong>
                    </div>
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">Net movement</span>
                      <strong>{summary.netMovementLabel ?? "BDT 0"}</strong>
                    </div>
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">Highest balance day</span>
                      <strong>{summary.highestBalanceDay?.dateLabel ?? "Not available"}</strong>
                    </div>
                  </div>

                  <div className="mt-3">
                    <RechartsPieChart
                      items={charts.cashFlowMix ?? []}
                      height={250}
                      centerValueFormatter={compactDailyCurrencyFormatter}
                      totalLabel="cash flow"
                      valueFormatter={dailyCurrencyFormatter}
                    />
                  </div>
                </Card>
              </div>

              <div className="col-12 col-xl-7">
                <Card
                  title="Credit and debit composition"
                  subtitle="Compare inflow and outflow for each visible daily balance."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsBarChart
                    items={charts.cashFlowComposition ?? []}
                    segments={cashFlowSegments}
                    labelKey="label"
                    height={350}
                  />
                </Card>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <Card
              title="Daily balance ledger"
              subtitle="Daily transaction count, credit, debit, net movement, and running balance."
              className="trip-performance-card border-0"
              bodyClassName="p-0"
              footer={tableFooter}
            >
              {isLoading && !days.length ? (
                <div className="p-4 text-center text-secondary">Loading daily balance data...</div>
              ) : (
                <Table
                  columns={dailyBalanceColumns}
                  data={days}
                  emptyTitle="No daily balance data"
                  emptyDescription="The report endpoint did not return any daily balance rows."
                />
              )}
            </Card>
          </section>

          <section className="dashboard-section">
            <DailyBalanceHistorySection
              changeHistoryPage={changeHistoryPage}
              history={history}
              isHistoryFetching={isHistoryFetching}
              isHistoryLoading={isHistoryLoading}
              onViewReport={onSelectReport}
              selectedReport={selectedReport}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
