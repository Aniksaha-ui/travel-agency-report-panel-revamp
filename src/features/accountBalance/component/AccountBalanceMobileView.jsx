import Badge from "../../../components/common/Badge";
import Button from "../../../components/common/Button";
import RechartsPieChart from "../../../components/charts/RechartsPieChart";
import { accountBalanceCurrencyFormatter } from "./accountBalanceView.config";

export default function AccountBalanceMobileView({
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
    <div className="d-md-none trip-performance-mobile">
      <div className="container-xl">
        <div className="trip-performance-mobile__screen">
          <section className="trip-performance-mobile__hero account-balance-mobile__hero">
            <div className="trip-performance-mobile__hero-top">
              <div>
                <div className="trip-performance-mobile__eyebrow">/admin/account/balance</div>
                <h2 className="trip-performance-mobile__title">{copy.pageTitle}</h2>
                <p className="trip-performance-mobile__subtitle">{copy.pageSubtitle}</p>
              </div>
              <span className="trip-performance-mobile__date">{boardDate}</span>
            </div>

            <div className="trip-performance-mobile__spotlight">
              <div>
                <div className="trip-performance-mobile__spotlight-label">Visible balance</div>
                <div className="trip-performance-mobile__spotlight-value">
                  {summary.totalBalanceLabel ?? "BDT 0"}
                </div>
                <div className="trip-performance-mobile__spotlight-meta">
                  {summary.topAccount?.accountName ?? "No leading account yet"}
                </div>
              </div>
              <div className="trip-performance-mobile__spotlight-stack">
                <span>{summary.accountCountLabel ?? "0"} accounts</span>
                <span>{summary.uniqueTypeCountLabel ?? "0"} types</span>
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
              <div className="text-danger">{error.message || "Unable to load account balance."}</div>
            </section>
          ) : null}

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Balance share by type</div>
                <div className="trip-performance-mobile__card-subtle">
                  Distribution of visible balance across account types
                </div>
              </div>
            </div>

            <RechartsPieChart
              items={charts.typeDistribution ?? []}
              height={240}
              totalLabel="visible balance"
              valueFormatter={accountBalanceCurrencyFormatter}
            />
          </section>

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Balance share by account</div>
                <div className="trip-performance-mobile__card-subtle">
                  See how the visible balance is split across the top loaded accounts
                </div>
              </div>
            </div>

            <RechartsPieChart
              items={charts.accountDistribution ?? []}
              height={240}
              totalLabel="visible balance"
              valueFormatter={accountBalanceCurrencyFormatter}
            />
          </section>

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Account ledger</div>
                <div className="trip-performance-mobile__card-subtle">
                  Tap into history by balance type
                </div>
              </div>
            </div>

            <div className="trip-performance-mobile__list">
              {accounts.length ? (
                accounts.map((account) => (
                  <article key={account.id} className="trip-performance-mobile__item account-balance-mobile__item">
                    <div className="trip-performance-mobile__item-top">
                      <div>
                        <div className="trip-performance-mobile__item-title">{account.accountName}</div>
                        <div className="trip-performance-mobile__item-meta">{account.accountNumber}</div>
                      </div>
                      <Badge color={account.typeTone}>{account.typeLabel}</Badge>
                    </div>

                    <div className="trip-performance-mobile__item-grid">
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{account.amountLabel}</div>
                        <div className="trip-performance-mobile__item-grid-label">Balance</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{account.typeLabel}</div>
                        <div className="trip-performance-mobile__item-grid-label">Type</div>
                      </div>
                    </div>

                    <Button fullWidthOnMobile variant="outline" onClick={() => onViewHistory(account)}>
                      View history
                    </Button>
                  </article>
                ))
              ) : (
                <div className="trip-performance-mobile__empty">
                  {isLoading ? "Loading account balance..." : "No account balance rows available."}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
