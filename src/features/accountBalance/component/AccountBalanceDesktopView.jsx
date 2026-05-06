import RechartsPieChart from "../../../components/charts/RechartsPieChart";
import RechartsRankingChart from "../../../components/charts/RechartsRankingChart";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import MetricsOverview from "../../dashboard/components/MetricsOverview";
import {
  accountBalanceCurrencyFormatter,
  getAccountBalanceColumns,
} from "./accountBalanceView.config";

export default function AccountBalanceDesktopView({
  accounts,
  boardDate,
  charts,
  copy,
  error,
  isLoading,
  metrics,
  onViewHistory,
  summary,
}) {
  return (
    <div className="d-none d-md-block">
      <div className="page-header d-print-none trip-performance-page-header">
        <div className="container-xl">
          <div className="trip-performance-hero">
            <div className="trip-performance-hero__copy">
              <span className="trip-performance-hero__eyebrow">/admin/account/balance</span>
              <h2 className="page-title">{copy.pageTitle}</h2>
              <p className="text-secondary mb-0">{copy.pageSubtitle}</p>
            </div>

            <div className="trip-performance-hero__meta">
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Accounts</span>
                <strong>{summary.accountCountLabel ?? "0"}</strong>
              </div>
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Balance types</span>
                <strong>{summary.uniqueTypeCountLabel ?? "0"}</strong>
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
              <Card title="Account balance unavailable" className="trip-performance-card border-0">
                <div className="text-danger">
                  {error.message || "Unable to load account balance information."}
                </div>
              </Card>
            </section>
          ) : null}

          <section className="dashboard-section">
            <MetricsOverview metrics={metrics} />
          </section>

          <section className="dashboard-section">
            <div className="row g-3">
              <div className="col-12 col-xl-5">
                <Card
                  title="Balance spotlight"
                  subtitle="The strongest account on the current report and how the balances are spread."
                  className="trip-performance-card border-0 h-100"
                >
                  <div className="account-balance-spotlight">
                    <div className="account-balance-spotlight__label">Visible balance</div>
                    <div className="account-balance-spotlight__value">
                      {summary.totalBalanceLabel ?? "BDT 0"}
                    </div>
                    <div className="account-balance-spotlight__meta">
                      {summary.topAccount
                        ? `${summary.topAccount.accountName} leads with ${summary.topAccount.amountLabel}`
                        : "No account balance rows available yet."}
                    </div>
                  </div>

                  <div className="account-balance-spotlight__grid">
                    <div className="account-balance-spotlight__grid-item">
                      <span>Top account</span>
                      <strong>{summary.topAccount?.accountName ?? "Not available"}</strong>
                    </div>
                    <div className="account-balance-spotlight__grid-item">
                      <span>Account number</span>
                      <strong>{summary.topAccount?.accountNumber ?? "Not available"}</strong>
                    </div>
                    <div className="account-balance-spotlight__grid-item">
                      <span>Balance type</span>
                      <strong>{summary.topAccount?.typeLabel ?? "Not available"}</strong>
                    </div>
                    <div className="account-balance-spotlight__grid-item">
                      <span>Balance amount</span>
                      <strong>{summary.topAccount?.amountLabel ?? "BDT 0"}</strong>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="col-12 col-xl-7">
                <Card
                  title="Balance share by type"
                  subtitle="A quick distribution view of how much money sits in each account type."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsPieChart
                    items={charts.typeDistribution ?? []}
                    height={320}
                    totalLabel="visible balance"
                    valueFormatter={accountBalanceCurrencyFormatter}
                  />
                </Card>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <div className="row g-3">
              <div className="col-12 col-xl-7">
                <Card
                  title="Top account balances"
                  subtitle="Largest account balances in the current result set."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsRankingChart
                    items={charts.accountRanking ?? []}
                    labelKey="label"
                    valueKey="value"
                    tooltipLabel="Balance"
                    valueFormatter={accountBalanceCurrencyFormatter}
                    yAxisWidth={160}
                    chartMargin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    getCellColor={() => "#2563eb"}
                  />
                </Card>
              </div>

              <div className="col-12 col-xl-5">
                <Card
                  title="Balance share by account"
                  subtitle="See how the visible balance is split across the top loaded accounts."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsPieChart
                    items={charts.accountDistribution ?? []}
                    height={320}
                    totalLabel="visible balance"
                    valueFormatter={accountBalanceCurrencyFormatter}
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
            >
              {isLoading && !accounts.length ? (
                <div className="p-4 text-center text-secondary">Loading account balance data...</div>
              ) : (
                <Table
                  columns={getAccountBalanceColumns(onViewHistory)}
                  data={accounts}
                  emptyTitle="No account balance rows"
                  emptyDescription="The account balance endpoint did not return any accounts."
                />
              )}
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
