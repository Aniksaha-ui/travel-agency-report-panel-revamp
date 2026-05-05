import RechartsAreaChart from "../../../components/charts/RechartsAreaChart";
import RechartsPieChart from "../../../components/charts/RechartsPieChart";
import Badge from "../../../components/common/Badge";
import Button from "../../../components/common/Button";
import {
  renderWorkflowBadge,
  ticketNumberFormatter,
  ticketsTrendSeries,
} from "./ticketsView.config";

export default function TicketsMobileView({
  boardDate,
  charts,
  copy,
  error,
  handleSearchChange,
  isFetching,
  isLoading,
  metrics,
  onOpenDetails,
  onQuickAction,
  page,
  pagination,
  searchTerm,
  summary,
  tickets,
  changePage,
}) {
  return (
    <div className="d-md-none trip-performance-mobile tickets-mobile">
      <div className="container-xl">
        <div className="trip-performance-mobile__screen">
          <section className="trip-performance-mobile__hero tickets-mobile__hero">
            <div className="trip-performance-mobile__hero-top">
              <div>
                <div className="trip-performance-mobile__eyebrow">/admin/tickets</div>
                <h2 className="trip-performance-mobile__title">{copy.pageTitle}</h2>
                <p className="trip-performance-mobile__subtitle">{copy.pageSubtitle}</p>
              </div>
              <span className="trip-performance-mobile__date">{boardDate}</span>
            </div>

            <div className="trip-performance-mobile__spotlight">
              <div>
                <div className="trip-performance-mobile__spotlight-label">Open queue</div>
                <div className="trip-performance-mobile__spotlight-value">
                  {summary.openTicketsLabel ?? "0"} tickets
                </div>
                <div className="trip-performance-mobile__spotlight-meta">
                  {summary.oldestPendingTicket?.title ?? "No pending tickets on this page"}
                </div>
              </div>
              <div className="trip-performance-mobile__spotlight-stack">
                <span>{summary.pendingTicketsLabel ?? "0"} pending</span>
                <span>{summary.processingTicketsLabel ?? "0"} active</span>
              </div>
            </div>

            <div className="tickets-mobile__ribbon">
              <span className="tickets-mobile__ribbon-item">Queue triage</span>
              <span className="tickets-mobile__ribbon-item">Status transitions</span>
              <span className="tickets-mobile__ribbon-item">Customer context</span>
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

          {error ? (
            <section className="trip-performance-mobile__card">
              <div className="text-danger">{error.message || "Unable to load ticket data."}</div>
            </section>
          ) : null}

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Ticket queue</div>
                <div className="trip-performance-mobile__card-subtle">
                  Showing {pagination.from ?? 0}-{pagination.to ?? 0} of {pagination.total ?? 0}
                </div>
              </div>
              <div className="trip-performance-mobile__pill">
                Page {pagination.currentPage ?? 1}/{pagination.lastPage ?? 1}
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
                placeholder="Search tickets"
                aria-label="Search tickets"
              />
            </div>

            <div className="trip-performance-mobile__list">
              {tickets.length ? (
                tickets.map((ticket) => (
                  <article key={ticket.id} className="trip-performance-mobile__item tickets-mobile__item">
                    <div className="trip-performance-mobile__item-top">
                      <div>
                        <div className="trip-performance-mobile__item-title">{ticket.title}</div>
                        <div className="trip-performance-mobile__item-meta">
                          #{ticket.ticketId} • {ticket.creatorName}
                        </div>
                      </div>
                      <div className="d-flex flex-column align-items-end gap-2">
                        {ticket.hasAttachment ? <Badge color="neutral">Attachment</Badge> : null}
                        <span className="tickets-mobile__updated">{ticket.updatedShortLabel}</span>
                      </div>
                    </div>

                    <div className="tickets-mobile__status-row">{renderWorkflowBadge(ticket)}</div>

                    <div className="trip-performance-mobile__item-grid">
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">
                          {ticket.resolvedStatusLabel}
                        </div>
                        <div className="trip-performance-mobile__item-grid-label">Decision</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">
                          {ticket.createdShortLabel}
                        </div>
                        <div className="trip-performance-mobile__item-grid-label">Created</div>
                      </div>
                    </div>

                    <div className="tickets-mobile__description">{ticket.descriptionPreview}</div>

                    <div className="tickets-mobile__actions tickets-mobile__actions--stack">
                      <Button
                        variant="outline"
                        fullWidthOnMobile
                        onClick={() => onOpenDetails(ticket)}
                      >
                        View details
                      </Button>
                      {ticket.availableTransitions.map((transition) => (
                        <Button
                          key={transition.key}
                          variant={transition.tone === "danger" ? "danger" : "primary"}
                          fullWidthOnMobile
                          onClick={() => onQuickAction(ticket, transition)}
                        >
                          {transition.label}
                        </Button>
                      ))}
                    </div>
                  </article>
                ))
              ) : (
                <div className="trip-performance-mobile__empty">
                  {isLoading ? "Loading tickets..." : "No tickets found for this page."}
                </div>
              )}
            </div>

            <div className="trip-performance-mobile__pager">
              <Button
                variant="outline"
                fullWidthOnMobile
                disabled={!pagination.hasPrev || isFetching}
                onClick={() => changePage(page - 1)}
              >
                Previous
              </Button>
              <Button
                fullWidthOnMobile
                disabled={!pagination.hasNext || isFetching}
                onClick={() => changePage(page + 1)}
              >
                Next
              </Button>
            </div>
          </section>

          <section className="trip-performance-mobile__card tickets-mobile__ops-card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Operations board</div>
                <div className="trip-performance-mobile__card-subtle">
                  Focus the team on what should move next
                </div>
              </div>
              <Badge color="success">{summary.resolutionRateLabel ?? "0%"}</Badge>
            </div>

            <div className="tickets-mobile__ops-grid">
              <div className="tickets-mobile__ops-metric">
                <span>Pending</span>
                <strong>{summary.pendingTicketsLabel ?? "0"}</strong>
              </div>
              <div className="tickets-mobile__ops-metric">
                <span>In progress</span>
                <strong>{summary.processingTicketsLabel ?? "0"}</strong>
              </div>
              <div className="tickets-mobile__ops-metric">
                <span>Resolved</span>
                <strong>{summary.resolvedTicketsLabel ?? "0"}</strong>
              </div>
            </div>

            <div className="tickets-mobile__focus">
              <div className="tickets-mobile__focus-label">Next ticket to triage</div>
              <div className="tickets-mobile__focus-title">
                {summary.oldestPendingTicket?.title ?? "No pending tickets are waiting right now"}
              </div>
              <div className="tickets-mobile__focus-meta">
                {summary.oldestPendingTicket
                  ? `${summary.oldestPendingTicket.creatorName} • ${summary.oldestPendingTicket.createdAtLabel}`
                  : "The queue is currently clear of pending work on this page."}
              </div>
            </div>

            {summary.oldestPendingTicket ? (
              <div className="tickets-mobile__actions">
                <Button
                  fullWidthOnMobile
                  onClick={() => onOpenDetails(summary.oldestPendingTicket)}
                >
                  Open oldest pending
                </Button>
              </div>
            ) : null}
          </section>

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Status distribution</div>
                <div className="trip-performance-mobile__card-subtle">
                  Where the visible queue is currently sitting
                </div>
              </div>
            </div>

            <RechartsPieChart
              items={charts.statusMix ?? []}
              height={240}
              totalLabel="visible tickets"
              valueFormatter={ticketNumberFormatter}
            />
          </section>

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Daily intake trend</div>
                <div className="trip-performance-mobile__card-subtle">
                  Ticket creation rhythm from the visible page
                </div>
              </div>
            </div>

            <RechartsAreaChart
              data={charts.intakeTrend ?? []}
              series={ticketsTrendSeries}
              height={220}
              labelKey="label"
              valueFormatter={ticketNumberFormatter}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
