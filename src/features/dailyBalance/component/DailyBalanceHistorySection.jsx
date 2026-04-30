import Button from "../../../components/common/Button";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";

const buildHistoryColumns = ({ onViewReport, selectedReport }) => [
  {
    key: "reportName",
    header: "Report",
    render: (report) => (
      <div>
        <div className="fw-semibold">{report.reportName}</div>
        <div className="text-secondary small">ID #{report.id}</div>
      </div>
    ),
  },
  {
    key: "reportMonthLabel",
    header: "Month",
    mobileLabel: "Month",
  },
  {
    key: "createdAtLabel",
    header: "Generated at",
    mobileLabel: "Generated",
  },
  {
    key: "actions",
    header: "Action",
    headerClassName: "text-end",
    cellClassName: "text-end",
    render: (report) => (
      <Button
        variant={selectedReport?.id === report.id ? "secondary" : "outline"}
        onClick={() => onViewReport(report)}
      >
        View
      </Button>
    ),
  },
];

export default function DailyBalanceHistorySection({
  changeHistoryPage,
  history,
  isHistoryFetching,
  isHistoryLoading,
  onViewReport,
  selectedReport,
}) {
  const reports = history?.reports ?? [];
  const pagination = history?.pagination ?? {};
  const historyColumns = buildHistoryColumns({ onViewReport, selectedReport });

  const footer = (
    <div className="trip-performance-table-footer">
      <div className="trip-performance-table-footer__summary">
        <strong>
          Showing {pagination.from ?? 0}-{pagination.to ?? 0}
        </strong>
        <span>of {pagination.total ?? 0} saved daily balance reports</span>
      </div>
      <div className="trip-performance-table-footer__actions">
        <Button
          variant="outline"
          disabled={!pagination.hasPrev || isHistoryFetching}
          onClick={() => changeHistoryPage((pagination.currentPage ?? 1) - 1)}
        >
          Previous
        </Button>
        <Button
          disabled={!pagination.hasNext || isHistoryFetching}
          onClick={() => changeHistoryPage((pagination.currentPage ?? 1) + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );

  return (
    <Card
      title="Saved daily balance reports"
      subtitle="Historical monthly PDFs generated for the daily balance report."
      className="trip-performance-card border-0"
      bodyClassName="p-0"
      footer={footer}
    >
      {isHistoryLoading && !reports.length ? (
        <div className="p-4 text-center text-secondary">Loading saved daily balance reports...</div>
      ) : (
        <Table
          columns={historyColumns}
          data={reports}
          emptyTitle="No saved reports"
          emptyDescription="The history endpoint did not return any saved daily balance PDFs."
        />
      )}
    </Card>
  );
}
