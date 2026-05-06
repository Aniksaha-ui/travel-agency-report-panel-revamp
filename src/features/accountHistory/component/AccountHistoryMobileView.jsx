import Badge from "../../../components/common/Badge";
import Button from "../../../components/common/Button";
import RechartsAreaChart from "../../../components/charts/RechartsAreaChart";
import RechartsPieChart from "../../../components/charts/RechartsPieChart";
import {
  accountHistoryCurrencyFormatter,
  accountHistoryTrendSeries,
} from "./accountHistoryView.config";

export default function AccountHistoryMobileView({
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
  page,
  pagination,
  rows,
  summary,
  changePage,
}) {
  return (
    <div className="d-md-none trip-performance-mobile">
      <div className="container-xl">
        <div className="trip-performance-mobile__screen">
          <section className="trip-performance-mobile__hero account-history-mobile__hero">
            <div className="trip-performance-mobile__hero-top">
              <div>
                <div className="trip-performance-mobile__eyebrow">/admin/account/history</div>
                <h2 className="trip-performance-mobile__title">{copy.pageTitle}</h2>
                <p className="trip-performance-mobile__subtitle">{copy.pageSubtitle}</p>
              </div>
              <span className="trip-performance-mobile__date">{boardDate}</span>
            </div>

            <div className="trip-performance-mobile__spotlight">
              <div>
                <div className="trip-performance-mobile__spotlight-label">Credited total</div>
                <div className="trip-performance-mobile__spotlight-value">
                  {summary.totalAmountLabel ?? "BDT 0.00"}
                </div>
                <div className="trip-performance-mobile__spotlight-meta">
                  {summary.latestTransaction?.purpose ?? "No transaction highlighted yet"}
                </div>
              </div>
              <div className="trip-performance-mobile__spotlight-stack">
                <span>{summary.creditCountLabel ?? "0"} credit</span>
                <span>{summary.debitCountLabel ?? "0"} debit</span>
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
                <div className="trip-performance-mobile__card-title">Filter date range</div>
                <div className="trip-performance-mobile__card-subtle">
                  Search the same way as the legacy account history page
                </div>
              </div>
            </div>

            <form className="account-history-filter account-history-filter--mobile" onSubmit={handleSubmit}>
              <div className="account-history-filter__field">
                <label className="form-label" htmlFor="account-history-mobile-start-date">
                  Start date
                </label>
                <input
                  id="account-history-mobile-start-date"
                  name="startDate"
                  type="date"
                  className="form-control"
                  value={draftStartDate}
                  onChange={handleDateChange}
                  required
                />
              </div>
              <div className="account-history-filter__field">
                <label className="form-label" htmlFor="account-history-mobile-end-date">
                  End date
                </label>
                <input
                  id="account-history-mobile-end-date"
                  name="endDate"
                  type="date"
                  className="form-control"
                  value={draftEndDate}
                  onChange={handleDateChange}
                  required
                />
              </div>
              <Button type="submit" fullWidthOnMobile disabled={isFetching} className="account-history-filter__button">
                {isFetching ? "Refreshing..." : "Search"}
              </Button>
            </form>
          </section>

          {error ? (
            <section className="trip-performance-mobile__card">
              <div className="text-danger">{error.message || "Unable to load account history."}</div>
            </section>
          ) : null}

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Daily movement</div>
                <div className="trip-performance-mobile__card-subtle">
                  Credit and debit activity within the selected range
                </div>
              </div>
            </div>

            <RechartsAreaChart
              data={charts.dailyTrend ?? []}
              series={accountHistoryTrendSeries}
              height={220}
              labelKey="label"
              valueFormatter={accountHistoryCurrencyFormatter}
            />
          </section>

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Gateway mix</div>
                <div className="trip-performance-mobile__card-subtle">
                  Visible amount split by gateway
                </div>
              </div>
            </div>

            <RechartsPieChart
              items={charts.gatewayMix ?? []}
              height={240}
              totalLabel="visible amount"
              valueFormatter={accountHistoryCurrencyFormatter}
            />
          </section>

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Transaction ledger</div>
                <div className="trip-performance-mobile__card-subtle">
                  Showing {pagination.from ?? 0}-{pagination.to ?? 0} of {pagination.total ?? 0}
                </div>
              </div>
              <div className="trip-performance-mobile__pill">
                Page {pagination.currentPage ?? 1}/{pagination.lastPage ?? 1}
              </div>
            </div>

            <div className="trip-performance-mobile__list">
              {rows.length ? (
                rows.map((row) => (
                  <article key={row.id} className="trip-performance-mobile__item account-history-mobile__item">
                    <div className="trip-performance-mobile__item-top">
                      <div>
                        <div className="trip-performance-mobile__item-title">{row.purpose}</div>
                        <div className="trip-performance-mobile__item-meta">{row.transactionDateLabel}</div>
                      </div>
                      <Badge color={row.transactionTone}>{row.transactionTypeLabel}</Badge>
                    </div>

                    <div className="trip-performance-mobile__item-grid">
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{row.gateway}</div>
                        <div className="trip-performance-mobile__item-grid-label">Gateway</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{row.amountLabel}</div>
                        <div className="trip-performance-mobile__item-grid-label">Amount</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{row.userAccountNo}</div>
                        <div className="trip-performance-mobile__item-grid-label">User account</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{row.companyAccountNo}</div>
                        <div className="trip-performance-mobile__item-grid-label">Company account</div>
                      </div>
                    </div>

                    <div className="account-history-mobile__reference">
                      Ref: {row.transactionReference}
                    </div>
                  </article>
                ))
              ) : (
                <div className="trip-performance-mobile__empty">
                  {isLoading ? "Loading account history..." : "No records found for the selected range."}
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
