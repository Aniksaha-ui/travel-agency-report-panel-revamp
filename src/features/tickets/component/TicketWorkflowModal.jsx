import { useEffect, useState } from "react";
import Badge from "../../../components/common/Badge";
import Button from "../../../components/common/Button";
import { DeclineIcon, ResolveIcon, CheckIcon } from "../../../components/common/ActionIcons";
import ViewIcon from "../../../components/common/ViewIcon";
import Modal from "../../../components/ui/Modal";

export default function TicketWorkflowModal({
  isOpen,
  isSubmitting,
  onClose,
  onQuickAction,
  preferredActionKey,
  ticket,
}) {
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setRemarks("");
  }, [isOpen, ticket?.id]);

  const transitions = ticket?.availableTransitions ?? [];
  const approveTransition = transitions.find((item) => item.key === "start-progress") ?? null;
  const declineTransition = transitions.find((item) => item.key === "decline-ticket") ?? null;
  const resolveTransition = transitions.find((item) => item.key === "resolve-ticket") ?? null;
  const showResolveStep = preferredActionKey === "resolve-ticket" || Boolean(resolveTransition);
  const canResolve = resolveTransition ? Boolean(remarks.trim()) : false;

  return (
    <Modal
      ariaLabel="Ticket details"
      closeLabel="Close"
      dialogClassName="tickets-modal"
      isOpen={isOpen}
      onClose={onClose}
      subtitle="Review the ticket details first, then take the exact action allowed for its current state."
      title={ticket ? `Ticket #${ticket.ticketId}` : "Ticket details"}
    >
      {ticket ? (
        <div className="tickets-modal__stack">
          <section className="tickets-modal__summary">
            <div className="tickets-modal__summary-main">
              <div className="tickets-modal__summary-kicker">Ticket workflow</div>
              <div className="tickets-modal__summary-title">{ticket.title}</div>
              <div className="tickets-modal__summary-meta">{ticket.workflowDescription}</div>
            </div>
            <div className="tickets-modal__summary-badges">
              <Badge color={ticket.workflowTone} className="tickets-modal__status-badge">
                {ticket.statusDisplayLabel}
              </Badge>
              <Badge
                color={ticket.status === 2 ? "neutral" : "info"}
                className="tickets-modal__status-badge"
              >
                {ticket.resolvedStatusLabel}
              </Badge>
            </div>
          </section>

          <section className="tickets-modal__status-board">
            <div className="tickets-modal__status-card">
              <span className="tickets-modal__summary-label">Workflow status</span>
              <Badge color={ticket.workflowTone} className="tickets-modal__status-badge">
                {ticket.statusDisplayLabel}
              </Badge>
              <p>{ticket.workflowDescription}</p>
            </div>
            <div className="tickets-modal__status-card">
              <span className="tickets-modal__summary-label">Decision status</span>
              <Badge
                color={ticket.status === 2 ? "neutral" : "info"}
                className="tickets-modal__status-badge"
              >
                {ticket.resolvedStatusLabel}
              </Badge>
              <p>
                {ticket.resolvedByName === "Unassigned"
                  ? "No resolver assigned yet."
                  : `Resolved by ${ticket.resolvedByName}.`}
              </p>
            </div>
          </section>

          <section className="tickets-modal__details">
            <div className="tickets-modal__detail">
              <span className="tickets-modal__detail-label">Remarks</span>
              <strong>{ticket.remarks}</strong>
            </div>
            <div className="tickets-modal__detail">
              <span className="tickets-modal__detail-label">Customer</span>
              <strong>{ticket.customerName}</strong>
            </div>
            <div className="tickets-modal__detail">
              <span className="tickets-modal__detail-label">Created</span>
              <strong>{ticket.createdAtLabel}</strong>
            </div>
            <div className="tickets-modal__detail">
              <span className="tickets-modal__detail-label">Updated</span>
              <strong>{ticket.updatedAtLabel}</strong>
            </div>
            <div className="tickets-modal__detail">
              <span className="tickets-modal__detail-label">Resolved by</span>
              <strong>{ticket.resolvedByName}</strong>
            </div>
            <div className="tickets-modal__detail">
              <span className="tickets-modal__detail-label">Attachment</span>
              {ticket.hasAttachment ? (
                <a
                  href={ticket.attachmentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline-primary btn-sm btn-icon mt-1"
                  aria-label="View attachment"
                  title="View attachment"
                >
                  <ViewIcon />
                </a>
              ) : (
                <strong>No attachment</strong>
              )}
            </div>
          </section>

          <section className="tickets-modal__panel">
            <div className="tickets-modal__panel-title">Description</div>
            <div className="tickets-modal__description">{ticket.description}</div>
            {ticket.resolvedRemarks ? (
              <div className="tickets-modal__resolved-note">
                <div className="tickets-modal__summary-label">Resolved remarks</div>
                <div>{ticket.resolvedRemarks}</div>
              </div>
            ) : null}
          </section>

          <section className="tickets-modal__panel">
            <div className="tickets-modal__panel-title">Current action</div>
            {approveTransition || declineTransition ? (
              <div className="tickets-modal__decision-note">
                This ticket is pending review. Approve it to move into processing, or decline it to close the request.
              </div>
            ) : null}
            {showResolveStep && resolveTransition ? (
              <>
                <div className="tickets-modal__decision-note">
                  This ticket is already in progress. Add the final resolution note below, then complete it.
                </div>
                <div className="tickets-modal__remarks">
                  <label htmlFor="ticket-workflow-remarks" className="tickets-modal__summary-label">
                    Resolution note
                  </label>
                  <textarea
                    id="ticket-workflow-remarks"
                    className="form-control"
                    rows="4"
                    placeholder={resolveTransition.placeholder}
                    value={remarks}
                    onChange={(event) => setRemarks(event.target.value)}
                  />
                </div>
              </>
            ) : null}
            {!approveTransition && !declineTransition && !resolveTransition ? (
              <div className="text-secondary">
                This ticket is already closed, so there are no further actions available.
              </div>
            ) : null}
          </section>

          <section className="tickets-modal__footer">
            {approveTransition ? (
              <Button
                variant="primary"
                className="btn-icon"
                aria-label="Approve ticket"
                title="Approve ticket"
                icon={<CheckIcon />}
                isLoading={isSubmitting}
                onClick={() => onQuickAction(ticket, approveTransition)}
              />
            ) : null}
            {declineTransition ? (
              <Button
                variant="danger"
                className="btn-icon"
                aria-label="Decline ticket"
                title="Decline ticket"
                icon={<DeclineIcon />}
                isLoading={isSubmitting}
                onClick={() => onQuickAction(ticket, declineTransition)}
              />
            ) : null}
            {resolveTransition ? (
              <Button
                variant="primary"
                className="btn-icon"
                aria-label="Mark ticket as resolved"
                title="Mark ticket as resolved"
                icon={<ResolveIcon />}
                isLoading={isSubmitting}
                disabled={!canResolve}
                onClick={() => onQuickAction(ticket, resolveTransition, remarks)}
              />
            ) : null}
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </section>
        </div>
      ) : null}
    </Modal>
  );
}
