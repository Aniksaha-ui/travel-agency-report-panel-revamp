export default function FinancialReportTableFooter({ pagination }) {
  return (
    <div className="trip-performance-table-footer">
      <div className="trip-performance-table-footer__summary">
        <strong>
          Showing {pagination.from ?? 0}-{pagination.to ?? 0}
        </strong>
        <span>of {pagination.total ?? 0} fiscal reports</span>
      </div>
    </div>
  );
}
