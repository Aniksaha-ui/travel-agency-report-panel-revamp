import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../../../components/common/Button";
import Card from "../../../components/ui/Card";
import { APP_COMPANY } from "../../../constants/company";
import { APP_ROUTES } from "../../../constants/routes";
import AdminLayout from "../../../layouts/AdminLayout";
import { formatBoardDate } from "../../../utils/dateUtils";
import { useBookingInvoice } from "../hooks/useBookings";

export default function BookingInvoicePage() {
  const { bookingId = "" } = useParams();
  const boardDate = formatBoardDate();
  const invoiceRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const { data: invoice, error, isLoading } = useBookingInvoice(bookingId);

  const handleDownloadPdf = async () => {
    const element = invoiceRef.current;

    if (!element) {
      return;
    }

    setIsDownloading(true);

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        windowWidth: Math.max(element.scrollWidth, element.offsetWidth),
        scrollY: -window.scrollY,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imageHeight = (canvas.height * pageWidth) / canvas.width;

      let heightLeft = imageHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pageWidth, imageHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pageWidth, imageHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`invoice_${invoice?.bookingId ?? bookingId}.pdf`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="page-header d-print-none trip-performance-page-header">
        <div className="container-xl">
          <div className="trip-performance-hero booking-invoice-hero">
            <div className="trip-performance-hero__copy">
              <span className="trip-performance-hero__eyebrow">
                /admin/bookinginvoice/{bookingId || ":bookingId"}
              </span>
              <h2 className="page-title">Booking invoice</h2>
              <p className="text-secondary mb-0">
                Review invoice details on a dedicated page and export the full document as a PDF.
              </p>
            </div>

            <div className="trip-performance-hero__meta">
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Booking ID</span>
                <strong>#{bookingId || "N/A"}</strong>
              </div>
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Status</span>
                <strong>{invoice?.bookingStatus || "Loading"}</strong>
              </div>
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Board date</span>
                <strong>{boardDate}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          <section className="dashboard-section d-print-none">
            <div className="booking-invoice__toolbar">
              <Link to={APP_ROUTES.bookings} className="btn btn-outline-primary">
                Back to bookings
              </Link>
              <Button onClick={handleDownloadPdf} isLoading={isDownloading} disabled={!invoice}>
                Download PDF
              </Button>
            </div>
          </section>

          <section className="dashboard-section">
            <Card className="trip-performance-card border-0 booking-invoice-shell" bodyClassName="p-0">
              {isLoading ? (
                <div className="p-4 text-center text-secondary">Loading invoice...</div>
              ) : error ? (
                <div className="p-4 text-danger">
                  {error.message || "Unable to load booking invoice."}
                </div>
              ) : invoice ? (
                <div ref={invoiceRef} className="booking-invoice">
                  <div className="booking-invoice__watermark" aria-hidden="true">
                    {invoice.bookingStatus.toUpperCase()}
                  </div>

                  <div className="booking-invoice__topbar">
                    <div className="booking-invoice__document-title">INVOICE</div>
                    <div className="booking-invoice__document-meta">
                      Travel Booking Confirmation
                    </div>
                  </div>

                  <div className="booking-invoice__header">
                    <div className="booking-invoice__header-block">
                      <div className="booking-invoice__section-kicker">Company information</div>
                      <div className="booking-invoice__brand">{APP_COMPANY.agencyName}</div>
                      <div className="booking-invoice__brand-meta">{APP_COMPANY.address}</div>
                      <div className="booking-invoice__brand-meta">Phone: {APP_COMPANY.phone}</div>
                      <div className="booking-invoice__brand-meta">Email: {APP_COMPANY.email}</div>
                    </div>

                    <div className="booking-invoice__header-block booking-invoice__header-block--customer">
                      <div className="booking-invoice__section-kicker">Customer information</div>
                      <div className="booking-invoice__customer-name">{invoice.userName}</div>
                      <div className="booking-invoice__brand-meta">{invoice.userEmail}</div>
                      <div className="booking-invoice__brand-meta">
                        Booking ID: #{invoice.bookingId}
                      </div>
                      <div className="booking-invoice__brand-meta">Booking type: {invoice.bookingType}</div>
                    </div>
                  </div>

                  <div className="booking-invoice__meta-strip">
                    <div className="booking-invoice__meta-item">
                      <span>Status</span>
                      <strong>{invoice.bookingStatus}</strong>
                    </div>
                    <div className="booking-invoice__meta-item">
                      <span>Invoice date</span>
                      <strong>{boardDate}</strong>
                    </div>
                    <div className="booking-invoice__meta-item">
                      <span>Payment method</span>
                      <strong>{invoice.paymentMethod}</strong>
                    </div>
                    <div className="booking-invoice__meta-item">
                      <span>Reference</span>
                      <strong>{invoice.transactionReference}</strong>
                    </div>
                  </div>

                  <div className="booking-invoice__grid">
                    <section className="booking-invoice__panel">
                      <div className="booking-invoice__section-title">Trip summary</div>
                      <div className="booking-invoice__data-grid">
                        <div className="booking-invoice__data-item">
                          <span>Trip</span>
                          <strong>
                            {invoice.tripName ? `${invoice.tripName}${invoice.tripId ? ` (#${invoice.tripId})` : ""}` : "N/A"}
                          </strong>
                        </div>
                        <div className="booking-invoice__data-item">
                          <span>Package</span>
                          <strong>{invoice.packageName || "N/A"}</strong>
                        </div>
                        <div className="booking-invoice__data-item">
                          <span>Hotel</span>
                          <strong>
                            {invoice.hotelName
                              ? `${invoice.hotelName}, ${invoice.hotelCity}, ${invoice.hotelCountry}`
                              : "N/A"}
                          </strong>
                        </div>
                        <div className="booking-invoice__data-item">
                          <span>Booking type</span>
                          <strong>{invoice.bookingType}</strong>
                        </div>
                        <div className="booking-invoice__data-item">
                          <span>Departure</span>
                          <strong>{invoice.departureTimeLabel}</strong>
                        </div>
                        <div className="booking-invoice__data-item">
                          <span>Arrival</span>
                          <strong>{invoice.arrivalTimeLabel}</strong>
                        </div>
                        <div className="booking-invoice__data-item booking-invoice__data-item--wide">
                          <span>Seats</span>
                          <strong>{invoice.seatNumbers}</strong>
                        </div>
                      </div>
                    </section>

                    <section className="booking-invoice__panel">
                      <div className="booking-invoice__section-title">Payment summary</div>
                      <div className="booking-invoice__totals">
                        <div className="booking-invoice__total-row">
                          <span>Price</span>
                          <strong>{invoice.priceLabel}</strong>
                        </div>
                        <div className="booking-invoice__total-row booking-invoice__total-row--highlight">
                          <span>Total amount</span>
                          <strong>{invoice.totalPaymentAmountLabel}</strong>
                        </div>
                      </div>

                      <div className="booking-invoice__data-grid booking-invoice__data-grid--compact">
                        {invoice.bkash ? (
                          <div className="booking-invoice__data-item">
                            <span>bKash</span>
                            <strong>{invoice.bkash}</strong>
                          </div>
                        ) : null}
                        {invoice.nagad ? (
                          <div className="booking-invoice__data-item">
                            <span>Nagad</span>
                            <strong>{invoice.nagad}</strong>
                          </div>
                        ) : null}
                        {invoice.card ? (
                          <div className="booking-invoice__data-item">
                            <span>Card</span>
                            <strong>{invoice.card}</strong>
                          </div>
                        ) : null}
                      </div>
                    </section>
                  </div>

                  <div className="booking-invoice__footer-note">
                    Thank you for choosing {APP_COMPANY.agencyName}.
                  </div>
                </div>
              ) : null}
            </Card>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}
