import { startTransition, useState } from "react";
import RechartsAreaChart from "../../../components/charts/RechartsAreaChart";
import RechartsBarChart from "../../../components/charts/RechartsBarChart";
import RechartsRankingChart from "../../../components/charts/RechartsRankingChart";
import Button from "../../../components/common/Button";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import AdminLayout from "../../../layouts/AdminLayout";
import MetricsOverview from "../../dashboard/components/MetricsOverview";
import { MONTH_RUNNING_BALANCE_COPY } from "../constants/monthRunningBalance.constants";
import useMonthRunningBalance from "../hooks/useMonthRunningBalance";

const monthColumns = [
  {
    key: "monthLabel",
    header: "Month",
    render: (month) => (
      <div>
        <div className="fw-semibold">{month.monthLabel}</div>
        <div className="text-secondary small">{month.txCountLabel} transactions</div>
      </div>
    ),
  },
  {
    key: "openingBalanceLabel",
    header: "Opening balance",
    mobileLabel: "Opening",
  },
  {
    key: "totalCreditLabel",
    header: "Credit",
    mobileLabel: "Credit",
  },
  {
    key: "totalDebitLabel",
    header: "Debit",
    mobileLabel: "Debit",
  },
  {
    key: "netMovementLabel",
    header: "Net movement",
    mobileLabel: "Net",
    render: (month) => (
      <div>
        <div className="fw-semibold">{month.netMovementLabel}</div>
        <div className="text-secondary small">{month.balanceGrowthLabel}</div>
      </div>
    ),
  },
  {
    key: "closingBalanceLabel",
    header: "Closing balance",
    headerClassName: "text-end",
    cellClassName: "text-end fw-semibold",
  },
];

const balanceTrendSeries = [
  { key: "openingBalance", label: "Opening balance", color: "#38bdf8" },
  { key: "closingBalance", label: "Closing balance", color: "#22c55e" },
];

const cashFlowSegments = [
  { key: "credit", label: "Credit", color: "#22c55e" },
  { key: "debit", label: "Debit", color: "#f59e0b" },
];

export default function MonthRunningBalancePage() {
  const [page, setPage] = useState(1);
  const { data, isFetching, isLoading } = useMonthRunningBalance(page);
  const copy = data?.copy ?? MONTH_RUNNING_BALANCE_COPY;
  const metrics = data?.metrics ?? [];
  const months = data?.months ?? [];
  const pagination = data?.pagination ?? {};
  const summary = data?.summary ?? {};
  const charts = data?.charts ?? {};
  const latestMonth = summary.latestMonth;
  const boardDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date());

  const changePage = (nextPage) => {
    startTransition(() => {
      setPage(nextPage);
    });
  };

  const tableFooter = (
    <div className="trip-performance-table-footer">
      <div className="trip-performance-table-footer__summary">
        <strong>
          Showing {pagination.from ?? 0}-{pagination.to ?? 0}
        </strong>
        <span>of {pagination.total ?? 0} months</span>
      </div>
      <div className="trip-performance-table-footer__actions">
        <Button
          variant="outline"
          disabled={!pagination.hasPrev || isFetching}
          onClick={() => changePage(page - 1)}
        >
          Previous
        </Button>
        <Button disabled={!pagination.hasNext || isFetching} onClick={() => changePage(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="d-md-none trip-performance-mobile">
        <div className="container-xl">
          <div className="trip-performance-mobile__screen">
            <section className="trip-performance-mobile__hero">
              <div className="trip-performance-mobile__hero-top">
                <div>
                  <div className="trip-performance-mobile__eyebrow">/admin/monthRunningBalance</div>
                  <h2 className="trip-performance-mobile__title">{copy.pageTitle}</h2>
                  <p className="trip-performance-mobile__subtitle">{copy.pageSubtitle}</p>
                </div>
                <span className="trip-performance-mobile__date">{boardDate}</span>
              </div>

              <div className="trip-performance-mobile__spotlight">
                <div>
                  <div className="trip-performance-mobile__spotlight-label">Latest closing balance</div>
                  <div className="trip-performance-mobile__spotlight-value">
                    {latestMonth?.closingBalanceLabel ?? "BDT 0"}
                  </div>
                  <div className="trip-performance-mobile__spotlight-meta">
                    {latestMonth
                      ? `${latestMonth.monthLabel} • ${latestMonth.netMovementLabel} net`
                      : "No running balance records yet."}
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
                  <div className="trip-performance-mobile__card-title">Opening vs closing balance</div>
                  <div className="trip-performance-mobile__card-subtle">
                    Follow how the balance rolls from month to month
                  </div>
                </div>
              </div>

              <RechartsAreaChart
                data={charts.balanceTrend ?? []}
                series={balanceTrendSeries}
                height={220}
                labelKey="label"
                valueFormatter={(value) => `${Math.round(Number(value) / 1000)}k`}
              />
            </section>

            <section className="trip-performance-mobile__card">
              <div className="trip-performance-mobile__card-header">
                <div>
                  <div className="trip-performance-mobile__card-title">Credit and debit mix</div>
                  <div className="trip-performance-mobile__card-subtle">
                    Compare the monthly inflow and outflow side by side
                  </div>
                </div>
              </div>

              <RechartsBarChart
                items={charts.cashFlowComposition ?? []}
                segments={cashFlowSegments}
                labelKey="label"
                height={260}
              />
            </section>

            <section className="trip-performance-mobile__card">
              <div className="trip-performance-mobile__card-header">
                <div>
                  <div className="trip-performance-mobile__card-title">Monthly ledger</div>
                  <div className="trip-performance-mobile__card-subtle">
                    Showing {pagination.from ?? 0}-{pagination.to ?? 0} of {pagination.total ?? 0}
                  </div>
                </div>
                <div className="trip-performance-mobile__pill">
                  Page {pagination.currentPage ?? 1}/{pagination.lastPage ?? 1}
                </div>
              </div>

              <div className="trip-performance-mobile__list">
                {months.length ? (
                  months.map((month) => (
                    <article key={month.id} className="trip-performance-mobile__item">
                      <div className="trip-performance-mobile__item-top">
                        <div>
                          <div className="trip-performance-mobile__item-title">{month.monthLabel}</div>
                          <div className="trip-performance-mobile__item-meta">
                            {month.txCountLabel} transactions • {month.balanceGrowthLabel}
                          </div>
                        </div>
                        <div className="trip-performance-mobile__item-profit">{month.closingBalanceLabel}</div>
                      </div>
                      <div className="trip-performance-mobile__item-grid">
                        <div>
                          <div className="trip-performance-mobile__item-grid-value">
                            {month.openingBalanceLabel}
                          </div>
                          <div className="trip-performance-mobile__item-grid-label">Opening</div>
                        </div>
                        <div>
                          <div className="trip-performance-mobile__item-grid-value">
                            {month.totalCreditLabel}
                          </div>
                          <div className="trip-performance-mobile__item-grid-label">Credit</div>
                        </div>
                        <div>
                          <div className="trip-performance-mobile__item-grid-value">
                            {month.totalDebitLabel}
                          </div>
                          <div className="trip-performance-mobile__item-grid-label">Debit</div>
                        </div>
                        <div>
                          <div className="trip-performance-mobile__item-grid-value">
                            {month.netMovementLabel}
                          </div>
                          <div className="trip-performance-mobile__item-grid-label">Net</div>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="trip-performance-mobile__empty">
                    {isLoading ? "Loading monthly running balance..." : "No monthly running balance data available."}
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
                      valueFormatter={(value) => `${Math.round(Number(value) / 1000)}k`}
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
                      valueFormatter={(value) =>
                        `BDT ${new Intl.NumberFormat("en-US").format(Number(value) || 0)}`
                      }
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
                        Opening {latestMonth?.openingBalanceLabel ?? "BDT 0"} • Net{" "}
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
    </AdminLayout>
  );
}
