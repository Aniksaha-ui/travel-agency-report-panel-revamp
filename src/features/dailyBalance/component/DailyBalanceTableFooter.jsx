import Button from "../../../components/common/Button";

export default function DailyBalanceTableFooter({ changePage, isFetching, page, pagination }) {
  return (
    <div className="trip-performance-table-footer">
      <div className="trip-performance-table-footer__summary">
        <strong>
          Showing {pagination.from ?? 0}-{pagination.to ?? 0}
        </strong>
        <span>of {pagination.total ?? 0} daily balances</span>
      </div>
      <div className="trip-performance-table-footer__actions">
        <Button
          variant="outline"
          disabled={!pagination.hasPrev || isFetching}
          onClick={() => changePage(page - 1)}
        >
          Previous
        </Button>
        <Button disabled={!pagination.hasNext || isFetching} onClick={() => changePage(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
