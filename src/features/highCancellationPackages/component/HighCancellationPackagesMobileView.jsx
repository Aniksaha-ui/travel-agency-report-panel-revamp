import Badge from "../../../components/common/Badge";
import RechartsRankingChart from "../../../components/charts/RechartsRankingChart";

export default function HighCancellationPackagesMobileView({
  boardDate,
  charts,
  copy,
  isLoading,
  metrics,
  packages,
  summary,
}) {
  return (
    <div className="d-md-none trip-performance-mobile">
      <div className="container-xl">
        <div className="trip-performance-mobile__screen">
          <section className="trip-performance-mobile__hero">
            <div className="trip-performance-mobile__hero-top">
              <div>
                <div className="trip-performance-mobile__eyebrow">/admin/high-cancellation-packages</div>
                <h2 className="trip-performance-mobile__title">
                  {copy?.pageTitle ?? "High cancellation packages"}
                </h2>
                <p className="trip-performance-mobile__subtitle">
                  {copy?.pageSubtitle ?? "Review packages with the highest cancellation rate from the report API."}
                </p>
              </div>
              <span className="trip-performance-mobile__date">{boardDate}</span>
            </div>

            <div className="trip-performance-mobile__spotlight">
              <div>
                <div className="trip-performance-mobile__spotlight-label">Highest risk package</div>
                <div className="trip-performance-mobile__spotlight-value">
                  {summary.highestPackage?.cancellationRateLabel ?? "0%"}
                </div>
                <div className="trip-performance-mobile__spotlight-meta">
                  {summary.highestPackage?.packageName ?? "No package data available"}
                </div>
              </div>
              <div className="trip-performance-mobile__spotlight-stack">
                <span>{summary.totalBookingsLabel ?? "0"} bookings</span>
                <span>{summary.totalCancelledLabel ?? "0"} cancelled</span>
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
                <div className="trip-performance-mobile__card-title">Cancellation rate ranking</div>
                <div className="trip-performance-mobile__card-subtle">
                  Packages ordered by the highest cancellation rate
                </div>
              </div>
            </div>

            <RechartsRankingChart
              items={charts.cancellationRanking ?? []}
              labelKey="label"
              valueKey="value"
              tooltipLabel="Cancellation rate"
              valueFormatter={(value) => `${Number(value) || 0}%`}
              getCellColor={() => "#ef4444"}
            />
          </section>

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Package breakdown</div>
                <div className="trip-performance-mobile__card-subtle">
                  Booking and cancellation details for each package
                </div>
              </div>
              <div className="trip-performance-mobile__pill">
                Avg {summary.averageRateLabel ?? "0%"}
              </div>
            </div>

            <div className="trip-performance-mobile__list">
              {packages.length ? (
                packages.map((item) => (
                  <article key={item.id} className="trip-performance-mobile__item">
                    <div className="trip-performance-mobile__item-top">
                      <div>
                        <div className="trip-performance-mobile__item-title">{item.packageName}</div>
                        <div className="trip-performance-mobile__item-meta">
                          {item.totalBookingsLabel} bookings • {item.cancelledCountLabel} cancelled
                        </div>
                      </div>
                      <div className="trip-performance-mobile__item-profit">
                        <Badge color={item.tone}>{item.cancellationRateLabel}</Badge>
                      </div>
                    </div>
                    <div className="trip-performance-mobile__item-grid">
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{item.totalBookingsLabel}</div>
                        <div className="trip-performance-mobile__item-grid-label">Total bookings</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{item.cancelledCountLabel}</div>
                        <div className="trip-performance-mobile__item-grid-label">Cancelled</div>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="trip-performance-mobile__empty">
                  {isLoading
                    ? "Loading high cancellation packages..."
                    : "No high cancellation package data available."}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
