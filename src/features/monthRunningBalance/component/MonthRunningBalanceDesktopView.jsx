import RechartsAreaChart from "../../../components/charts/RechartsAreaChart";
import RechartsBarChart from "../../../components/charts/RechartsBarChart";
import RechartsRankingChart from "../../../components/charts/RechartsRankingChart";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import MetricsOverview from "../../dashboard/components/MetricsOverview";
import {
  balanceCurrencyFormatter,
  balanceTrendSeries,
  cashFlowSegments,
  compactBalanceFormatter,
  monthColumns,
} from "./monthRunningBalanceView.config";

export default function MonthRunningBalanceDesktopView({
  boardDate,
  charts,
  copy,
  isLoading,
  latestMonth,
  metrics,
  months,
  pagination,
  summary,
  tableFooter,
}) {
  return (
    <div className="d-none d-md-block">
      <div className="page-header d-print-none trip-performance-page-header">
        <div className="container-xl">
          <div className="trip-performance-hero">
            <div className="trip-performance-hero__copy">
              <span className="trip-performance-hero__eyebrow">/admin/monthRunningBalance</span>
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
                  title="Balance carry-forward trend"
                  subtitle="See how the opening balance evolves into the closing balance each month."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsAreaChart
                    data={charts.balanceTrend ?? []}
                    series={balanceTrendSeries}
                    labelKey="label"
                    valueFormatter={compactBalanceFormatter}
                  />
                </Card>
              </div>

              <div className="col-12 col-xl-4">
                <Card
                  title="Monthly net movement"
                  subtitle="Net credit minus debit for each visible month."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsRankingChart
                    items={charts.monthlyMovement ?? []}
                    labelKey="label"
                    valueKey="value"
                    tooltipLabel="Net movement"
                    valueFormatter={balanceCurrencyFormatter}
                    getCellColor={(entry) => (Number(entry.value) >= 0 ? "#22c55e" : "#ef4444")}
                  />
                </Card>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <div className="row g-3">
              <div className="col-12 col-xl-5">
                <Card
                  title="Balance spotlight"
                  subtitle="Latest visible month and the strongest balance checkpoint."
                  className="trip-performance-card border-0 h-100"
                >
                  <div className="trip-performance-highlight">
                    <div className="trip-performance-highlight__title">
                      {latestMonth?.monthLabel ?? "No highlighted month yet"}
                    </div>
                    <div className="trip-performance-highlight__value">
                      {latestMonth?.closingBalanceLabel ?? "BDT 0"}
                    </div>
                    <div className="trip-performance-highlight__meta">
                      Opening {latestMonth?.openingBalanceLabel ?? "BDT 0"} - Net{" "}
                      {latestMonth?.netMovementLabel ?? "BDT 0"}
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
                      <span className="trip-performance-summary-grid__label">Highest closing month</span>
                      <strong>{summary.highestClosingMonth?.monthLabel ?? "Not available"}</strong>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="col-12 col-xl-7">
                <Card
                  title="Credit and debit composition"
                  subtitle="Visualize both inflow and outflow so the table stays easier to scan."
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
              title="Monthly running balance ledger"
              subtitle="Month-by-month opening balance, credit, debit, net movement, and closing balance."
              className="trip-performance-card border-0"
              bodyClassName="p-0"
              footer={tableFooter}
            >
              {isLoading && !months.length ? (
                <div className="p-4 text-center text-secondary">Loading monthly running balance data...</div>
              ) : (
                <Table
                  columns={monthColumns}
                  data={months}
                  emptyTitle="No monthly running balance data"
                  emptyDescription="The report endpoint did not return any monthly balance rows."
                />
              )}
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
