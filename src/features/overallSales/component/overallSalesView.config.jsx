export const sourceSalesColumns = [
  {
    key: "source",
    header: "Source",
    render: (source) => (
      <div className="d-flex align-items-center gap-2">
        <span
          className="booking-summary-color-dot"
          style={{ backgroundColor: source.color }}
          aria-hidden="true"
        />
        <div>
          <div className="fw-semibold">{source.source}</div>
          <div className="text-secondary small">{source.shareLabel}</div>
        </div>
      </div>
    ),
  },
  {
    key: "amountLabel",
    header: "Total amount",
    headerClassName: "text-end",
    cellClassName: "text-end fw-semibold",
  },
  {
    key: "shareLabel",
    header: "Share",
    mobileLabel: "Share",
  },
];

export const routeSalesColumns = [
  {
    key: "routeName",
    header: "Route",
    render: (route) => (
      <div>
        <div className="fw-semibold">{route.routeName}</div>
        <div className="text-secondary small">{route.averageRevenueLabel} avg / booking</div>
      </div>
    ),
  },
  {
    key: "totalBookingsLabel",
    header: "Bookings",
    mobileLabel: "Bookings",
  },
  {
    key: "totalRevenueLabel",
    header: "Revenue",
    headerClassName: "text-end",
    cellClassName: "text-end fw-semibold",
  },
];

export const overallSalesCurrencyFormatter = (value) =>
  `BDT ${new Intl.NumberFormat("en-US").format(Number(value) || 0)}`;

export const overallSalesCompactCurrencyFormatter = (value) => `${Math.round(Number(value) / 1000)}k`;

export const routeBookingFormatter = (value) =>
  `${Number(value) || 0} booking${Number(value) === 1 ? "" : "s"}`;
