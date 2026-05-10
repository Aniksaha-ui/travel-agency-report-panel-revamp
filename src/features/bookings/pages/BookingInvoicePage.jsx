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
  const invoiceItemDescription = invoice?.tripName || invoice?.packageName || "Travel booking";
  const showHotel = Boolean(invoice?.hotelName);
  const showSeats = Boolean(invoice?.seatNumbers);
  const hasPaymentDetails = Boolean(
    invoice?.paymentMethod ||
      invoice?.transactionReference ||
      invoice?.bkash ||
      invoice?.nagad ||
      invoice?.card
  );

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
                  <header className="booking-invoice__masthead">
                    <h1>INVOICE</h1>
                    <div className="booking-invoice__top-fields">
                      <div>
                        <span>Date</span>
                        <strong>{boardDate}</strong>
                      </div>
                      <div>
                        <span>Invoice No.</span>
                        <strong>#{invoice.bookingId}</strong>
                      </div>
                    </div>
                  </header>

                  <section className="booking-invoice__parties">
                    <div className="booking-invoice__party">
                      <div className="booking-invoice__section-kicker">Bill to</div>
                      <strong>{invoice.userName}</strong>
                      {invoice.userEmail ? <span>{invoice.userEmail}</span> : null}
                      {invoice.bookingType ? <span>Booking type: {invoice.bookingType}</span> : null}
                      {invoice.bookingStatus ? <span>Status: {invoice.bookingStatus}</span> : null}
                    </div>

                    <div className="booking-invoice__party">
                      <div className="booking-invoice__section-kicker">From</div>
                      <strong>{APP_COMPANY.agencyName}</strong>
                      <span>{APP_COMPANY.address}</span>
                      <span>Contact: 01628781323</span>
                      {APP_COMPANY.email ? <span>{APP_COMPANY.email}</span> : null}
                    </div>
                  </section>

                  <section className="booking-invoice__route-box">
                    <div>
                      <span>Departure</span>
                      <strong>{invoice.departureTimeLabel}</strong>
                    </div>
                    <div>
                      <span>Arrival</span>
                      <strong>{invoice.arrivalTimeLabel}</strong>
                    </div>
                  </section>

                  <div className="booking-invoice__table-wrap">
                    <table className="booking-invoice__table">
                      <thead>
                        <tr>
                          <th>Description</th>
                          <th>Qty</th>
                          <th>Unit price</th>
                          <th className="text-end">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <strong>
                              {invoiceItemDescription}
                              {invoice.tripId ? ` (#${invoice.tripId})` : ""}
                            </strong>
                            {showHotel ? (
                              <span>
                                Hotel: {invoice.hotelName}
                                {invoice.hotelCity ? `, ${invoice.hotelCity}` : ""}
                                {invoice.hotelCountry ? `, ${invoice.hotelCountry}` : ""}
                              </span>
                            ) : null}
                            {showSeats ? <span>Seats: {invoice.seatNumbers}</span> : null}
                          </td>
                          <td>1</td>
                          <td>{invoice.priceLabel}</td>
                          <td className="text-end">{invoice.totalPaymentAmountLabel}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <section className="booking-invoice__bottom">
                    <div className="booking-invoice__remarks">
                      {hasPaymentDetails ? (
                        <>
                          <div className="booking-invoice__section-kicker">Payment details</div>
                          <div>
                            {invoice.paymentMethod ? <span>Method: {invoice.paymentMethod}</span> : null}
                            {invoice.transactionReference ? (
                              <span>Reference: {invoice.transactionReference}</span>
                            ) : null}
                            {invoice.bkash ? <span>bKash: {invoice.bkash}</span> : null}
                            {invoice.nagad ? <span>Nagad: {invoice.nagad}</span> : null}
                            {invoice.card ? <span>Card: {invoice.card}</span> : null}
                          </div>
                        </>
                      ) : null}
                    </div>

                    <div className="booking-invoice__totals">
                      <div className="booking-invoice__total-row">
                        <span>Subtotal</span>
                        <strong>{invoice.priceLabel}</strong>
                      </div>
                      <div className="booking-invoice__total-row">
                        <span>Paid amount</span>
                        <strong>{invoice.totalPaymentAmountLabel}</strong>
                      </div>
                      <div className="booking-invoice__total-row booking-invoice__total-row--highlight">
                        <span>Total amount</span>
                        <strong>{invoice.totalPaymentAmountLabel}</strong>
                      </div>
                    </div>
                  </section>

                  <footer className="booking-invoice__footer">
                    <div className="booking-invoice__signature">
                      <span />
                      Company Signature
                    </div>
                    <div className="booking-invoice__signature">
                      <span />
                      Client Signature
                    </div>
                  </footer>
                </div>
              ) : null}
            </Card>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}
