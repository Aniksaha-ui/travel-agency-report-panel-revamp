import RechartsAreaChart from "../../../components/charts/RechartsAreaChart";
import RechartsBarChart from "../../../components/charts/RechartsBarChart";
import RechartsRankingChart from "../../../components/charts/RechartsRankingChart";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import MetricsOverview from "../../dashboard/components/MetricsOverview";
import {
  compactFinancialFormatter,
  financialCompositionSegments,
  financialReportColumns,
  financialTrendSeries,
} from "./financialReportView.config";

export default function FinancialReportDesktopView({
  boardDate,
  charts,
  copy,
  isLoading,
  metrics,
  pagination,
  reports,
  summary,
  tableFooter,
}) {
  const latestReport = summary.latestReport;

  return (
    <div className="d-none d-md-block">
      <div className="page-header d-print-none trip-performance-page-header">
        <div className="container-xl">
          <div className="trip-performance-hero">
            <div className="trip-performance-hero__copy">
              <span className="trip-performance-hero__eyebrow">/admin/financialReport</span>
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
                <span className="trip-performance-hero__meta-label">Margin</span>
                <strong>{summary.totalMarginRateLabel ?? "0%"}</strong>
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
                  title="Payments and retained trend"
                  subtitle="Compare fiscal payment intake with retained value after refunds and costing."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsAreaChart
                    data={charts.fiscalTrend ?? []}
                    series={financialTrendSeries}
                    labelKey="label"
                    valueFormatter={compactFinancialFormatter}
                  />
                </Card>
              </div>

              <div className="col-12 col-xl-4">
                <Card
                  title="Margin performance"
                  subtitle="Retained margin percentage by fiscal year."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsRankingChart
                    items={charts.marginRanking ?? []}
                    labelKey="label"
                    valueKey="value"
                    tooltipLabel="Margin"
                    valueFormatter={(value) => `${Number(value) || 0}%`}
                    getCellColor={(entry) => (Number(entry.value) >= 80 ? "#22c55e" : "#f59e0b")}
                  />
                </Card>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <div className="row g-3">
              <div className="col-12 col-xl-5">
                <Card
                  title="Fiscal spotlight"
                  subtitle="Latest fiscal report and retained value summary."
                  className="trip-performance-card border-0 h-100"
                >
                  <div className="trip-performance-highlight">
                    <div className="trip-performance-highlight__title">
                      {latestReport?.shortFiscalYearLabel ?? "No highlighted fiscal year yet"}
                    </div>
                    <div className="trip-performance-highlight__value">
                      {latestReport?.retainedAmountLabel ?? "BDT 0"}
                    </div>
                    <div className="trip-performance-highlight__meta">
                      Payments {latestReport?.paymentAmountLabel ?? "BDT 0"} - Costing{" "}
                      {latestReport?.costingLabel ?? "BDT 0"}
                    </div>
                  </div>

                  <div className="trip-performance-summary-grid">
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">Total payments</span>
                      <strong>{summary.totalPaymentsLabel ?? "BDT 0"}</strong>
                    </div>
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">Total refunds</span>
                      <strong>{summary.totalRefundsLabel ?? "BDT 0"}</strong>
                    </div>
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">Total costing</span>
                      <strong>{summary.totalCostingLabel ?? "BDT 0"}</strong>
                    </div>
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">Retained margin</span>
                      <strong>{summary.totalMarginRateLabel ?? "0%"}</strong>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="col-12 col-xl-7">
                <Card
                  title="Financial composition"
                  subtitle="Retained value, costing, and refunds for each fiscal report."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsBarChart
                    items={charts.financialComposition ?? []}
                    segments={financialCompositionSegments}
                    labelKey="label"
                    height={350}
                  />
                </Card>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <Card
              title="Financial report ledger"
              subtitle="Fiscal year payments, refunds, costing, retained value, and margin."
              className="trip-performance-card border-0"
              bodyClassName="p-0"
              footer={tableFooter}
            >
              {isLoading && !reports.length ? (
                <div className="p-4 text-center text-secondary">Loading financial report data...</div>
              ) : (
                <Table
                  columns={financialReportColumns}
                  data={reports}
                  emptyTitle="No financial report data"
                  emptyDescription="The report endpoint did not return any financial rows."
                />
              )}
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
