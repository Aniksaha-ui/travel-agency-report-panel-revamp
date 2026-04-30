import { startTransition, useState } from "react";
import RechartsAreaChart from "../../../components/charts/RechartsAreaChart";
import RechartsRankingChart from "../../../components/charts/RechartsRankingChart";
import Badge from "../../../components/common/Badge";
import Button from "../../../components/common/Button";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import useDebouncedValue from "../../../hooks/useDebouncedValue";
import AdminLayout from "../../../layouts/AdminLayout";
import MetricsOverview from "../../dashboard/components/MetricsOverview";
import { CUSTOMER_VALUE_COPY } from "../constants/customerValue.constants";
import useCustomerValue from "../hooks/useCustomerValue";

const renderSpendShare = (customer) => (
  <div className="trip-performance-meter">
    <div className="trip-performance-meter__label">{customer.spendShareLabel}</div>
    <div className="trip-performance-meter__track">
      <span
        className="trip-performance-meter__fill"
        style={{ width: `${Math.min(customer.spendShare, 100)}%` }}
      />
    </div>
  </div>
);

const customerColumns = [
  {
    key: "customerName",
    header: "Customer",
    render: (customer) => (
      <div>
        <div className="fw-semibold">{customer.customerName}</div>
        <div className="text-secondary small">ID #{customer.userId}</div>
      </div>
    ),
  },
  {
    key: "totalBookingsLabel",
    header: "Bookings",
    mobileLabel: "Bookings",
    render: (customer) => (
      <div>
        <div className="fw-semibold">{customer.totalBookingsLabel}</div>
        <div className="text-secondary small">
          {customer.tripBookingsLabel} trip • {customer.packageBookingsLabel} package
        </div>
      </div>
    ),
  },
  {
    key: "spendShare",
    header: "Spend share",
    render: renderSpendShare,
  },
  {
    key: "totalPaidLabel",
    header: "Total paid",
    headerClassName: "text-end",
    cellClassName: "text-end fw-semibold",
  },
  {
    key: "netSpentLabel",
    header: "Net spent",
    headerClassName: "text-end",
    cellClassName: "text-end fw-semibold",
  },
  {
    key: "customerTierLabel",
    header: "Tier",
    render: (customer) => (
      <div className="d-flex flex-column align-items-start gap-1">
        <Badge color={customer.customerTierTone}>{customer.customerTierLabel}</Badge>
        <span className="text-secondary small">{customer.refundRateLabel}</span>
      </div>
    ),
  },
];

const spendTrendSeries = [
  { key: "paid", label: "Paid", color: "#38bdf8" },
  { key: "netSpent", label: "Net spent", color: "#22c55e" },
];

export default function CustomerValuePage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 450);
  const { data, isFetching, isLoading } = useCustomerValue(page, debouncedSearchTerm);
  const copy = data?.copy ?? CUSTOMER_VALUE_COPY;
  const metrics = data?.metrics ?? [];
  const customers = data?.customers ?? [];
  const pagination = data?.pagination ?? {};
  const summary = data?.summary ?? {};
  const charts = data?.charts ?? {};
  const topCustomer = summary.topCustomer;
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

  const handleSearchChange = (event) => {
    const { value } = event.target;

    startTransition(() => {
      setSearchTerm(value);
      setPage(1);
    });
  };

  const tableFooter = (
    <div className="trip-performance-table-footer">
      <div className="trip-performance-table-footer__summary">
        <strong>
          Showing {pagination.from ?? 0}-{pagination.to ?? 0}
        </strong>
        <span>
          of {pagination.total ?? 0} customers
          {debouncedSearchTerm ? ` for "${debouncedSearchTerm}"` : ""}
        </span>
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
                  <div className="trip-performance-mobile__eyebrow">/admin/customerValueReport</div>
                  <h2 className="trip-performance-mobile__title">{copy.pageTitle}</h2>
                  <p className="trip-performance-mobile__subtitle">{copy.pageSubtitle}</p>
                </div>
                <span className="trip-performance-mobile__date">{boardDate}</span>
              </div>

              <div className="trip-performance-mobile__spotlight">
                <div>
                  <div className="trip-performance-mobile__spotlight-label">Top customer by net spend</div>
                  <div className="trip-performance-mobile__spotlight-value">
                    {topCustomer?.netSpentLabel ?? "BDT 0"}
                  </div>
                  <div className="trip-performance-mobile__spotlight-meta">
                    {topCustomer
                      ? `${topCustomer.customerName} • ${topCustomer.totalBookingsLabel} bookings`
                      : "No customer value records yet."}
                  </div>
                </div>
                <div className="trip-performance-mobile__spotlight-stack">
                  <span>{summary.visibleBookingsLabel ?? "0"} bookings</span>
                  <span>{summary.averageCustomerValueLabel ?? "BDT 0"} avg</span>
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
                  <div className="trip-performance-mobile__card-title">Paid vs net spent</div>
                  <div className="trip-performance-mobile__card-subtle">
                    Compare gross spend and retained spend across the visible list
                  </div>
                </div>
              </div>

              <RechartsAreaChart
                data={charts.spendTrend ?? []}
                series={spendTrendSeries}
                height={210}
                labelKey="label"
                valueFormatter={(value) => `${Math.round(Number(value) / 1000)}k`}
              />
            </section>

            <section className="trip-performance-mobile__card">
              <div className="trip-performance-mobile__card-header">
                <div>
                  <div className="trip-performance-mobile__card-title">Net spend leaders</div>
                  <div className="trip-performance-mobile__card-subtle">
                    Highest visible net spend across customers
                  </div>
                </div>
              </div>

              <RechartsRankingChart
                items={charts.spendRanking ?? []}
                labelKey="label"
                valueKey="value"
                height={250}
                tooltipLabel="Net spent"
                valueFormatter={(value) => `BDT ${new Intl.NumberFormat("en-US").format(Number(value) || 0)}`}
                getCellColor={(entry) => (Number(entry.value) > 0 ? "#22c55e" : "#64748b")}
              />
            </section>

            <section className="trip-performance-mobile__card">
              <div className="trip-performance-mobile__card-header">
                <div>
                  <div className="trip-performance-mobile__card-title">Customer ledger</div>
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
                  placeholder="Search customers"
                  aria-label="Search customers"
                />
              </div>

              <div className="trip-performance-mobile__list">
                {customers.length ? (
                  customers.map((customer) => (
                    <article key={customer.id} className="trip-performance-mobile__item">
                      <div className="trip-performance-mobile__item-top">
                        <div>
                          <div className="trip-performance-mobile__item-title">{customer.customerName}</div>
                          <div className="trip-performance-mobile__item-meta">
                            {customer.totalBookingsLabel} bookings • {customer.customerTierLabel}
                          </div>
                        </div>
                        <div className="trip-performance-mobile__item-profit">{customer.netSpentLabel}</div>
                      </div>
                      {renderSpendShare(customer)}
                      <div className="trip-performance-mobile__item-grid">
                        <div>
                          <div className="trip-performance-mobile__item-grid-value">
                            {customer.tripBookingsLabel}
                          </div>
                          <div className="trip-performance-mobile__item-grid-label">Trip bookings</div>
                        </div>
                        <div>
                          <div className="trip-performance-mobile__item-grid-value">
                            {customer.packageBookingsLabel}
                          </div>
                          <div className="trip-performance-mobile__item-grid-label">Package bookings</div>
                        </div>
                        <div>
                          <div className="trip-performance-mobile__item-grid-value">
                            {customer.totalPaidLabel}
                          </div>
                          <div className="trip-performance-mobile__item-grid-label">Paid</div>
                        </div>
                        <div>
                          <div className="trip-performance-mobile__item-grid-value">
                            {customer.averageBookingValueLabel}
                          </div>
                          <div className="trip-performance-mobile__item-grid-label">Avg booking value</div>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="trip-performance-mobile__empty">
                    {isLoading ? "Loading customer value..." : "No customer value data available."}
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
                <span className="trip-performance-hero__eyebrow">/admin/customerValueReport</span>
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
                    title="Paid and retained value trend"
                    subtitle="Compare total paid against net spend for the currently visible customers."
                    className="trip-performance-card border-0 h-100"
                  >
                    <RechartsAreaChart
                      data={charts.spendTrend ?? []}
                      series={spendTrendSeries}
                      labelKey="label"
                      valueFormatter={(value) => `${Math.round(Number(value) / 1000)}k`}
                    />
                  </Card>
                </div>

                <div className="col-12 col-xl-4">
                  <Card
                    title="Net spend leaders"
                    subtitle="Highest retained revenue across the visible customer set."
                    className="trip-performance-card border-0 h-100"
                  >
                    <RechartsRankingChart
                      items={charts.spendRanking ?? []}
                      labelKey="label"
                      valueKey="value"
                      tooltipLabel="Net spent"
                      valueFormatter={(value) =>
                        `BDT ${new Intl.NumberFormat("en-US").format(Number(value) || 0)}`
                      }
                      getCellColor={(entry) => (Number(entry.value) > 0 ? "#22c55e" : "#64748b")}
                    />
                  </Card>
                </div>
              </div>
            </section>

            <section className="dashboard-section">
              <div className="row g-3">
                <div className="col-12 col-xl-5">
                  <Card
                    title="Customer spotlight"
                    subtitle="Top visible customer by net spend on the current page."
                    className="trip-performance-card border-0 h-100"
                  >
                    <div className="trip-performance-highlight">
                      <div className="trip-performance-highlight__title">
                        {topCustomer?.customerName ?? "No highlighted customer yet"}
                      </div>
                      <div className="trip-performance-highlight__value">
                        {topCustomer?.netSpentLabel ?? "BDT 0"}
                      </div>
                      <div className="trip-performance-highlight__meta">
                        Paid {topCustomer?.totalPaidLabel ?? "BDT 0"} • {topCustomer?.totalBookingsLabel ?? "0"}{" "}
                        bookings
                      </div>
                    </div>

                    <div className="trip-performance-summary-grid">
                      <div className="trip-performance-summary-grid__item">
                        <span className="trip-performance-summary-grid__label">Visible net spend</span>
                        <strong>{summary.visibleNetSpentLabel ?? "BDT 0"}</strong>
                      </div>
                      <div className="trip-performance-summary-grid__item">
                        <span className="trip-performance-summary-grid__label">Visible paid</span>
                        <strong>{summary.visibleTotalPaidLabel ?? "BDT 0"}</strong>
                      </div>
                      <div className="trip-performance-summary-grid__item">
                        <span className="trip-performance-summary-grid__label">Avg customer value</span>
                        <strong>{summary.averageCustomerValueLabel ?? "BDT 0"}</strong>
                      </div>
                      <div className="trip-performance-summary-grid__item">
                        <span className="trip-performance-summary-grid__label">Top booking customer</span>
                        <strong>{summary.topBookingCustomer?.customerName ?? "Not available"}</strong>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="col-12 col-xl-7">
                  <Card
                    title="Booking leaders"
                    subtitle="Customers generating the highest total booking count."
                    className="trip-performance-card border-0 h-100"
                  >
                    <RechartsRankingChart
                      items={charts.bookingRanking ?? []}
                      labelKey="label"
                      valueKey="value"
                      tooltipLabel="Bookings"
                      valueFormatter={(value) => `${Number(value) || 0} bookings`}
                      getCellColor={(entry) => (Number(entry.value) > 0 ? "#38bdf8" : "#64748b")}
                    />
                  </Card>
                </div>
              </div>
            </section>

            <section className="dashboard-section">
              <Card
                title="Customer value ledger"
                subtitle="Bookings, payments, refunds, and retained customer value."
                className="trip-performance-card border-0"
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
                        placeholder="Search customers"
                        aria-label="Search customers"
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                    </div>
                  </div>
                }
              >
                {isLoading && !customers.length ? (
                  <div className="p-4 text-center text-secondary">Loading customer value data...</div>
                ) : (
                  <Table
                    columns={customerColumns}
                    data={customers}
                    emptyTitle="No customer value data"
                    emptyDescription="The report endpoint did not return any customer rows."
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
