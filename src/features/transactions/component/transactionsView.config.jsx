import Badge from "../../../components/common/Badge";

const getSettlementTone = (status) => {
  const normalizedStatus = String(status ?? "").toLowerCase();

  if (normalizedStatus.includes("settled") || normalizedStatus.includes("success")) {
    return "success";
  }

  if (normalizedStatus.includes("pending")) {
    return "warning";
  }

  return "secondary";
};

export const transactionColumns = [
  {
    key: "transactionReference",
    header: "Reference",
    render: (transaction) => (
      <div>
        <div className="fw-semibold">{transaction.shortReference}</div>
        <div className="text-secondary small">Payment ID #{transaction.paymentId}</div>
      </div>
    ),
  },
  {
    key: "createdAtLabel",
    header: "Created",
    mobileLabel: "Created",
    render: (transaction) => (
      <div>
        <div className="fw-semibold">{transaction.createdAtLabel}</div>
        <div className="text-secondary small">Updated {transaction.updatedAtLabel}</div>
      </div>
    ),
  },
  {
    key: "customerName",
    header: "Customer",
    mobileLabel: "Customer",
    render: (transaction) => (
      <div>
        <div className="fw-semibold">{transaction.customerName}</div>
        <div className="text-secondary small">{transaction.customerEmail || "No email"}</div>
      </div>
    ),
  },
  {
    key: "paymentMethod",
    header: "Method",
    mobileLabel: "Method",
    render: (transaction) => (
      <div>
        <div className="fw-semibold">{transaction.paymentMethod}</div>
        <div className="text-secondary small">{transaction.cardBrand}</div>
      </div>
    ),
  },
  {
    key: "settlementStatus",
    header: "Settlement",
    render: (transaction) => (
      <div className="d-flex flex-column align-items-start gap-1">
        <Badge color={getSettlementTone(transaction.settlementStatus)}>
          {transaction.settlementStatus}
        </Badge>
        <span className="text-secondary small">{transaction.bankTransactionId}</span>
      </div>
    ),
  },
  {
    key: "amountLabel",
    header: "Amount",
    headerClassName: "text-end",
    cellClassName: "text-end fw-semibold",
  },
];

export const amountTrendSeries = [
  { key: "amount", label: "Amount", color: "#38bdf8" },
];

export const transactionCurrencyFormatter = (value) =>
  `BDT ${new Intl.NumberFormat("en-US").format(Number(value) || 0)}`;

export const transactionCompactCurrencyFormatter = (value) => `${Math.round(Number(value) / 1000)}k`;
