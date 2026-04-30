export const monthColumns = [
  {
    key: "monthLabel",
    header: "Month",
    render: (month) => (
      <div>
        <div className="fw-semibold">{month.monthLabel}</div>
        <div className="text-secondary small">{month.txCountLabel} transactions</div>
      </div>
    ),
  },
  {
    key: "openingBalanceLabel",
    header: "Opening balance",
    mobileLabel: "Opening",
  },
  {
    key: "totalCreditLabel",
    header: "Credit",
    mobileLabel: "Credit",
  },
  {
    key: "totalDebitLabel",
    header: "Debit",
    mobileLabel: "Debit",
  },
  {
    key: "netMovementLabel",
    header: "Net movement",
    mobileLabel: "Net",
    render: (month) => (
      <div>
        <div className="fw-semibold">{month.netMovementLabel}</div>
        <div className="text-secondary small">{month.balanceGrowthLabel}</div>
      </div>
    ),
  },
  {
    key: "closingBalanceLabel",
    header: "Closing balance",
    headerClassName: "text-end",
    cellClassName: "text-end fw-semibold",
  },
];

export const balanceTrendSeries = [
  { key: "openingBalance", label: "Opening balance", color: "#38bdf8" },
  { key: "closingBalance", label: "Closing balance", color: "#22c55e" },
];

export const cashFlowSegments = [
  { key: "credit", label: "Credit", color: "#22c55e" },
  { key: "debit", label: "Debit", color: "#f59e0b" },
];

export const balanceCurrencyFormatter = (value) =>
  `BDT ${new Intl.NumberFormat("en-US").format(Number(value) || 0)}`;

export const compactBalanceFormatter = (value) => `${Math.round(Number(value) / 1000)}k`;
