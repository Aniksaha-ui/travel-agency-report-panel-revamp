import Badge from "../../../components/common/Badge";

export const getVisaRequirementColumns = (onEditRequirement) => [
  {
    key: "documentName",
    header: "Document",
    render: (requirement) => (
      <div>
        <div className="fw-semibold">{requirement.documentName}</div>
        <div className="text-secondary small">{requirement.visaName}</div>
      </div>
    ),
  },
  {
    key: "countryName",
    header: "Country",
    mobileLabel: "Country",
  },
  {
    key: "instructions",
    header: "Instructions",
    mobileLabel: "Instructions",
    render: (requirement) => (
      <span>{requirement.instructions.length > 88 ? `${requirement.instructions.slice(0, 88)}...` : requirement.instructions}</span>
    ),
  },
  {
    key: "requiredLabel",
    header: "Required",
    mobileLabel: "Required",
    render: (requirement) => (
      <Badge color={requirement.isRequired ? "success" : "neutral"}>{requirement.requiredLabel}</Badge>
    ),
  },
  {
    key: "multipleLabel",
    header: "Uploads",
    mobileLabel: "Uploads",
    render: (requirement) => (
      <Badge color={requirement.allowMultiple ? "info" : "warning"}>{requirement.multipleLabel}</Badge>
    ),
  },
  {
    key: "sortOrderLabel",
    header: "Sort order",
    mobileLabel: "Sort order",
  },
  {
    key: "actions",
    header: "Action",
    mobileLabel: "Action",
    render: (requirement) => (
      <button
        type="button"
        className="btn btn-outline-primary btn-sm"
        onClick={() => onEditRequirement(requirement)}
      >
        Edit
      </button>
    ),
  },
];
