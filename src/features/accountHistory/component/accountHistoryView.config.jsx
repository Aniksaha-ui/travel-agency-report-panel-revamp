import Badge from "../../../components/common/Badge";

export const accountHistoryCurrencyFormatter = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

export const accountHistoryTrendSeries = [
  { key: "credit", label: "Credit", color: "#22c55e" },
  { key: "debit", label: "Debit", color: "#f59e0b" },
];

export const accountHistoryColumns = [
  {
    key: "transactionDateLabel",
    header: "Date",
    mobileLabel: "Date",
  },
  {
    key: "purpose",
    header: "Purpose",
    render: (row) => (
      <div>
        <div className="fw-semibold">{row.purpose}</div>
        <div className="text-secondary small">{row.transactionTypeLabel}</div>
      </div>
    ),
  },
  {
    key: "gateway",
    header: "Gateway",
    mobileLabel: "Gateway",
    render: (row) => <Badge color={row.transactionTone}>{row.gateway}</Badge>,
  },
  {
    key: "accounts",
    header: "Account No",
    render: (row) => (
      <div>
        <div>User: {row.userAccountNo}</div>
        <div className="text-secondary small">Company: {row.companyAccountNo}</div>
      </div>
    ),
  },
  {
    key: "transactionReference",
    header: "Transaction Ref",
    mobileLabel: "Transaction Ref",
  },
  {
    key: "amountLabel",
    header: "Amount",
    mobileLabel: "Amount",
    cellClassName: "fw-semibold text-end",
  },
];
