import Button from "../../../components/common/Button";

export default function DailyBalanceMobileHistory({
  changeHistoryPage,
  history,
  isHistoryFetching,
  isHistoryLoading,
  onViewReport,
  selectedReport,
}) {
  const reports = history?.reports ?? [];
  const pagination = history?.pagination ?? {};

  return (
    <section className="trip-performance-mobile__card">
      <div className="trip-performance-mobile__card-header">
        <div>
          <div className="trip-performance-mobile__card-title">Saved report history</div>
          <div className="trip-performance-mobile__card-subtle">
            Generated monthly PDFs for daily balance reports
          </div>
        </div>
        <div className="trip-performance-mobile__pill">
          {pagination.total ?? 0} reports
        </div>
      </div>

      <div className="trip-performance-mobile__list">
        {reports.length ? (
          reports.map((report) => (
            <article key={report.id} className="trip-performance-mobile__item">
              <div className="trip-performance-mobile__item-top">
                <div>
                  <div className="trip-performance-mobile__item-title">{report.reportName}</div>
                  <div className="trip-performance-mobile__item-meta">
                    {report.reportMonthLabel} - generated {report.createdAtLabel}
                  </div>
                </div>
                <Button
                  variant={selectedReport?.id === report.id ? "secondary" : "outline"}
                  onClick={() => onViewReport(report)}
                >
                  View
                </Button>
              </div>
            </article>
          ))
        ) : (
          <div className="trip-performance-mobile__empty">
            {isHistoryLoading ? "Loading saved reports..." : "No saved daily balance reports available."}
          </div>
        )}
      </div>

      <div className="trip-performance-mobile__pager">
        <Button
          variant="outline"
          fullWidthOnMobile
          disabled={!pagination.hasPrev || isHistoryFetching}
          onClick={() => changeHistoryPage((pagination.currentPage ?? 1) - 1)}
        >
          Previous
        </Button>
        <Button
          fullWidthOnMobile
          disabled={!pagination.hasNext || isHistoryFetching}
          onClick={() => changeHistoryPage((pagination.currentPage ?? 1) + 1)}
        >
          Next
        </Button>
      </div>
    </section>
  );
}
