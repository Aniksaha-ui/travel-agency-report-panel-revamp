export const bookingSummaryColumns = [
  {
    key: "bookingTypeLabel",
    header: "Booking type",
    render: (category) => (
      <div className="d-flex align-items-center gap-2">
        <span
          className="booking-summary-color-dot"
          style={{ backgroundColor: category.color }}
          aria-hidden="true"
        />
        <div>
          <div className="fw-semibold">{category.bookingTypeLabel}</div>
          <div className="text-secondary small">{category.shareLabel}</div>
        </div>
      </div>
    ),
  },
  {
    key: "totalBookingLabel",
    header: "Total bookings",
    headerClassName: "text-end",
    cellClassName: "text-end fw-semibold",
  },
  {
    key: "shareLabel",
    header: "Share",
    mobileLabel: "Share",
  },
];

export const bookingCountFormatter = (value) =>
  `${Number(value) || 0} booking${Number(value) === 1 ? "" : "s"}`;
