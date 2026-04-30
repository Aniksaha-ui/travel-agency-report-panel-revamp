export default function GuideEfficiencyTableFooter({ debouncedSearchTerm, guides, summary }) {
  return (
    <div className="trip-performance-table-footer">
      <div className="trip-performance-table-footer__summary">
        <strong>Showing {guides.length}</strong>
        <span>
          of {summary.totalGuidesLabel ?? "0"} guides
          {debouncedSearchTerm ? ` for "${debouncedSearchTerm}"` : ""}
        </span>
      </div>
      <div className="trip-performance-table-footer__summary">
        <strong>{summary.totalPackagesLabel ?? "0"} packages</strong>
        <span>{summary.totalTripCostLabel ?? "BDT 0"} visible trip cost</span>
      </div>
    </div>
  );
}
