import RechartsAreaChart from "../../../components/charts/RechartsAreaChart";
import RechartsPieChart from "../../../components/charts/RechartsPieChart";
import RechartsRankingChart from "../../../components/charts/RechartsRankingChart";
import Badge from "../../../components/common/Badge";
import Button from "../../../components/common/Button";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import MetricsOverview from "../../dashboard/components/MetricsOverview";
import {
  createTicketColumns,
  ticketNumberFormatter,
  ticketsTrendSeries,
} from "./ticketsView.config";

export default function TicketsDesktopView({
  boardDate,
  charts,
  copy,
  error,
  handleSearchChange,
  isLoading,
  metrics,
  onOpenDetails,
  onQuickAction,
  pagination,
  searchTerm,
  summary,
  tableFooter,
  tickets,
}) {
  const columns = createTicketColumns({ onOpenDetails, onQuickAction });

  return (
    <div className="d-none d-md-block">
      <div className="page-header d-print-none trip-performance-page-header">
        <div className="container-xl">
          <div className="trip-performance-hero tickets-hero">
            <div className="trip-performance-hero__copy">
              <span className="trip-performance-hero__eyebrow">/admin/tickets</span>
              <h2 className="page-title">{copy.pageTitle}</h2>
              <p className="text-secondary mb-0">{copy.pageSubtitle}</p>
              <div className="tickets-hero__signals">
                <span className="tickets-hero__signal tickets-hero__signal--pending">
                  {summary.pendingTicketsLabel ?? "0"} pending
                </span>
                <span className="tickets-hero__signal tickets-hero__signal--progress">
                  {summary.processingTicketsLabel ?? "0"} in progress
                </span>
                <span className="tickets-hero__signal tickets-hero__signal--resolved">
                  {summary.resolutionRateLabel ?? "0%"} resolved
                </span>
              </div>
            </div>

            <div className="trip-performance-hero__meta">
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Showing</span>
                <strong>
                  {pagination.from ?? 0}-{pagination.to ?? 0} of {pagination.total ?? 0}
                </strong>
              </div>
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Page</span>
                <strong>
                  {pagination.currentPage ?? 1}/{pagination.lastPage ?? 1}
                </strong>
              </div>
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Board date</span>
                <strong>{boardDate}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          {error ? (
            <section className="dashboard-section">
              <Card title="Ticket feed unavailable" className="trip-performance-card border-0">
                <div className="text-danger">
                  {error.message || "Unable to load ticket information."}
                </div>
              </Card>
            </section>
          ) : null}

          <section className="dashboard-section">
            <div className="row g-3">
              <div className="col-12 col-xl-8">
                <Card
                  title="Live ticket queue"
                  subtitle="Triage, inspect, and move tickets through workflow from the first screen."
                  className="trip-performance-card border-0 tickets-table-card"
                  bodyClassName="p-0"
                  footer={tableFooter}
                  actions={
                    <div className="dashboard-search trip-performance-search">
                      <div className="input-icon">
                        <span className="input-icon-addon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                            <path d="M21 21l-6 -6" />
                          </svg>
                        </span>
                        <input
                          type="search"
                          className="form-control"
                          placeholder="Search tickets"
                          aria-label="Search tickets"
                          value={searchTerm}
                          onChange={handleSearchChange}
                        />
                      </div>
                    </div>
                  }
                >
                  {isLoading && !tickets.length ? (
                    <div className="p-4 text-center text-secondary">Loading ticket queue...</div>
                  ) : (
                    <Table
                      columns={columns}
                      data={tickets}
                      emptyTitle="No tickets found"
                      emptyDescription="The ticket endpoint did not return any rows for this page."
                    />
                  )}
                </Card>
              </div>
              <div className="col-12 col-xl-4">
                <Card
                  title="Operations board"
                  subtitle="What needs attention right now."
                  className="trip-performance-card border-0 tickets-ops-card h-100"
                >
                  <div className="tickets-ops-card__metrics">
                    <div className="tickets-ops-card__metric">
                      <span>Needs review</span>
                      <strong>{summary.pendingTicketsLabel ?? "0"}</strong>
                    </div>
                    <div className="tickets-ops-card__metric">
                      <span>In progress</span>
                      <strong>{summary.processingTicketsLabel ?? "0"}</strong>
                    </div>
                    <div className="tickets-ops-card__metric">
                      <span>Resolved rate</span>
                      <strong>{summary.resolutionRateLabel ?? "0%"}</strong>
                    </div>
                  </div>

                  <div className="tickets-ops-card__focus">
                    <div className="tickets-ops-card__eyebrow">Next ticket to triage</div>
                    <div className="tickets-ops-card__title">
                      {summary.oldestPendingTicket?.title ?? "No pending ticket waiting right now"}
                    </div>
                    <div className="tickets-ops-card__meta">
                      {summary.oldestPendingTicket
                        ? `${summary.oldestPendingTicket.creatorName} • ${summary.oldestPendingTicket.createdAtLabel}`
                        : "The current page has no pending tickets left to review."}
                    </div>
                    {summary.oldestPendingTicket ? (
                      <div className="mt-3">
                        <Button
                          onClick={() =>
                            onOpenDetails(summary.oldestPendingTicket)
                          }
                        >
                          Open oldest pending
                        </Button>
                      </div>
                    ) : null}
                  </div>

                  <div className="tickets-ops-card__list">
                    <div className="tickets-ops-card__list-item">
                      <div>
                        <div className="tickets-ops-card__list-label">Latest activity</div>
                        <div className="tickets-ops-card__list-value">
                          {summary.latestActivity?.title ?? "No movement detected"}
                        </div>
                      </div>
                      {summary.latestActivity ? (
                        <Badge color={summary.latestActivity.workflowTone}>
                          {summary.latestActivity.workflowLabel}
                        </Badge>
                      ) : null}
                    </div>

                    <div className="tickets-ops-card__list-item">
                      <div>
                        <div className="tickets-ops-card__list-label">Lead reporter</div>
                        <div className="tickets-ops-card__list-value">
                          {summary.leadReporter?.label ?? "No concentration yet"}
                        </div>
                      </div>
                      <Badge color="info">{summary.leadReporter?.value ?? 0} tickets</Badge>
                    </div>
                  </div>

                  <div className="tickets-ops-card__guide">
                    <div className="tickets-ops-card__guide-title">Workflow rhythm</div>
                    <div className="tickets-ops-card__guide-copy">
                      Pending -&gt; In progress -&gt; Closed
                    </div>
                    <div className="tickets-ops-card__guide-meta">
                      Closed tickets still retain clear resolved versus declined outcomes inside the workflow modal.
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <MetricsOverview metrics={metrics} />
          </section>

          <section className="dashboard-section">
            <div className="row g-3">
              <div className="col-12 col-xl-5">
                <Card
                  title="Status distribution"
                  subtitle="A quick look at where the visible queue is currently sitting."
                  className="trip-performance-card border-0 tickets-panel-card h-100"
                >
                  <RechartsPieChart
                    items={charts.statusMix ?? []}
                    height={300}
                    totalLabel="visible tickets"
                    valueFormatter={ticketNumberFormatter}
                  />
                </Card>
              </div>

              <div className="col-12 col-xl-7">
                <Card
                  title="Daily intake trend"
                  subtitle="Ticket creation rhythm for the visible result set."
                  className="trip-performance-card border-0 tickets-panel-card h-100"
                >
                  <RechartsAreaChart
                    data={charts.intakeTrend ?? []}
                    series={ticketsTrendSeries}
                    labelKey="label"
                    height={300}
                    valueFormatter={ticketNumberFormatter}
                  />
                </Card>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <div className="row g-3">
              <div className="col-12 col-xl-6">
                <Card
                  title="Reporter workload"
                  subtitle="The people generating the most tickets in the visible page."
                  className="trip-performance-card border-0 tickets-panel-card tickets-panel-card--blue h-100"
                >
                  <RechartsRankingChart
                    items={charts.creatorRanking ?? []}
                    height={320}
                    tooltipLabel="Tickets"
                    valueFormatter={ticketNumberFormatter}
                    getCellColor={() => "#38bdf8"}
                    yAxisWidth={150}
                    chartMargin={{ top: 5, right: 20, left: 8, bottom: 5 }}
                  />
                </Card>
              </div>
              <div className="col-12 col-xl-6">
                <Card
                  title="Workflow guide"
                  subtitle="A cleaner summary of how ticket handling moves across the backend states."
                  className="trip-performance-card border-0 tickets-panel-card tickets-panel-card--mint h-100"
                >
                  <div className="tickets-workflow-guide">
                    <div className="tickets-workflow-guide__step">
                      <span>01</span>
                      <div>
                        <strong>Pending</strong>
                        <div className="text-secondary small">
                          Review the ticket, open the workflow, and decide whether to accept or decline it.
                        </div>
                      </div>
                    </div>
                    <div className="tickets-workflow-guide__step">
                      <span>02</span>
                      <div>
                        <strong>In progress</strong>
                        <div className="text-secondary small">
                          Accepted tickets stay active until the team is ready to close them cleanly.
                        </div>
                      </div>
                    </div>
                    <div className="tickets-workflow-guide__step">
                      <span>03</span>
                      <div>
                        <strong>Closed</strong>
                        <div className="text-secondary small">
                          Resolved tickets keep their remarks, while declined ones remain clearly separated.
                        </div>
                      </div>
                    </div>
                    <div className="tickets-workflow-guide__footer">
                      <Badge color="info">Jira-style transition modal</Badge>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
