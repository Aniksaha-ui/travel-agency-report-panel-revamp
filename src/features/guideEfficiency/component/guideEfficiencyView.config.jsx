import Badge from "../../../components/common/Badge";

export const renderPackageShare = (guide) => (
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

export const guideColumns = [
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

export const packageTrendSeries = [
  { key: "packages", label: "Packages", color: "#38bdf8" },
  { key: "rating", label: "Rating", color: "#f59e0b" },
];

export const guideCurrencyFormatter = (value) =>
  `BDT ${new Intl.NumberFormat("en-US").format(Number(value) || 0)}`;

export const guideRatingFormatter = (value) => Number(value).toFixed(Number(value) < 10 ? 1 : 0);
