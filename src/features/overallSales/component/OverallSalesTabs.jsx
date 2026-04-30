const REPORT_TABS = [
  {
    id: "overall",
    title: "Overall Sales Summary",
    description: "Sales split by Trip, Package, and Hotel sources.",
  },
  {
    id: "routeWise",
    title: "Route-Wise Sales Summary",
    description: "Bookings and revenue performance by route.",
  },
];

export default function OverallSalesTabs({ activeReport, onChangeReport, overall, routeWise }) {
  const tabMeta = {
    overall: {
      value: overall.totalSalesLabel ?? "BDT 0",
      detail: `${overall.sources?.length ?? 0} sources`,
    },
    routeWise: {
      value: routeWise.totalRouteRevenueLabel ?? "BDT 0",
      detail: `${routeWise.routes?.length ?? 0} routes`,
    },
  };

  return (
    <div className="report-switcher" role="tablist" aria-label="Overall sales report sections">
      {REPORT_TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`report-switcher__tab${activeReport === tab.id ? " is-active" : ""}`}
          onClick={() => onChangeReport(tab.id)}
          role="tab"
          aria-selected={activeReport === tab.id}
        >
          <span className="report-switcher__eyebrow">{tabMeta[tab.id].detail}</span>
          <span className="report-switcher__title">{tab.title}</span>
          <span className="report-switcher__description">{tab.description}</span>
          <strong className="report-switcher__value">{tabMeta[tab.id].value}</strong>
        </button>
      ))}
    </div>
  );
}
