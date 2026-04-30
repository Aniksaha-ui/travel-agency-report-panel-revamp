export default function DailyBalanceReportViewer({ report }) {
  if (!report) {
    return (
      <div className="daily-balance-pdf-viewer daily-balance-pdf-viewer--empty">
        Select a report from the history table to preview the PDF here.
      </div>
    );
  }

  if (!report.fileUrl) {
    return (
      <div className="daily-balance-pdf-viewer daily-balance-pdf-viewer--empty">
        This report does not include a readable PDF path.
      </div>
    );
  }

  return (
    <div className="daily-balance-pdf-viewer">
      <iframe
        title={report.reportName}
        src={report.fileUrl}
        className="daily-balance-pdf-viewer__frame"
      />
    </div>
  );
}
