import RechartsPieChart from "../../../components/charts/RechartsPieChart";
import RechartsRankingChart from "../../../components/charts/RechartsRankingChart";
import {
  overallSalesCompactCurrencyFormatter,
  overallSalesCurrencyFormatter,
  routeBookingFormatter,
} from "./overallSalesView.config";
import OverallSalesTabs from "./OverallSalesTabs";

export default function OverallSalesMobileView({
  activeReport,
  boardDate,
  copy,
  isLoading,
  metrics,
  onChangeReport,
  overall,
  routeWise,
}) {
  const isRouteWiseReport = activeReport === "routeWise";

  return (
    <div className="d-md-none trip-performance-mobile">
      <div className="container-xl">
        <div className="trip-performance-mobile__screen">
          <section className="trip-performance-mobile__hero">
            <div className="trip-performance-mobile__hero-top">
              <div>
                <div className="trip-performance-mobile__eyebrow">/admin/account/overall-sales</div>
                <h2 className="trip-performance-mobile__title">{copy.pageTitle}</h2>
                <p className="trip-performance-mobile__subtitle">{copy.pageSubtitle}</p>
              </div>
              <span className="trip-performance-mobile__date">{boardDate}</span>
            </div>

            <div className="trip-performance-mobile__spotlight">
              <div>
                <div className="trip-performance-mobile__spotlight-label">
                  {isRouteWiseReport ? "Top route" : "Top sales source"}
                </div>
                <div className="trip-performance-mobile__spotlight-value">
                  {isRouteWiseReport
                    ? routeWise.topRoute?.routeName ?? "N/A"
                    : overall.topSource?.source ?? "N/A"}
                </div>
                <div className="trip-performance-mobile__spotlight-meta">
                  {isRouteWiseReport
                    ? `${routeWise.topRoute?.totalRevenueLabel ?? "BDT 0"} - ${
                        routeWise.topRoute?.totalBookingsLabel ?? "0"
                      } bookings`
                    : `${overall.topSource?.amountLabel ?? "BDT 0"} - ${
                        overall.topSource?.shareLabel ?? "0%"
                      }`}
                </div>
              </div>
              <div className="trip-performance-mobile__spotlight-stack">
                <span>{overall.totalSalesLabel ?? "BDT 0"}</span>
                <span>{routeWise.totalRouteBookingsLabel ?? "0"} bookings</span>
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
            <OverallSalesTabs
              activeReport={activeReport}
              onChangeReport={onChangeReport}
              overall={overall}
              routeWise={routeWise}
            />
          </section>

          {activeReport === "overall" ? (
          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Overall Sales Summary</div>
                <div className="trip-performance-mobile__card-subtle">
                  Source-wise total sales amount
                </div>
              </div>
            </div>

            <RechartsPieChart
              items={overall.charts?.salesMix ?? []}
              height={240}
              centerValueFormatter={overallSalesCompactCurrencyFormatter}
              totalLabel="sales"
              valueFormatter={overallSalesCurrencyFormatter}
            />

            <div className="trip-performance-mobile__list">
              {overall.sources?.length ? (
                overall.sources.map((source) => (
                  <article key={source.id} className="trip-performance-mobile__item">
                    <div className="trip-performance-mobile__item-top">
                      <div>
                        <div className="trip-performance-mobile__item-title">{source.source}</div>
                        <div className="trip-performance-mobile__item-meta">{source.shareLabel}</div>
                      </div>
                      <div className="trip-performance-mobile__item-profit">{source.amountLabel}</div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="trip-performance-mobile__empty">
                  {isLoading ? "Loading overall sales..." : "No overall sales data available."}
                </div>
              )}
            </div>
          </section>
          ) : null}

          {activeReport === "routeWise" ? (
            <>
          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Route-Wise Sales Summary</div>
                <div className="trip-performance-mobile__card-subtle">
                  Revenue ranking across routes
                </div>
              </div>
            </div>

            <RechartsRankingChart
              items={routeWise.charts?.routeRevenueRanking ?? []}
              labelKey="label"
              valueKey="value"
              height={260}
              tooltipLabel="Revenue"
              valueFormatter={overallSalesCurrencyFormatter}
              getCellColor={(entry) => (Number(entry.value) > 1000000 ? "#22c55e" : "#38bdf8")}
            />
          </section>

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Route ledger</div>
                <div className="trip-performance-mobile__card-subtle">
                  Bookings and revenue by route
                </div>
              </div>
              <div className="trip-performance-mobile__pill">
                {routeWise.routes?.length ?? 0} routes
              </div>
            </div>

            <div className="trip-performance-mobile__list">
              {routeWise.routes?.length ? (
                routeWise.routes.map((route) => (
                  <article key={route.id} className="trip-performance-mobile__item">
                    <div className="trip-performance-mobile__item-top">
                      <div>
                        <div className="trip-performance-mobile__item-title">{route.routeName}</div>
                        <div className="trip-performance-mobile__item-meta">
                          {routeBookingFormatter(route.totalBookings)} - {route.averageRevenueLabel} avg
                        </div>
                      </div>
                      <div className="trip-performance-mobile__item-profit">{route.totalRevenueLabel}</div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="trip-performance-mobile__empty">
                  {isLoading ? "Loading route-wise sales..." : "No route-wise sales data available."}
                </div>
              )}
            </div>
          </section>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
