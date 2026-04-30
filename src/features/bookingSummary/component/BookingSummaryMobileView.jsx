import RechartsPieChart from "../../../components/charts/RechartsPieChart";
import RechartsRankingChart from "../../../components/charts/RechartsRankingChart";
import { bookingCountFormatter } from "./bookingSummaryView.config";

export default function BookingSummaryMobileView({
  boardDate,
  categories,
  charts,
  copy,
  isLoading,
  metrics,
  summary,
}) {
  return (
    <div className="d-md-none trip-performance-mobile">
      <div className="container-xl">
        <div className="trip-performance-mobile__screen">
          <section className="trip-performance-mobile__hero">
            <div className="trip-performance-mobile__hero-top">
              <div>
                <div className="trip-performance-mobile__eyebrow">/admin/bookings/summary</div>
                <h2 className="trip-performance-mobile__title">{copy.pageTitle}</h2>
                <p className="trip-performance-mobile__subtitle">{copy.pageSubtitle}</p>
              </div>
              <span className="trip-performance-mobile__date">{boardDate}</span>
            </div>

            <div className="trip-performance-mobile__spotlight">
              <div>
                <div className="trip-performance-mobile__spotlight-label">Top booking type</div>
                <div className="trip-performance-mobile__spotlight-value">
                  {summary.topCategory?.bookingTypeLabel ?? "N/A"}
                </div>
                <div className="trip-performance-mobile__spotlight-meta">
                  {summary.topCategory?.totalBookingLabel ?? "0"} bookings -{" "}
                  {summary.topCategory?.shareLabel ?? "0% of bookings"}
                </div>
              </div>
              <div className="trip-performance-mobile__spotlight-stack">
                <span>{summary.totalBookingsLabel ?? "0"} total</span>
                <span>{summary.categoryCountLabel ?? "0"} types</span>
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
                <div className="trip-performance-mobile__card-title">Booking type mix</div>
                <div className="trip-performance-mobile__card-subtle">
                  Share by booking service category
                </div>
              </div>
            </div>

            <RechartsPieChart
              items={charts.bookingMix ?? []}
              height={240}
              totalLabel="bookings"
              valueFormatter={(value) => `${Number(value) || 0}`}
            />
          </section>

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Booking ranking</div>
                <div className="trip-performance-mobile__card-subtle">
                  Highest-volume categories first
                </div>
              </div>
            </div>

            <RechartsRankingChart
              items={charts.bookingRanking ?? []}
              labelKey="label"
              valueKey="value"
              height={240}
              tooltipLabel="Bookings"
              valueFormatter={bookingCountFormatter}
              getCellColor={(entry) => (Number(entry.value) >= 20 ? "#22c55e" : "#38bdf8")}
            />
          </section>

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Booking ledger</div>
                <div className="trip-performance-mobile__card-subtle">
                  Total booking count by type
                </div>
              </div>
              <div className="trip-performance-mobile__pill">
                {summary.categoryCountLabel ?? "0"} types
              </div>
            </div>

            <div className="trip-performance-mobile__list">
              {categories.length ? (
                categories.map((category) => (
                  <article key={category.id} className="trip-performance-mobile__item">
                    <div className="trip-performance-mobile__item-top">
                      <div>
                        <div className="trip-performance-mobile__item-title">
                          {category.bookingTypeLabel}
                        </div>
                        <div className="trip-performance-mobile__item-meta">{category.shareLabel}</div>
                      </div>
                      <div className="trip-performance-mobile__item-profit">
                        {category.totalBookingLabel}
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="trip-performance-mobile__empty">
                  {isLoading ? "Loading booking summary..." : "No booking summary data available."}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
