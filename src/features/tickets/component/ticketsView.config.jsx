import Badge from "../../../components/common/Badge";
import Button from "../../../components/common/Button";
import { CheckIcon, DeclineIcon, ResolveIcon } from "../../../components/common/ActionIcons";
import ViewIcon from "../../../components/common/ViewIcon";

export const ticketsTrendSeries = [
  {
    key: "tickets",
    label: "Tickets",
    color: "#38bdf8",
  },
];

export const ticketNumberFormatter = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(
    Number(value) || 0,
  );

export const renderWorkflowBadge = (ticket) => (
  <div className="d-flex flex-column gap-1">
    <Badge color={ticket.workflowTone}>{ticket.statusDisplayLabel}</Badge>
    <span className="small text-secondary">
      {ticket.status === 1 ? `Resolved status: ${ticket.resolvedStatusLabel}` : ticket.workflowDescription}
    </span>
  </div>
);

export const getTransitionIcon = (transition) => {
  if (transition.key === "decline-ticket") {
    return <DeclineIcon />;
  }

  if (transition.key === "resolve-ticket") {
    return <ResolveIcon />;
  }

  return <CheckIcon />;
};

export const createTicketColumns = ({ onOpenDetails, onQuickAction }) => [
  {
    key: "ticketId",
    header: "#",
    headerClassName: "text-center",
    cellClassName: "text-center fw-semibold",
  },
  {
    key: "title",
    header: "Title",
    render: (ticket) => (
      <div>
        <div className="fw-semibold d-flex flex-wrap align-items-center gap-2">
          <span>{ticket.title}</span>
          {ticket.hasAttachment ? <Badge color="neutral">Attachment</Badge> : null}
        </div>
        <div className="text-secondary small">{ticket.descriptionPreview}</div>
      </div>
    ),
  },
  {
    key: "remarks",
    header: "Remarks",
    mobileLabel: "Remarks",
    render: (ticket) => (
      <div>
        <div className="fw-semibold">{ticket.remarks}</div>
        <div className="text-secondary small">Created {ticket.createdAtLabel}</div>
      </div>
    ),
  },
  {
    key: "statusDisplayLabel",
    header: "Status",
    mobileLabel: "Status",
    render: renderWorkflowBadge,
  },
  {
    key: "customerName",
    header: "Customer",
    mobileLabel: "Customer",
    render: (ticket) => (
      <div>
        <div className="fw-semibold">{ticket.customerName}</div>
        <div className="text-secondary small">
          {ticket.resolvedByName === "Unassigned" ? "Not resolved yet" : `Resolved by ${ticket.resolvedByName}`}
        </div>
      </div>
    ),
  },
  {
    key: "actions",
    header: "Action",
    headerClassName: "text-end",
    cellClassName: "text-end",
    render: (ticket) => (
      <div className="tickets-row-actions">
        <Button
          variant="outline"
          className="btn-sm btn-icon"
          aria-label={`View ticket ${ticket.ticketId}`}
          title={`View ticket ${ticket.ticketId}`}
          icon={<ViewIcon />}
          onClick={() => onOpenDetails(ticket)}
        />
        {ticket.availableTransitions.map((transition) => (
          <Button
            key={transition.key}
            variant={transition.tone === "danger" ? "danger" : "primary"}
            className="btn-sm btn-icon"
            aria-label={`${transition.label} for ticket ${ticket.ticketId}`}
            title={`${transition.label} for ticket ${ticket.ticketId}`}
            icon={getTransitionIcon(transition)}
            onClick={() => onQuickAction(ticket, transition)}
          />
        ))}
      </div>
    ),
  },
];
