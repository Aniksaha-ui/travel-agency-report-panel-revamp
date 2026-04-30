import RechartsAreaChart from "../../../components/charts/RechartsAreaChart";
import RechartsPieChart from "../../../components/charts/RechartsPieChart";
import RechartsRankingChart from "../../../components/charts/RechartsRankingChart";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import MetricsOverview from "../../dashboard/components/MetricsOverview";
import {
  amountTrendSeries,
  transactionColumns,
  transactionCompactCurrencyFormatter,
  transactionCurrencyFormatter,
} from "./transactionsView.config";

export default function TransactionsDesktopView({
  boardDate,
  charts,
  copy,
  isLoading,
  metrics,
  pagination,
  summary,
  tableFooter,
  transactions,
}) {
  return (
    <div className="d-none d-md-block">
      <div className="page-header d-print-none trip-performance-page-header">
        <div className="container-xl">
          <div className="trip-performance-hero">
            <div className="trip-performance-hero__copy">
              <span className="trip-performance-hero__eyebrow">/admin/transactions</span>
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
                <span className="trip-performance-hero__meta-label">Visible amount</span>
                <strong>{summary.totalAmountLabel ?? "BDT 0"}</strong>
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
                  title="Transaction amount trend"
                  subtitle="Payment amount movement across the currently visible transaction list."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsAreaChart
                    data={charts.amountTrend ?? []}
                    series={amountTrendSeries}
                    labelKey="label"
                    valueFormatter={transactionCompactCurrencyFormatter}
                  />
                </Card>
              </div>

              <div className="col-12 col-xl-4">
                <Card
                  title="Payment method mix"
                  subtitle="Share of visible transactions by payment method."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsPieChart
                    items={charts.methodMix ?? []}
                    height={300}
                    totalLabel="transactions"
                    valueFormatter={(value) => `${Number(value) || 0}`}
                  />
                </Card>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <div className="row g-3">
              <div className="col-12 col-xl-5">
                <Card
                  title="Transaction spotlight"
                  subtitle="Highest visible transaction and settlement state summary."
                  className="trip-performance-card border-0 h-100"
                >
                  <div className="trip-performance-highlight">
                    <div className="trip-performance-highlight__title">
                      {summary.topTransaction?.shortReference ?? "No highlighted transaction yet"}
                    </div>
                    <div className="trip-performance-highlight__value">
                      {summary.topTransaction?.amountLabel ?? "BDT 0"}
                    </div>
                    <div className="trip-performance-highlight__meta">
                      {summary.topTransaction
                        ? `${summary.topTransaction.paymentMethod} - ${summary.topTransaction.createdAtLabel}`
                        : "No transaction data available"}
                    </div>
                  </div>

                  <div className="trip-performance-summary-grid">
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">Visible amount</span>
                      <strong>{summary.totalAmountLabel ?? "BDT 0"}</strong>
                    </div>
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">Average amount</span>
                      <strong>{summary.averageAmountLabel ?? "BDT 0"}</strong>
                    </div>
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">Methods</span>
                      <strong>{summary.uniqueMethodsLabel ?? "0"}</strong>
                    </div>
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">Pending settlements</span>
                      <strong>{summary.pendingSettlementsLabel ?? "0"}</strong>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="col-12 col-xl-7">
                <Card
                  title="Highest visible payments"
                  subtitle="Transactions sorted by payment amount."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsRankingChart
                    items={charts.amountRanking ?? []}
                    labelKey="label"
                    valueKey="value"
                    tooltipLabel="Amount"
                    valueFormatter={transactionCurrencyFormatter}
                    getCellColor={(entry) => (Number(entry.value) > 0 ? "#38bdf8" : "#64748b")}
                  />
                </Card>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <Card
              title="Transaction ledger"
              subtitle="References, customers, methods, settlement data, and visible payment amounts."
              className="trip-performance-card border-0"
              bodyClassName="p-0"
              footer={tableFooter}
            >
              {isLoading && !transactions.length ? (
                <div className="p-4 text-center text-secondary">Loading transactions...</div>
              ) : (
                <Table
                  columns={transactionColumns}
                  data={transactions}
                  emptyTitle="No transactions"
                  emptyDescription="The report endpoint did not return any transaction rows."
                />
              )}
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
