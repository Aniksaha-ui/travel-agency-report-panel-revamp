import { startTransition, useState } from "react";
import RechartsAreaChart from "../../../components/charts/RechartsAreaChart";
import RechartsRankingChart from "../../../components/charts/RechartsRankingChart";
import Badge from "../../../components/common/Badge";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import useDebouncedValue from "../../../hooks/useDebouncedValue";
import AdminLayout from "../../../layouts/AdminLayout";
import MetricsOverview from "../../dashboard/components/MetricsOverview";
import { GUIDE_EFFICIENCY_COPY } from "../constants/guideEfficiency.constants";
import useGuideEfficiency from "../hooks/useGuideEfficiency";

const renderPackageShare = (guide) => (
  <div className="trip-performance-meter">
    <div className="trip-performance-meter__label">{guide.packageShareLabel}</div>
    <div className="trip-performance-meter__track">
      <span
        className="trip-performance-meter__fill"
        style={{ width: `${Math.min(guide.packageShare, 100)}%` }}
      />
    </div>
  </div>
);

const guideColumns = [
  {
    key: "guideName",
    header: "Guide",
    render: (guide) => (
      <div>
        <div className="fw-semibold">{guide.guideName}</div>
        <div className="text-secondary small">ID #{guide.guideId}</div>
      </div>
    ),
  },
  {
    key: "totalPackagesLabel",
    header: "Packages",
    mobileLabel: "Packages",
    render: (guide) => (
      <div>
        <div className="fw-semibold">{guide.totalPackagesLabel}</div>
        <div className="text-secondary small">{guide.packageShareLabel}</div>
      </div>
    ),
  },
  {
    key: "avgRatingLabel",
    header: "Average rating",
    mobileLabel: "Rating",
    render: (guide) => (
      <div>
        <div className="fw-semibold">{guide.avgRatingLabel}</div>
        <div className="text-secondary small">{guide.reviewStatusLabel}</div>
      </div>
    ),
  },
  {
    key: "packageShare",
    header: "Package share",
    render: renderPackageShare,
  },
  {
    key: "totalTripCostLabel",
    header: "Trip cost",
    headerClassName: "text-end",
    cellClassName: "text-end fw-semibold",
  },
  {
    key: "signalLabel",
    header: "Signal",
    render: (guide) => (
      <div className="d-flex flex-column align-items-start gap-1">
        <Badge color={guide.signalTone}>{guide.signalLabel}</Badge>
        <span className="text-secondary small">{guide.tripCostShareLabel}</span>
      </div>
    ),
  },
];

const packageTrendSeries = [
  { key: "packages", label: "Packages", color: "#38bdf8" },
  { key: "rating", label: "Rating", color: "#f59e0b" },
];

export default function GuideEfficiencyPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 450);
  const { data, isLoading } = useGuideEfficiency(debouncedSearchTerm);
  const copy = data?.copy ?? GUIDE_EFFICIENCY_COPY;
  const metrics = data?.metrics ?? [];
  const guides = data?.guides ?? [];
  const summary = data?.summary ?? {};
  const charts = data?.charts ?? {};
  const topGuide = summary.topPackageGuide;
  const boardDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date());

  const handleSearchChange = (event) => {
    const { value } = event.target;

    startTransition(() => {
      setSearchTerm(value);
    });
  };

  const tableFooter = (
    <div className="trip-performance-table-footer">
      <div className="trip-performance-table-footer__summary">
        <strong>Showing {guides.length}</strong>
        <span>
          of {summary.totalGuidesLabel ?? "0"} guides
          {debouncedSearchTerm ? ` for "${debouncedSearchTerm}"` : ""}
        </span>
      </div>
      <div className="trip-performance-table-footer__summary">
        <strong>{summary.totalPackagesLabel ?? "0"} packages</strong>
        <span>{summary.totalTripCostLabel ?? "BDT 0"} visible trip cost</span>
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
                valueFormatter={(value) => Number(value).toFixed(Number(value) < 10 ? 1 : 0)}
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
                valueFormatter={(value) => `BDT ${new Intl.NumberFormat("en-US").format(Number(value) || 0)}`}
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
                      valueFormatter={(value) => Number(value).toFixed(Number(value) < 10 ? 1 : 0)}
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
                      valueFormatter={(value) =>
                        `BDT ${new Intl.NumberFormat("en-US").format(Number(value) || 0)}`
                      }
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
    </AdminLayout>
  );
}
