import RechartsAreaChart from "../../../components/charts/RechartsAreaChart";
import RechartsPieChart from "../../../components/charts/RechartsPieChart";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import MetricsOverview from "../../dashboard/components/MetricsOverview";
import {
  createRefundColumns,
  refundCountFormatter,
  refundTrendSeries,
} from "./refundsView.config";

export default function RefundsDesktopView({
  boardDate,
  charts,
  copy,
  disbursingRefundId,
  error,
  handleSearchChange,
  isDisbursing,
  isLoading,
  metrics,
  onDisburseRefund,
  searchTerm,
  summary,
  tableFooter,
  refunds,
}) {
  const columns = createRefundColumns({
    disbursingRefundId,
    isDisbursing,
    onDisburseRefund,
  });

  return (
    <div className="d-none d-md-block">
      <div className="page-header d-print-none trip-performance-page-header">
        <div className="container-xl">
          <div className="trip-performance-hero refunds-hero">
            <div className="trip-performance-hero__copy">
              <span className="trip-performance-hero__eyebrow">/admin/refund</span>
              <h2 className="page-title">{copy.pageTitle}</h2>
              <p className="text-secondary mb-0">{copy.pageSubtitle}</p>
            </div>

            <div className="trip-performance-hero__meta">
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Pending</span>
                <strong>{summary.pendingCountLabel ?? "0"}</strong>
              </div>
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Visible value</span>
                <strong>{summary.totalVisibleAmountLabel ?? "BDT 0"}</strong>
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
          {error ? (
            <section className="dashboard-section">
              <Card title="Refund feed unavailable" className="trip-performance-card border-0">
                <div className="text-danger">
                  {error.message || "Unable to load refund information."}
                </div>
              </Card>
            </section>
          ) : null}

          <section className="dashboard-section">
            <div className="row g-3">
              <div className="col-12 col-xl-8">
                <Card
                  title="Refund queue"
                  subtitle="Search refund requests and disburse pending payouts directly from the queue."
                  className="trip-performance-card border-0 refunds-table-card"
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
                          placeholder="Search refunds"
                          aria-label="Search refunds"
                          value={searchTerm}
                          onChange={handleSearchChange}
                        />
                      </div>
                    </div>
                  }
                >
                  {isLoading && !refunds.length ? (
                    <div className="p-4 text-center text-secondary">Loading refunds...</div>
                  ) : (
                    <Table
                      columns={columns}
                      data={refunds}
                      emptyTitle="No refunds found"
                      emptyDescription="The refund endpoint did not return any queue rows."
                    />
                  )}
                </Card>
              </div>

              <div className="col-12 col-xl-4">
                <Card
                  title="Operations board"
                  subtitle="The refunds that need action first."
                  className="trip-performance-card border-0 refunds-ops-card h-100"
                >
                  <div className="refunds-ops-card__metrics">
                    <div className="refunds-ops-card__metric">
                      <span>Pending payouts</span>
                      <strong>{summary.pendingCountLabel ?? "0"}</strong>
                    </div>
                    <div className="refunds-ops-card__metric">
                      <span>Pending value</span>
                      <strong>{summary.pendingAmountLabel ?? "BDT 0"}</strong>
                    </div>
                    <div className="refunds-ops-card__metric">
                      <span>Disbursed</span>
                      <strong>{summary.disbursedCountLabel ?? "0"}</strong>
                    </div>
                  </div>

                  <div className="refunds-ops-card__focus">
                    <div className="refunds-ops-card__eyebrow">Next pending refund</div>
                    <div className="refunds-ops-card__title">
                      {summary.nextPendingRefund?.tripName ?? "No pending refunds left on this page"}
                    </div>
                    <div className="refunds-ops-card__meta">
                      {summary.nextPendingRefund
                        ? `${summary.nextPendingRefund.bookingDateLabel} • ${summary.nextPendingRefund.amountLabel}`
                        : "Everything currently visible has already been disbursed."}
                    </div>
                  </div>

                  <div className="refunds-ops-card__focus refunds-ops-card__focus--soft">
                    <div className="refunds-ops-card__eyebrow">Latest disbursement</div>
                    <div className="refunds-ops-card__title">
                      {summary.latestDisbursedRefund?.tripName ?? "No disbursed refunds on this page"}
                    </div>
                    <div className="refunds-ops-card__meta">
                      {summary.latestDisbursedRefund
                        ? `${summary.latestDisbursedRefund.updatedAtLabel} • ${summary.latestDisbursedRefund.amountLabel}`
                        : "Disbursed payouts will appear here once completed."}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <MetricsOverview metrics={metrics} />
          </section>

          <section className="dashboard-section">
            <div className="row g-3">
              <div className="col-12 col-xl-5">
                <Card
                  title="Refund status mix"
                  subtitle="Pending and disbursed queue distribution for the visible refund set."
                  className="trip-performance-card border-0 h-100 refunds-panel-card"
                >
                  <RechartsPieChart
                    items={charts.statusMix ?? []}
                    height={300}
                    totalLabel="visible refunds"
                    valueFormatter={refundCountFormatter}
                    valueKey="value"
                    showTotal={false}
                  />
                </Card>
              </div>

              <div className="col-12 col-xl-7">
                <Card
                  title="Refund booking trend"
                  subtitle="How frequently the visible refunds were created over time."
                  className="trip-performance-card border-0 h-100 refunds-panel-card"
                >
                  <RechartsAreaChart
                    data={charts.bookingTrend ?? []}
                    series={refundTrendSeries}
                    labelKey="label"
                    height={300}
                    valueFormatter={(value) => Number(value) || 0}
                  />
                </Card>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
