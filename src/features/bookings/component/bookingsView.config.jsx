import { Link } from "react-router-dom";
import Badge from "../../../components/common/Badge";
import { InvoiceIcon } from "../../../components/common/ActionIcons";
import { getBookingInvoiceRoute } from "../../../constants/routes";

export const getBookingColumns = () => [
  {
    key: "bookingId",
    header: "Booking ID",
    render: (booking) => <span className="fw-semibold">#{booking.bookingId}</span>,
  },
  {
    key: "tripName",
    header: "Trip",
    render: (booking) => (
      <div>
        <div className="fw-semibold">{booking.tripName}</div>
        <div className="text-secondary small">{booking.packageName}</div>
      </div>
    ),
  },
  {
    key: "bookingType",
    header: "Booking type",
    render: (booking) => <Badge color={booking.bookingTypeTone}>{booking.bookingType}</Badge>,
  },
  {
    key: "userName",
    header: "User",
    render: (booking) => (
      <div>
        <div className="fw-semibold">{booking.userName}</div>
        <div className="text-secondary small">{booking.createdAtLabel}</div>
      </div>
    ),
  },
  {
    key: "paymentStatusLabel",
    header: "Payment status",
    render: (booking) => <Badge color={booking.paymentTone}>{booking.paymentStatusLabel}</Badge>,
  },
  {
    key: "seats",
    header: "Seats",
    render: (booking) => (
      <div>
        <div className="fw-semibold">{booking.seats}</div>
        <div className="text-secondary small">{booking.seatCount} seat(s)</div>
      </div>
    ),
  },
  {
    key: "actions",
    header: "Invoice",
    headerClassName: "text-end",
    cellClassName: "text-end",
    render: (booking) => (
      <Link
        to={getBookingInvoiceRoute(booking.bookingId)}
        className="btn btn-outline-primary btn-sm btn-icon"
        aria-label={`Open invoice for booking ${booking.bookingId}`}
        title={`Open invoice for booking ${booking.bookingId}`}
      >
        <InvoiceIcon />
      </Link>
    ),
  },
];
