import Badge from "../../../components/common/Badge";

export const getVisaCountryColumns = (onEditCountry) => [
  {
    key: "name",
    header: "Country",
    render: (country) => (
      <div>
        <div className="fw-semibold">{country.name}</div>
        <div className="text-secondary small">ISO {country.isoCode || "N/A"}</div>
      </div>
    ),
  },
  {
    key: "nationalityName",
    header: "Nationality",
    mobileLabel: "Nationality",
  },
  {
    key: "displayOrderLabel",
    header: "Display order",
    mobileLabel: "Display order",
  },
  {
    key: "statusLabel",
    header: "Status",
    mobileLabel: "Status",
    render: (country) => (
      <div className="d-flex flex-wrap gap-2">
        <Badge color={country.isActive ? "success" : "neutral"}>{country.statusLabel}</Badge>
        {country.isPopular ? <Badge color="warning">Popular</Badge> : null}
      </div>
    ),
  },
  {
    key: "updatedAtLabel",
    header: "Updated",
    mobileLabel: "Updated",
  },
  {
    key: "actions",
    header: "Action",
    mobileLabel: "Action",
    render: (country) => (
      <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => onEditCountry(country)}>
        Edit
      </button>
    ),
  },
];
