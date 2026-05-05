import Badge from "../../../components/common/Badge";
import Button from "../../../components/common/Button";

export const refundTrendSeries = [{ key: "bookings", label: "Refunds", color: "#38bdf8" }];

export const refundCountFormatter = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Number(value) || 0);

export const refundCurrencyFormatter = (value) =>
  `BDT ${refundCountFormatter(value)}`;

export const createRefundColumns = ({ disbursingRefundId, isDisbursing, onDisburseRefund }) => [
  {
    key: "refundId",
    header: "SL",
    headerClassName: "text-center",
    cellClassName: "text-center fw-semibold",
  },
  {
    key: "bookingDateLabel",
    header: "Booking date",
    mobileLabel: "Booking date",
    render: (refund) => (
      <div>
        <div className="fw-semibold">{refund.bookingDateLabel}</div>
        <div className="text-secondary small">{refund.bookingDateTimeLabel}</div>
      </div>
    ),
  },
  {
    key: "tripName",
    header: "Trip name",
    mobileLabel: "Trip",
    render: (refund) => (
      <div>
        <div className="fw-semibold">{refund.tripName}</div>
        <div className="text-secondary small">{refund.amountLabel}</div>
      </div>
    ),
  },
  {
    key: "seatIds",
    header: "Seats",
    mobileLabel: "Seats",
    render: (refund) => (
      <div>
        <div className="fw-semibold">{refund.seatIds}</div>
        <div className="text-secondary small">{refund.seatCountLabel} seats</div>
      </div>
    ),
  },
  {
    key: "reason",
    header: "Reason for refund",
    mobileLabel: "Reason",
  },
  {
    key: "statusLabel",
    header: "Disbursement status",
    mobileLabel: "Status",
    render: (refund) => <Badge color={refund.tone}>{refund.statusLabel}</Badge>,
  },
  {
    key: "actions",
    header: "Action",
    headerClassName: "text-end",
    cellClassName: "text-end",
    render: (refund) =>
      refund.isPending ? (
        <Button
          className="btn-sm"
          isLoading={isDisbursing && String(disbursingRefundId) === String(refund.id)}
          onClick={() => onDisburseRefund(refund)}
        >
          Disburse
        </Button>
      ) : (
        <span className="text-secondary small">Completed</span>
      ),
  },
];
