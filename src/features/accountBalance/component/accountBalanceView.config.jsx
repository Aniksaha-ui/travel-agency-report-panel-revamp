import Badge from "../../../components/common/Badge";
import Button from "../../../components/common/Button";

export const accountBalanceCurrencyFormatter = (value) =>
  `BDT ${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Number(value) || 0)}`;

export const getAccountBalanceColumns = (onViewHistory) => [
  {
    key: "accountName",
    header: "Account",
    render: (row) => (
      <div>
        <div className="fw-semibold">{row.accountName}</div>
        <div className="text-secondary small">{row.accountNumber}</div>
      </div>
    ),
  },
  {
    key: "typeLabel",
    header: "Type",
    mobileLabel: "Type",
    render: (row) => <Badge color={row.typeTone}>{row.typeLabel}</Badge>,
  },
  {
    key: "amountLabel",
    header: "Balance",
    mobileLabel: "Balance",
    cellClassName: "fw-semibold",
  },
  {
    key: "actions",
    header: "Action",
    mobileLabel: "Action",
    render: (row) => (
      <Button variant="outline" onClick={() => onViewHistory(row)}>
        View history
      </Button>
    ),
  },
];

export const accountBalanceHistoryColumns = [
  {
    key: "userAccountNo",
    header: "Account No",
    render: (row) => (
      <div>
        <div className="fw-semibold">{row.userAccountNo}</div>
        <div className="text-secondary small">{row.gateway}</div>
      </div>
    ),
  },
  {
    key: "amountLabel",
    header: "Amount",
    mobileLabel: "Amount",
    cellClassName: "fw-semibold",
  },
  {
    key: "transactionReference",
    header: "Reference",
    mobileLabel: "Reference",
  },
  {
    key: "purpose",
    header: "Purpose",
    mobileLabel: "Purpose",
  },
  {
    key: "transactionDateLabel",
    header: "Transaction Date",
    mobileLabel: "Transaction Date",
  },
];
