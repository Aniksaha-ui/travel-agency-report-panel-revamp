import RechartsAreaChart from "../../../components/charts/RechartsAreaChart";
import RechartsPieChart from "../../../components/charts/RechartsPieChart";
import RechartsRankingChart from "../../../components/charts/RechartsRankingChart";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import MetricsOverview from "../../dashboard/components/MetricsOverview";
import {
  accountHistoryColumns,
  accountHistoryCurrencyFormatter,
  accountHistoryTrendSeries,
} from "./accountHistoryView.config";

export default function AccountHistoryDesktopView({
  boardDate,
  charts,
  copy,
  draftEndDate,
  draftStartDate,
  error,
  handleDateChange,
  handleSubmit,
  isFetching,
  isLoading,
  metrics,
  pagination,
  rows,
  summary,
  tableFooter,
}) {
  return (
    <div className="d-none d-md-block">
      <div className="page-header d-print-none trip-performance-page-header">
        <div className="container-xl">
          <div className="trip-performance-hero">
            <div className="trip-performance-hero__copy">
              <span className="trip-performance-hero__eyebrow">/admin/account/history</span>
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
            <Card
              title="Filter account history"
              subtitle="Use the same date-window search flow as the legacy report."
              className="trip-performance-card border-0"
            >
              <form className="account-history-filter" onSubmit={handleSubmit}>
                <div className="row g-3 align-items-end">
                  <div className="col-12 col-lg-4 account-history-filter__field">
                    <label className="form-label" htmlFor="account-history-start-date">
                      Start date
                    </label>
                    <input
                      id="account-history-start-date"
                      name="startDate"
                      type="date"
                      className="form-control"
                      value={draftStartDate}
                      onChange={handleDateChange}
                      required
                    />
                  </div>
                  <div className="col-12 col-lg-4 account-history-filter__field">
                    <label className="form-label" htmlFor="account-history-end-date">
                      End date
                    </label>
                    <input
                      id="account-history-end-date"
                      name="endDate"
                      type="date"
                      className="form-control"
                      value={draftEndDate}
                      onChange={handleDateChange}
                      required
                    />
                  </div>
                  <div className="col-12 col-lg-4 account-history-filter__submit">
                    <button className="btn btn-primary w-100" type="submit" disabled={isFetching}>
                      {isFetching ? "Refreshing..." : "Search"}
                    </button>
                  </div>
                </div>
              </form>
            </Card>
          </section>

          {error ? (
            <section className="dashboard-section">
              <Card title="Account history unavailable" className="trip-performance-card border-0">
                <div className="text-danger">
                  {error.message || "Unable to load account history information."}
                </div>
              </Card>
            </section>
          ) : null}

          <section className="dashboard-section">
            <MetricsOverview metrics={metrics} />
          </section>

          <section className="dashboard-section">
            <div className="row g-3">
              <div className="col-12 col-xl-8">
                <Card
                  title="Daily credit and debit trend"
                  subtitle="Spot heavier transaction days inside the selected range."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsAreaChart
                    data={charts.dailyTrend ?? []}
                    series={accountHistoryTrendSeries}
                    labelKey="label"
                    valueFormatter={accountHistoryCurrencyFormatter}
                  />
                </Card>
              </div>

              <div className="col-12 col-xl-4">
                <Card
                  title="Gateway mix"
                  subtitle="Visible amount distribution by gateway."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsPieChart
                    items={charts.gatewayMix ?? []}
                    height={320}
                    totalLabel="visible amount"
                    valueFormatter={accountHistoryCurrencyFormatter}
                  />
                </Card>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <div className="row g-3">
              <div className="col-12 col-xl-5">
                <Card
                  title="History spotlight"
                  subtitle="A quick read on credited total, debited total, and the freshest entry."
                  className="trip-performance-card border-0 h-100"
                >
                  <div className="trip-performance-highlight">
                    <div className="trip-performance-highlight__title">
                      {summary.latestTransaction?.purpose ?? "No highlighted transaction yet"}
                    </div>
                    <div className="trip-performance-highlight__value">
                      {summary.totalAmountLabel ?? "BDT 0.00"}
                    </div>
                    <div className="trip-performance-highlight__meta">
                      Latest {summary.latestTransaction?.transactionDateLabel ?? "Not available"} -{" "}
                      {summary.latestTransaction?.gateway ?? "No gateway"}
                    </div>
                  </div>

                  <div className="trip-performance-summary-grid">
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">Credited total</span>
                      <strong>{summary.creditedAmountLabel ?? "BDT 0.00"}</strong>
                    </div>
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">Debited total</span>
                      <strong>{summary.debitedAmountLabel ?? "BDT 0.00"}</strong>
                    </div>
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">Credit rows</span>
                      <strong>{summary.creditCountLabel ?? "0"}</strong>
                    </div>
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">Debit rows</span>
                      <strong>{summary.debitCountLabel ?? "0"}</strong>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="col-12 col-xl-7">
                <Card
                  title="Purpose ranking"
                  subtitle="Which payment purposes are carrying the most visible amount."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsRankingChart
                    items={charts.purposeRanking ?? []}
                    labelKey="label"
                    valueKey="value"
                    tooltipLabel="Amount"
                    valueFormatter={accountHistoryCurrencyFormatter}
                    getCellColor={() => "#2563eb"}
                  />
                </Card>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <Card
              title={copy.ledgerTitle}
              subtitle={copy.ledgerSubtitle}
              className="trip-performance-card border-0"
              bodyClassName="p-0"
              footer={tableFooter}
            >
              {isLoading && !rows.length ? (
                <div className="p-4 text-center text-secondary">Loading account history data...</div>
              ) : (
                <Table
                  columns={accountHistoryColumns}
                  data={rows}
                  emptyTitle="No account history rows"
                  emptyDescription="No records were returned for the selected date range."
                />
              )}
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
