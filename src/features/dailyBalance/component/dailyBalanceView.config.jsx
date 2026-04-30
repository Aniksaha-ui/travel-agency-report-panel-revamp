export const dailyBalanceColumns = [
  {
    key: "dateLabel",
    header: "Date",
    render: (day) => (
      <div>
        <div className="fw-semibold">{day.dateLabel}</div>
        <div className="text-secondary small">{day.txCountLabel} transactions</div>
      </div>
    ),
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
    render: (day) => (
      <div>
        <div className="fw-semibold">{day.netMovementLabel}</div>
        <div className="text-secondary small">{day.debitShareLabel}</div>
      </div>
    ),
  },
  {
    key: "balanceLabel",
    header: "Balance",
    headerClassName: "text-end",
    cellClassName: "text-end fw-semibold",
  },
];

export const balanceTrendSeries = [
  { key: "balance", label: "Balance", color: "#22c55e" },
  { key: "netMovement", label: "Net movement", color: "#38bdf8" },
];

export const cashFlowSegments = [
  { key: "credit", label: "Credit", color: "#22c55e" },
  { key: "debit", label: "Debit", color: "#f59e0b" },
];

export const dailyCurrencyFormatter = (value) =>
  `BDT ${new Intl.NumberFormat("en-US").format(Number(value) || 0)}`;

export const compactDailyCurrencyFormatter = (value) => `${Math.round(Number(value) / 1000)}k`;
