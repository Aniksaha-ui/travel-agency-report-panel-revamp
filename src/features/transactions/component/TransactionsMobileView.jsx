import RechartsAreaChart from "../../../components/charts/RechartsAreaChart";
import RechartsPieChart from "../../../components/charts/RechartsPieChart";
import Button from "../../../components/common/Button";
import {
  amountTrendSeries,
  transactionCompactCurrencyFormatter,
} from "./transactionsView.config";

export default function TransactionsMobileView({
  boardDate,
  changePage,
  charts,
  copy,
  isFetching,
  isLoading,
  metrics,
  page,
  pagination,
  summary,
  transactions,
}) {
  return (
    <div className="d-md-none trip-performance-mobile">
      <div className="container-xl">
        <div className="trip-performance-mobile__screen">
          <section className="trip-performance-mobile__hero">
            <div className="trip-performance-mobile__hero-top">
              <div>
                <div className="trip-performance-mobile__eyebrow">/admin/transactions</div>
                <h2 className="trip-performance-mobile__title">{copy.pageTitle}</h2>
                <p className="trip-performance-mobile__subtitle">{copy.pageSubtitle}</p>
              </div>
              <span className="trip-performance-mobile__date">{boardDate}</span>
            </div>

            <div className="trip-performance-mobile__spotlight">
              <div>
                <div className="trip-performance-mobile__spotlight-label">Highest visible payment</div>
                <div className="trip-performance-mobile__spotlight-value">
                  {summary.topTransaction?.amountLabel ?? "BDT 0"}
                </div>
                <div className="trip-performance-mobile__spotlight-meta">
                  {summary.topTransaction?.shortReference ?? "No transaction data available"}
                </div>
              </div>
              <div className="trip-performance-mobile__spotlight-stack">
                <span>{summary.totalAmountLabel ?? "BDT 0"} total</span>
                <span>{summary.uniqueMethodsLabel ?? "0"} methods</span>
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
                <div className="trip-performance-mobile__card-title">Amount trend</div>
                <div className="trip-performance-mobile__card-subtle">
                  Visible payments ordered by transaction time
                </div>
              </div>
            </div>

            <RechartsAreaChart
              data={charts.amountTrend ?? []}
              series={amountTrendSeries}
              height={220}
              labelKey="label"
              valueFormatter={transactionCompactCurrencyFormatter}
            />
          </section>

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Payment method mix</div>
                <div className="trip-performance-mobile__card-subtle">
                  Method share for visible transactions
                </div>
              </div>
            </div>

            <RechartsPieChart
              items={charts.methodMix ?? []}
              height={240}
              totalLabel="transactions"
              valueFormatter={(value) => `${Number(value) || 0}`}
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
              {transactions.length ? (
                transactions.map((transaction) => (
                  <article key={transaction.id} className="trip-performance-mobile__item">
                    <div className="trip-performance-mobile__item-top">
                      <div>
                        <div className="trip-performance-mobile__item-title">
                          {transaction.shortReference}
                        </div>
                        <div className="trip-performance-mobile__item-meta">
                          {transaction.createdAtLabel}
                        </div>
                      </div>
                      <div className="trip-performance-mobile__item-profit">{transaction.amountLabel}</div>
                    </div>
                    <div className="trip-performance-mobile__item-grid">
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">
                          {transaction.paymentMethod}
                        </div>
                        <div className="trip-performance-mobile__item-grid-label">Method</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">
                          {transaction.settlementStatus}
                        </div>
                        <div className="trip-performance-mobile__item-grid-label">Settlement</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">
                          #{transaction.paymentId}
                        </div>
                        <div className="trip-performance-mobile__item-grid-label">Payment ID</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">
                          {transaction.customerName}
                        </div>
                        <div className="trip-performance-mobile__item-grid-label">Customer</div>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="trip-performance-mobile__empty">
                  {isLoading ? "Loading transactions..." : "No transactions available."}
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
