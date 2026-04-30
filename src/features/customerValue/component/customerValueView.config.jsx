import Badge from "../../../components/common/Badge";

export const renderSpendShare = (customer) => (
  <div className="trip-performance-meter">
    <div className="trip-performance-meter__label">{customer.spendShareLabel}</div>
    <div className="trip-performance-meter__track">
      <span
        className="trip-performance-meter__fill"
        style={{ width: `${Math.min(customer.spendShare, 100)}%` }}
      />
    </div>
  </div>
);

export const customerColumns = [
  {
    key: "customerName",
    header: "Customer",
    render: (customer) => (
      <div>
        <div className="fw-semibold">{customer.customerName}</div>
        <div className="text-secondary small">ID #{customer.userId}</div>
      </div>
    ),
  },
  {
    key: "totalBookingsLabel",
    header: "Bookings",
    mobileLabel: "Bookings",
    render: (customer) => (
      <div>
        <div className="fw-semibold">{customer.totalBookingsLabel}</div>
        <div className="text-secondary small">
          {customer.tripBookingsLabel} trip - {customer.packageBookingsLabel} package
        </div>
      </div>
    ),
  },
  {
    key: "spendShare",
    header: "Spend share",
    render: renderSpendShare,
  },
  {
    key: "totalPaidLabel",
    header: "Total paid",
    headerClassName: "text-end",
    cellClassName: "text-end fw-semibold",
  },
  {
    key: "netSpentLabel",
    header: "Net spent",
    headerClassName: "text-end",
    cellClassName: "text-end fw-semibold",
  },
  {
    key: "customerTierLabel",
    header: "Tier",
    render: (customer) => (
      <div className="d-flex flex-column align-items-start gap-1">
        <Badge color={customer.customerTierTone}>{customer.customerTierLabel}</Badge>
        <span className="text-secondary small">{customer.refundRateLabel}</span>
      </div>
    ),
  },
];

export const spendTrendSeries = [
  { key: "paid", label: "Paid", color: "#38bdf8" },
  { key: "netSpent", label: "Net spent", color: "#22c55e" },
];

export const customerCurrencyFormatter = (value) =>
  `BDT ${new Intl.NumberFormat("en-US").format(Number(value) || 0)}`;

export const customerCompactCurrencyFormatter = (value) => `${Math.round(Number(value) / 1000)}k`;
