import Badge from "../../../components/common/Badge";
import Button from "../../../components/common/Button";

export const getGuideColumns = ({ onEditGuide }) => [
  {
    key: "guideId",
    header: "SL",
    headerClassName: "text-center",
    cellClassName: "text-center fw-semibold",
  },
  {
    key: "name",
    header: "Name",
    render: (guide) => (
      <div>
        <div className="fw-semibold">{guide.name}</div>
        <div className="text-secondary small">{guide.email}</div>
      </div>
    ),
  },
  {
    key: "phone",
    header: "Phone",
    render: (guide) => (
      <div>
        <div className="fw-semibold">{guide.phone}</div>
        <div className="text-secondary small">{guide.updatedAtLabel}</div>
      </div>
    ),
  },
  {
    key: "bioPreview",
    header: "Bio",
    render: (guide) => <span className="text-secondary">{guide.bioPreview}</span>,
  },
  {
    key: "ratingLabel",
    header: "Rating",
    render: (guide) => (
      <div className="d-flex flex-column gap-1">
        <Badge color={guide.ratingValue > 0 ? "success" : "neutral"}>{guide.ratingLabel}</Badge>
        <span className="small text-secondary">{guide.signalLabel}</span>
      </div>
    ),
  },
  {
    key: "actions",
    header: "Action",
    headerClassName: "text-end",
    cellClassName: "text-end",
    render: (guide) => (
      <Button variant="outline" className="btn-sm" onClick={() => onEditGuide(guide)}>
        Edit
      </Button>
    ),
  },
];

