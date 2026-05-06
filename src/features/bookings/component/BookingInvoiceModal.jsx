import Badge from "../../../components/common/Badge";
import Modal from "../../../components/ui/Modal";

export default function BookingInvoiceModal({
  bookingId,
  error,
  invoice,
  isLoading,
  isOpen,
  onClose,
}) {
  return (
    <Modal
      ariaLabel="Booking invoice"
      closeLabel="Close"
      dialogClassName="tickets-modal"
      isOpen={isOpen}
      onClose={onClose}
      subtitle="Invoice details for the selected booking."
      title={bookingId ? `Booking invoice #${bookingId}` : "Booking invoice"}
    >
      {isLoading ? (
        <div className="text-secondary">Loading invoice...</div>
      ) : error ? (
        <div className="text-danger">{error.message || "Unable to load booking invoice."}</div>
      ) : invoice ? (
        <div className="tickets-modal__stack">
          <section className="tickets-modal__summary">
            <div className="tickets-modal__summary-main">
              <div className="tickets-modal__summary-kicker">Invoice</div>
              <div className="tickets-modal__summary-title">{invoice.userName}</div>
              <div className="tickets-modal__summary-meta">{invoice.userEmail}</div>
            </div>
            <div className="tickets-modal__summary-badges">
              <Badge color={invoice.bookingStatusTone}>{invoice.bookingStatus}</Badge>
              <Badge color="info">{invoice.bookingType}</Badge>
            </div>
          </section>

          <section className="tickets-modal__details">
            <div className="tickets-modal__detail">
              <span className="tickets-modal__detail-label">Trip</span>
              <strong>{invoice.tripName || "N/A"}</strong>
            </div>
            <div className="tickets-modal__detail">
              <span className="tickets-modal__detail-label">Package</span>
              <strong>{invoice.packageName || "N/A"}</strong>
            </div>
            <div className="tickets-modal__detail">
              <span className="tickets-modal__detail-label">Hotel</span>
              <strong>
                {invoice.hotelName
                  ? `${invoice.hotelName}, ${invoice.hotelCity}, ${invoice.hotelCountry}`
                  : "N/A"}
              </strong>
            </div>
            <div className="tickets-modal__detail">
              <span className="tickets-modal__detail-label">Departure</span>
              <strong>{invoice.departureTimeLabel}</strong>
            </div>
            <div className="tickets-modal__detail">
              <span className="tickets-modal__detail-label">Arrival</span>
              <strong>{invoice.arrivalTimeLabel}</strong>
            </div>
            <div className="tickets-modal__detail">
              <span className="tickets-modal__detail-label">Seats</span>
              <strong>{invoice.seatNumbers}</strong>
            </div>
          </section>

          <section className="tickets-modal__panel">
            <div className="tickets-modal__panel-title">Payment summary</div>
            <div className="trip-performance-summary-grid">
              <div className="trip-performance-summary-grid__item">
                <span className="trip-performance-summary-grid__label">Price</span>
                <strong>{invoice.priceLabel}</strong>
              </div>
              <div className="trip-performance-summary-grid__item">
                <span className="trip-performance-summary-grid__label">Total amount</span>
                <strong>{invoice.totalPaymentAmountLabel}</strong>
              </div>
              <div className="trip-performance-summary-grid__item">
                <span className="trip-performance-summary-grid__label">Payment method</span>
                <strong>{invoice.paymentMethod}</strong>
              </div>
              <div className="trip-performance-summary-grid__item">
                <span className="trip-performance-summary-grid__label">Reference</span>
                <strong>{invoice.transactionReference}</strong>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </Modal>
  );
}

