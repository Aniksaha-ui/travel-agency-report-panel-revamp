import RechartsAreaChart from "../../../components/charts/RechartsAreaChart";
import RechartsRankingChart from "../../../components/charts/RechartsRankingChart";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import MetricsOverview from "../../dashboard/components/MetricsOverview";
import {
  guideColumns,
  guideCurrencyFormatter,
  guideRatingFormatter,
  packageTrendSeries,
} from "./guideEfficiencyView.config";

export default function GuideEfficiencyDesktopView({
  boardDate,
  charts,
  copy,
  guides,
  handleSearchChange,
  isLoading,
  metrics,
  searchTerm,
  summary,
  tableFooter,
  topGuide,
}) {
  return (
    <div className="d-none d-md-block">
      <div className="page-header d-print-none trip-performance-page-header">
        <div className="container-xl">
          <div className="trip-performance-hero">
            <div className="trip-performance-hero__copy">
              <span className="trip-performance-hero__eyebrow">/admin/guideEfficency</span>
              <h2 className="page-title">{copy.pageTitle}</h2>
              <p className="text-secondary mb-0">{copy.pageSubtitle}</p>
            </div>

            <div className="trip-performance-hero__meta">
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Visible guides</span>
                <strong>{summary.totalGuidesLabel ?? "0"}</strong>
              </div>
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Rated guides</span>
                <strong>{summary.ratedGuideCountLabel ?? "0"}</strong>
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
                  title="Packages and rating footprint"
                  subtitle="Compare assignment volume against submitted traveler ratings for the visible guide list."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsAreaChart
                    data={charts.packageTrend ?? []}
                    series={packageTrendSeries}
                    labelKey="label"
                    valueFormatter={guideRatingFormatter}
                  />
                </Card>
              </div>

              <div className="col-12 col-xl-4">
                <Card
                  title="Trip cost leaders"
                  subtitle="Guides carrying the highest visible trip cost."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsRankingChart
                    items={charts.costRanking ?? []}
                    labelKey="label"
                    valueKey="value"
                    tooltipLabel="Trip cost"
                    valueFormatter={guideCurrencyFormatter}
                    getCellColor={(entry) => (Number(entry.value) > 0 ? "#38bdf8" : "#64748b")}
                  />
                </Card>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <div className="row g-3">
              <div className="col-12 col-xl-5">
                <Card
                  title="Assignment spotlight"
                  subtitle="Guide leading the visible result set by package count."
                  className="trip-performance-card border-0 h-100"
                >
                  <div className="trip-performance-highlight">
                    <div className="trip-performance-highlight__title">
                      {topGuide?.guideName ?? "No highlighted guide yet"}
                    </div>
                    <div className="trip-performance-highlight__value">
                      {topGuide?.totalPackagesLabel ?? "0"} packages
                    </div>
                    <div className="trip-performance-highlight__meta">
                      Rating {topGuide?.avgRatingLabel ?? "Unrated"} - Trip cost{" "}
                      {topGuide?.totalTripCostLabel ?? "BDT 0"}
                    </div>
                  </div>

                  <div className="trip-performance-summary-grid">
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">Visible packages</span>
                      <strong>{summary.totalPackagesLabel ?? "0"}</strong>
                    </div>
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">Trip cost total</span>
                      <strong>{summary.totalTripCostLabel ?? "BDT 0"}</strong>
                    </div>
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">Average rating</span>
                      <strong>{summary.averageRatingLabel ?? "Unrated"}</strong>
                    </div>
                    <div className="trip-performance-summary-grid__item">
                      <span className="trip-performance-summary-grid__label">Top rated guide</span>
                      <strong>{summary.topRatedGuide?.guideName ?? "Not available"}</strong>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="col-12 col-xl-7">
                <Card
                  title="Package leaders"
                  subtitle="Highest assignment count among the currently visible guides."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsRankingChart
                    items={charts.packageRanking ?? []}
                    labelKey="label"
                    valueKey="value"
                    tooltipLabel="Packages"
                    valueFormatter={(value) => `${Number(value) || 0} packages`}
                    getCellColor={(entry) => (Number(entry.value) > 0 ? "#22c55e" : "#64748b")}
                  />
                </Card>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <Card
              title="Guide efficiency ledger"
              subtitle="Assignments, ratings, package share, and trip cost for each visible guide."
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
                      placeholder="Search guides"
                      aria-label="Search guides"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </div>
                </div>
              }
            >
              {isLoading && !guides.length ? (
                <div className="p-4 text-center text-secondary">Loading guide efficiency data...</div>
              ) : (
                <Table
                  columns={guideColumns}
                  data={guides}
                  emptyTitle="No guide efficiency data"
                  emptyDescription="The report endpoint did not return any guide rows."
                />
              )}
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
