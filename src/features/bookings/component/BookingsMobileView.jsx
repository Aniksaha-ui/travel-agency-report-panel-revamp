import { Link } from "react-router-dom";
import Badge from "../../../components/common/Badge";
import Button from "../../../components/common/Button";
import { getBookingInvoiceRoute } from "../../../constants/routes";

export default function BookingsMobileView({
  boardDate,
  bookings,
  changePage,
  copy,
  error,
  handleSearchChange,
  isFetching,
  isLoading,
  metrics,
  page,
  pagination,
  searchTerm,
  summary,
}) {
  return (
    <div className="d-md-none trip-performance-mobile">
      <div className="container-xl">
        <div className="trip-performance-mobile__screen">
          <section className="trip-performance-mobile__hero">
            <div className="trip-performance-mobile__hero-top">
              <div>
                <div className="trip-performance-mobile__eyebrow">/admin/bookings</div>
                <h2 className="trip-performance-mobile__title">{copy.pageTitle}</h2>
                <p className="trip-performance-mobile__subtitle">{copy.pageSubtitle}</p>
              </div>
              <span className="trip-performance-mobile__date">{boardDate}</span>
            </div>

            <div className="trip-performance-mobile__spotlight">
              <div>
                <div className="trip-performance-mobile__spotlight-label">Latest booking</div>
                <div className="trip-performance-mobile__spotlight-value">
                  #{summary.latestBooking?.bookingId ?? "0"}
                </div>
                <div className="trip-performance-mobile__spotlight-meta">
                  {summary.latestBooking?.userName ?? "No booking records yet."}
                </div>
              </div>
              <div className="trip-performance-mobile__spotlight-stack">
                <span>{summary.paidBookingsLabel ?? "0"} paid</span>
                <span>{summary.tripBookingsLabel ?? "0"} trip</span>
              </div>
            </div>

            <div className="trip-performance-mobile__metric-grid">
              {metrics.map((metric) => (
                <article key={metric.id} className="trip-performance-mobile__metric">
                  <div className="trip-performance-mobile__metric-label">{metric.label}</div>
                  <div className="trip-performance-mobile__metric-value">{metric.value}</div>
                  <div className="trip-performance-mobile__metric-meta">{metric.change}</div>
                </article>
              ))}
            </div>
          </section>

          {error ? (
            <section className="trip-performance-mobile__card">
              <div className="text-danger">
                {error.message || "Unable to load booking information."}
              </div>
            </section>
          ) : null}

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Booking queue</div>
                <div className="trip-performance-mobile__card-subtle">
                  Search and open invoice details from the booking feed
                </div>
              </div>
              <div className="trip-performance-mobile__pill">
                Page {pagination.currentPage ?? 1}/{pagination.lastPage ?? 1}
              </div>
            </div>

            <div className="trip-performance-mobile__search">
              <span className="trip-performance-mobile__search-icon" aria-hidden="true">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={18}
                  height={18}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                  <path d="M21 21l-6 -6" />
                </svg>
              </span>
              <input
                type="search"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search bookings"
                aria-label="Search bookings"
              />
            </div>

            <div className="trip-performance-mobile__list">
              {bookings.length ? (
                bookings.map((booking) => (
                  <article key={booking.id} className="trip-performance-mobile__item">
                    <div className="trip-performance-mobile__item-top">
                      <div>
                        <div className="trip-performance-mobile__item-title">{booking.tripName}</div>
                        <div className="trip-performance-mobile__item-meta">
                          #{booking.bookingId} • {booking.userName}
                        </div>
                      </div>
                      <Badge color={booking.paymentTone}>{booking.paymentStatusLabel}</Badge>
                    </div>

                    <div className="trip-performance-mobile__item-grid">
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">
                          {booking.bookingType}
                        </div>
                        <div className="trip-performance-mobile__item-grid-label">Type</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{booking.seats}</div>
                        <div className="trip-performance-mobile__item-grid-label">Seats</div>
                      </div>
                    </div>

                    <div className="text-secondary small mb-3">{booking.createdAtLabel}</div>

                    <Link
                      to={getBookingInvoiceRoute(booking.bookingId)}
                      className="btn btn-outline-primary btn-mobile-full"
                    >
                      Invoice
                    </Link>
                  </article>
                ))
              ) : (
                <div className="trip-performance-mobile__empty">
                  {isLoading ? "Loading bookings..." : "No bookings available."}
                </div>
              )}
            </div>

            <div className="trip-performance-mobile__pager">
              <Button
                variant="outline"
                fullWidthOnMobile
                disabled={!pagination.hasPrev || isFetching}
                onClick={() => changePage(page - 1)}
              >
                Previous
              </Button>
              <Button
                fullWidthOnMobile
                disabled={!pagination.hasNext || isFetching}
                onClick={() => changePage(page + 1)}
              >
                Next
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
