import { Link } from "react-router-dom";
import Badge from "../../../components/common/Badge";
import Button from "../../../components/common/Button";
import { EditIcon } from "../../../components/common/ActionIcons";
import ViewIcon from "../../../components/common/ViewIcon";
import SearchField from "../../../components/forms/SearchField";
import { APP_ROUTES, getHotelEditRoute } from "../../../constants/routes";

export default function HotelsMobileView({
  boardDate,
  changePage,
  copy,
  handleSearchChange,
  isFetching,
  isLoading,
  metrics,
  onViewDetails,
  page,
  pagination,
  searchTerm,
  summary,
  hotels,
}) {
  return (
    <div className="d-md-none trip-performance-mobile">
      <div className="container-xl">
        <div className="trip-performance-mobile__screen">
          <section className="trip-performance-mobile__hero">
            <div className="trip-performance-mobile__hero-top">
              <div>
                <div className="trip-performance-mobile__eyebrow">/admin/hotel</div>
                <h2 className="trip-performance-mobile__title">{copy.pageTitle}</h2>
                <p className="trip-performance-mobile__subtitle">{copy.pageSubtitle}</p>
              </div>
              <span className="trip-performance-mobile__date">{boardDate}</span>
            </div>

            <div className="trip-performance-mobile__spotlight">
              <div>
                <div className="trip-performance-mobile__spotlight-label">Top visible rating</div>
                <div className="trip-performance-mobile__spotlight-value">
                  {summary.spotlightHotel?.name ?? "No hotels available"}
                </div>
                <div className="trip-performance-mobile__spotlight-meta">
                  {summary.spotlightHotel
                    ? `${summary.spotlightHotel.starRatingLabel} in ${summary.spotlightHotel.location}`
                    : "Waiting for hotel data"}
                </div>
              </div>
              <div className="trip-performance-mobile__spotlight-stack">
                <span>{summary.averageRatingLabel ?? "0.0"} avg</span>
                <span>{summary.activeHotelsLabel ?? "0"} active</span>
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

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Hotel ledger</div>
                <div className="trip-performance-mobile__card-subtle">
                  Showing {pagination.from ?? 0}-{pagination.to ?? 0} of {pagination.total ?? 0}
                </div>
              </div>
              <div className="trip-performance-mobile__pill">
                Page {pagination.currentPage ?? 1}/{pagination.lastPage ?? 1}
              </div>
            </div>

            <div className="d-grid gap-2 mb-3">
              <SearchField
                className="trip-performance-search"
                placeholder="Filter loaded hotels"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Link to={APP_ROUTES.hotelCreate} className="btn btn-primary">
                Add hotel
              </Link>
            </div>

            <div className="trip-performance-mobile__list">
              {hotels.length ? (
                hotels.map((hotel) => (
                  <article key={hotel.id} className="trip-performance-mobile__item">
                    <div className="trip-performance-mobile__item-top">
                      <div>
                        <div className="trip-performance-mobile__item-title">{hotel.name}</div>
                        <div className="trip-performance-mobile__item-meta">{hotel.location}</div>
                      </div>
                      <div className="trip-performance-mobile__item-profit">{hotel.starRatingLabel}</div>
                    </div>

                    <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
                      <div className="text-secondary small">{hotel.email}</div>
                      <Badge color={hotel.isActive ? "success" : "neutral"}>{hotel.statusLabel}</Badge>
                    </div>

                    <div className="trip-performance-mobile__item-grid">
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{hotel.city}</div>
                        <div className="trip-performance-mobile__item-grid-label">City</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{hotel.country}</div>
                        <div className="trip-performance-mobile__item-grid-label">Country</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{hotel.updatedAtLabel}</div>
                        <div className="trip-performance-mobile__item-grid-label">Updated</div>
                      </div>
                    </div>

                    <div className="d-flex gap-2 mt-3">
                      <Button
                        variant="outline"
                        className="btn-icon"
                        aria-label={`View ${hotel.name}`}
                        title={`View ${hotel.name}`}
                        icon={<ViewIcon />}
                        onClick={() => onViewDetails(hotel.hotelId)}
                      />
                      <Link
                        to={getHotelEditRoute(hotel.hotelId)}
                        state={{ hotel }}
                        className="btn btn-outline-primary btn-icon"
                        aria-label={`Edit ${hotel.name}`}
                        title={`Edit ${hotel.name}`}
                      >
                        <EditIcon />
                      </Link>
                    </div>
                  </article>
                ))
              ) : (
                <div className="trip-performance-mobile__empty">
                  {isLoading ? "Loading hotels..." : "No hotels matched the current filter."}
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
