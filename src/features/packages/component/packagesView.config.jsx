import Button from "../../../components/common/Button";
import Badge from "../../../components/common/Badge";
import ViewIcon from "../../../components/common/ViewIcon";

const COVERAGE_TONE_MAP = {
  Meal: "warning",
  Hotel: "info",
  Bus: "success",
};

export const getPackageColumns = (onViewDetails) => [
  {
    key: "name",
    header: "Package",
    render: (pkg) => (
      <div>
        <div className="fw-semibold">{pkg.name}</div>
        <div className="text-secondary small">Package ID #{pkg.packageId}</div>
      </div>
    ),
  },
  {
    key: "tripName",
    header: "Trip",
    render: (pkg) => (
      <div>
        <div className="fw-semibold">{pkg.tripName}</div>
        <div className="text-secondary small">{pkg.coverageLabel}</div>
      </div>
    ),
  },
  {
    key: "coverageItems",
    header: "Coverage",
    mobileLabel: "Coverage",
    render: (pkg) => (
      <div className="d-flex flex-wrap gap-1 justify-content-start">
        {pkg.coverageItems.length ? (
          pkg.coverageItems.map((item) => (
            <Badge key={item} color={COVERAGE_TONE_MAP[item] || "neutral"}>
              {item}
            </Badge>
          ))
        ) : (
          <Badge color="neutral">Custom</Badge>
        )}
      </div>
    ),
  },
  {
    key: "updatedAtLabel",
    header: "Updated",
    render: (pkg) => (
      <div>
        <div className="fw-semibold">{pkg.updatedAtLabel}</div>
        <div className="text-secondary small">Created {pkg.createdAtLabel}</div>
      </div>
    ),
  },
  {
    key: "actions",
    header: "Action",
    headerClassName: "text-end",
    cellClassName: "text-end",
    render: (pkg) => (
      <Button
        variant="outline"
        className="btn-sm btn-icon"
        aria-label={`View ${pkg.name}`}
        title={`View ${pkg.name}`}
        icon={<ViewIcon />}
        onClick={() => onViewDetails(pkg.packageId)}
      />
    ),
  },
];
