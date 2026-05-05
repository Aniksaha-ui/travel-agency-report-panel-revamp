export const TICKETS_COPY = {
  pageTitle: "Ticket management",
  pageSubtitle:
    "Review customer tickets, inspect details, and keep the same approve, decline, and resolve flow from the legacy admin.",
};

export const TICKET_MAIN_STATUS = ["pending", "processing", "closed"];
export const TICKET_RESOLVE_STATUS = ["Pending", "Accepted", "Declined"];

export const TICKET_WORKFLOW_STEPS = [
  {
    key: "pending",
    label: "Pending",
    description: "Awaiting triage",
  },
  {
    key: "processing",
    label: "In progress",
    description: "Actively handled",
  },
  {
    key: "closed",
    label: "Closed",
    description: "Resolved or declined",
  },
];
