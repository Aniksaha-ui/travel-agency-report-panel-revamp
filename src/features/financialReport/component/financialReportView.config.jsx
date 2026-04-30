export const financialReportColumns = [
  {
    key: "fiscalYearLabel",
    header: "Fiscal year",
    render: (report) => (
      <div>
        <div className="fw-semibold">{report.shortFiscalYearLabel}</div>
        <div className="text-secondary small">{report.fiscalYearLabel}</div>
      </div>
    ),
  },
  {
    key: "paymentAmountLabel",
    header: "Payments",
    mobileLabel: "Payments",
  },
  {
    key: "refundLabel",
    header: "Refund",
    mobileLabel: "Refund",
  },
  {
    key: "costingLabel",
    header: "Costing",
    mobileLabel: "Costing",
  },
  {
    key: "retainedAmountLabel",
    header: "Retained",
    mobileLabel: "Retained",
    render: (report) => (
      <div>
        <div className="fw-semibold">{report.retainedAmountLabel}</div>
        <div className="text-secondary small">{report.marginRateLabel}</div>
      </div>
    ),
  },
  {
    key: "marginRateLabel",
    header: "Margin",
    headerClassName: "text-end",
    cellClassName: "text-end fw-semibold",
  },
];

export const financialTrendSeries = [
  { key: "payments", label: "Payments", color: "#38bdf8" },
  { key: "retained", label: "Retained", color: "#22c55e" },
];

export const financialCompositionSegments = [
  { key: "retained", label: "Retained", color: "#22c55e" },
  { key: "costing", label: "Costing", color: "#f59e0b" },
  { key: "refunds", label: "Refunds", color: "#ef4444" },
];

export const financialCurrencyFormatter = (value) =>
  `BDT ${new Intl.NumberFormat("en-US").format(Number(value) || 0)}`;

export const compactFinancialFormatter = (value) => `${Math.round(Number(value) / 1000)}k`;
