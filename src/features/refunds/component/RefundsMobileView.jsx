import RechartsAreaChart from "../../../components/charts/RechartsAreaChart";
import RechartsPieChart from "../../../components/charts/RechartsPieChart";
import Badge from "../../../components/common/Badge";
import Button from "../../../components/common/Button";
import { CheckIcon, DisburseIcon } from "../../../components/common/ActionIcons";
import { refundCountFormatter, refundTrendSeries } from "./refundsView.config";

export default function RefundsMobileView({
  boardDate,
  changePage,
  charts,
  copy,
  disbursingRefundId,
  error,
  handleSearchChange,
  isDisbursing,
  isFetching,
  isLoading,
  metrics,
  onDisburseRefund,
  page,
  pagination,
  searchTerm,
  summary,
  refunds,
}) {
  return (
    <div className="d-md-none trip-performance-mobile refunds-mobile">
      <div className="container-xl">
        <div className="trip-performance-mobile__screen">
          <section className="trip-performance-mobile__hero refunds-mobile__hero">
            <div className="trip-performance-mobile__hero-top">
              <div>
                <div className="trip-performance-mobile__eyebrow">/admin/refund</div>
                <h2 className="trip-performance-mobile__title">{copy.pageTitle}</h2>
                <p className="trip-performance-mobile__subtitle">{copy.pageSubtitle}</p>
              </div>
              <span className="trip-performance-mobile__date">{boardDate}</span>
            </div>

            <div className="trip-performance-mobile__spotlight">
              <div>
                <div className="trip-performance-mobile__spotlight-label">Pending disbursement</div>
                <div className="trip-performance-mobile__spotlight-value">
                  {summary.pendingCountLabel ?? "0"} refunds
                </div>
                <div className="trip-performance-mobile__spotlight-meta">
                  {summary.pendingAmountLabel ?? "BDT 0"} waiting
                </div>
              </div>
              <div className="trip-performance-mobile__spotlight-stack">
                <span>{summary.disbursedCountLabel ?? "0"} done</span>
                <span>{summary.refundedSeatsLabel ?? "0"} seats</span>
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

          {error ? (
            <section className="trip-performance-mobile__card">
              <div className="text-danger">{error.message || "Unable to load refunds."}</div>
            </section>
          ) : null}

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Refund queue</div>
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
                placeholder="Search refunds"
                aria-label="Search refunds"
              />
            </div>

            <div className="trip-performance-mobile__list">
              {refunds.length ? (
                refunds.map((refund) => (
                  <article key={refund.id} className="trip-performance-mobile__item refunds-mobile__item">
                    <div className="trip-performance-mobile__item-top">
                      <div>
                        <div className="trip-performance-mobile__item-title">{refund.tripName}</div>
                        <div className="trip-performance-mobile__item-meta">{refund.bookingDateLabel}</div>
                      </div>
                      <Badge color={refund.tone}>{refund.statusLabel}</Badge>
                    </div>

                    <div className="trip-performance-mobile__item-grid">
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{refund.seatCountLabel}</div>
                        <div className="trip-performance-mobile__item-grid-label">Seats</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{refund.amountLabel}</div>
                        <div className="trip-performance-mobile__item-grid-label">Amount</div>
                      </div>
                    </div>

                    <div className="refunds-mobile__reason">{refund.reason}</div>

                    <div className="tickets-mobile__actions">
                      {refund.isPending ? (
                        <Button
                          className="btn-icon"
                          aria-label={`Disburse refund for ${refund.tripName}`}
                          title={`Disburse refund for ${refund.tripName}`}
                          icon={<DisburseIcon />}
                          isLoading={isDisbursing && String(disbursingRefundId) === String(refund.id)}
                          onClick={() => onDisburseRefund(refund)}
                        />
                      ) : (
                        <Button
                          variant="outline"
                          className="btn-icon"
                          aria-label="Already disbursed"
                          title="Already disbursed"
                          icon={<CheckIcon />}
                          disabled
                        />
                      )}
                    </div>
                  </article>
                ))
              ) : (
                <div className="trip-performance-mobile__empty">
                  {isLoading ? "Loading refunds..." : "No refund rows available."}
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

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Refund status mix</div>
                <div className="trip-performance-mobile__card-subtle">
                  Pending versus disbursed queue volume
                </div>
              </div>
            </div>

            <RechartsPieChart
              items={charts.statusMix ?? []}
              height={220}
              totalLabel="visible refunds"
              valueFormatter={refundCountFormatter}
              showTotal={false}
            />
          </section>

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Refund booking trend</div>
                <div className="trip-performance-mobile__card-subtle">
                  Trend of visible refund request dates
                </div>
              </div>
            </div>

            <RechartsAreaChart
              data={charts.bookingTrend ?? []}
              series={refundTrendSeries}
              height={220}
              labelKey="label"
              valueFormatter={(value) => Number(value) || 0}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
