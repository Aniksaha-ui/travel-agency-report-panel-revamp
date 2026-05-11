import Badge from "../../../components/common/Badge";

export const getVisaTypeColumns = (onEditVisaType) => [
  {
    key: "visaName",
    header: "Visa type",
    render: (visaType) => (
      <div>
        <div className="fw-semibold">{visaType.visaName}</div>
        <div className="text-secondary small">{visaType.title}</div>
      </div>
    ),
  },
  {
    key: "countryName",
    header: "Country",
    mobileLabel: "Country",
  },
  {
    key: "feeLabel",
    header: "Fee",
    mobileLabel: "Fee",
  },
  {
    key: "processingDaysLabel",
    header: "Processing",
    mobileLabel: "Processing",
  },
  {
    key: "entryType",
    header: "Entry type",
    mobileLabel: "Entry type",
  },
  {
    key: "statusLabel",
    header: "Status",
    mobileLabel: "Status",
    render: (visaType) => (
      <Badge color={visaType.isActive ? "success" : "neutral"}>{visaType.statusLabel}</Badge>
    ),
  },
  {
    key: "actions",
    header: "Action",
    mobileLabel: "Action",
    render: (visaType) => (
      <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => onEditVisaType(visaType)}>
        Edit
      </button>
    ),
  },
];
