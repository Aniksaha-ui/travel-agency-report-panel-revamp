import RechartsAreaChart from "../../../components/charts/RechartsAreaChart";
import RechartsRankingChart from "../../../components/charts/RechartsRankingChart";
import {
  guideCurrencyFormatter,
  guideRatingFormatter,
  packageTrendSeries,
  renderPackageShare,
} from "./guideEfficiencyView.config";

export default function GuideEfficiencyMobileView({
  boardDate,
  charts,
  copy,
  guides,
  handleSearchChange,
  isLoading,
  metrics,
  searchTerm,
  summary,
  topGuide,
}) {
  return (
    <div className="d-md-none trip-performance-mobile">
      <div className="container-xl">
        <div className="trip-performance-mobile__screen">
          <section className="trip-performance-mobile__hero">
            <div className="trip-performance-mobile__hero-top">
              <div>
                <div className="trip-performance-mobile__eyebrow">/admin/guideEfficency</div>
                <h2 className="trip-performance-mobile__title">{copy.pageTitle}</h2>
                <p className="trip-performance-mobile__subtitle">{copy.pageSubtitle}</p>
              </div>
              <span className="trip-performance-mobile__date">{boardDate}</span>
            </div>

            <div className="trip-performance-mobile__spotlight">
              <div>
                <div className="trip-performance-mobile__spotlight-label">Most assigned guide</div>
                <div className="trip-performance-mobile__spotlight-value">
                  {topGuide?.totalPackagesLabel ?? "0"} packages
                </div>
                <div className="trip-performance-mobile__spotlight-meta">
                  {topGuide
                    ? `${topGuide.guideName} - ${topGuide.avgRatingLabel}`
                    : "No guide efficiency records yet."}
                </div>
              </div>
              <div className="trip-performance-mobile__spotlight-stack">
                <span>{summary.averageRatingLabel ?? "Unrated"}</span>
                <span>{summary.totalTripCostLabel ?? "BDT 0"}</span>
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
                <div className="trip-performance-mobile__card-title">Packages and ratings</div>
                <div className="trip-performance-mobile__card-subtle">
                  Unrated guides are shown as 0 on the chart
                </div>
              </div>
            </div>

            <RechartsAreaChart
              data={charts.packageTrend ?? []}
              series={packageTrendSeries}
              height={210}
              labelKey="label"
              valueFormatter={guideRatingFormatter}
            />
          </section>

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Trip cost leaders</div>
                <div className="trip-performance-mobile__card-subtle">
                  Highest visible trip cost across the guide list
                </div>
              </div>
            </div>

            <RechartsRankingChart
              items={charts.costRanking ?? []}
              labelKey="label"
              valueKey="value"
              height={250}
              tooltipLabel="Trip cost"
              valueFormatter={guideCurrencyFormatter}
              getCellColor={(entry) => (Number(entry.value) > 0 ? "#38bdf8" : "#64748b")}
            />
          </section>

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Guide ledger</div>
                <div className="trip-performance-mobile__card-subtle">
                  Search by guide name and review the visible assignments
                </div>
              </div>
              <div className="trip-performance-mobile__pill">
                {summary.totalGuidesLabel ?? "0"} total
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
                placeholder="Search guides"
                aria-label="Search guides"
              />
            </div>

            <div className="trip-performance-mobile__list">
              {guides.length ? (
                guides.map((guide) => (
                  <article key={guide.id} className="trip-performance-mobile__item">
                    <div className="trip-performance-mobile__item-top">
                      <div>
                        <div className="trip-performance-mobile__item-title">{guide.guideName}</div>
                        <div className="trip-performance-mobile__item-meta">
                          ID #{guide.guideId} - {guide.signalLabel}
                        </div>
                      </div>
                      <div className="trip-performance-mobile__item-profit">{guide.totalTripCostLabel}</div>
                    </div>
                    {renderPackageShare(guide)}
                    <div className="trip-performance-mobile__item-grid">
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">
                          {guide.totalPackagesLabel}
                        </div>
                        <div className="trip-performance-mobile__item-grid-label">Packages</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{guide.avgRatingLabel}</div>
                        <div className="trip-performance-mobile__item-grid-label">Rating</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">
                          {guide.tripCostShareLabel}
                        </div>
                        <div className="trip-performance-mobile__item-grid-label">Cost share</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{guide.signalLabel}</div>
                        <div className="trip-performance-mobile__item-grid-label">Signal</div>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="trip-performance-mobile__empty">
                  {isLoading ? "Loading guide efficiency..." : "No guide efficiency data available."}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
