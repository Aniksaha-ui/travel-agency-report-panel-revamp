import Modal from "../../../components/ui/Modal";

export default function HotelDetailsModal({ hotel, isLoading, isOpen, onClose }) {
  return (
    <Modal
      ariaLabel="Hotel details"
      isOpen={isOpen}
      onClose={onClose}
      title={hotel?.name ?? "Hotel details"}
      subtitle={hotel ? `Hotel ID #${hotel.hotelId}` : "Loading hotel information"}
      dialogClassName="app-modal__dialog"
    >
      {isLoading && !hotel ? (
        <div className="text-secondary">Loading hotel details...</div>
      ) : hotel ? (
        <div className="d-grid gap-4">
          <div className="trip-performance-summary-grid">
            <div className="trip-performance-summary-grid__item">
              <span className="trip-performance-summary-grid__label">Location</span>
              <strong>{hotel.location}</strong>
            </div>
            <div className="trip-performance-summary-grid__item">
              <span className="trip-performance-summary-grid__label">City</span>
              <strong>{hotel.city || "Not available"}</strong>
            </div>
            <div className="trip-performance-summary-grid__item">
              <span className="trip-performance-summary-grid__label">Rating</span>
              <strong>{hotel.starRatingLabel}</strong>
            </div>
            <div className="trip-performance-summary-grid__item">
              <span className="trip-performance-summary-grid__label">Rooms</span>
              <strong>{hotel.roomCountLabel}</strong>
            </div>
            <div className="trip-performance-summary-grid__item">
              <span className="trip-performance-summary-grid__label">Photos</span>
              <strong>{hotel.photoCountLabel}</strong>
            </div>
            <div className="trip-performance-summary-grid__item">
              <span className="trip-performance-summary-grid__label">Lowest season rate</span>
              <strong>{hotel.minimumPriceLabel}</strong>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-12 col-lg-6">
              <div className="fw-semibold mb-2">Contact</div>
              <div className="text-secondary small mb-1">{hotel.email || "No email provided"}</div>
              {hotel.website ? (
                <a href={hotel.website} target="_blank" rel="noreferrer">
                  {hotel.website}
                </a>
              ) : (
                <div className="text-secondary small">No website provided</div>
              )}
            </div>
            <div className="col-12 col-lg-6">
              <div className="fw-semibold mb-2">Facilities</div>
              <div className="text-secondary small">{hotel.facilities || "No facilities listed"}</div>
            </div>
          </div>

          <div>
            <div className="fw-semibold mb-2">Description</div>
            <div className="text-secondary small">{hotel.description || "No description available."}</div>
          </div>

          <div>
            <div className="fw-semibold mb-2">Photos</div>
            {hotel.photos.length ? (
              <div className="row g-3">
                {hotel.photos.map((photo) => (
                  <div key={photo} className="col-12 col-md-6">
                    <a href={photo} target="_blank" rel="noreferrer" className="text-decoration-none">
                      <img
                        src={photo}
                        alt={hotel.name}
                        className="img-fluid rounded border"
                        style={{ maxHeight: 180, objectFit: "cover", width: "100%" }}
                      />
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-secondary small">No hotel photos are available.</div>
            )}
          </div>

          <div>
            <div className="fw-semibold mb-3">Rooms and seasonal prices</div>
            <div className="d-grid gap-3">
              {hotel.rooms.map((room) => (
                <div key={room.id} className="border rounded p-3">
                  <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-3">
                    <div>
                      <div className="fw-semibold">{room.typeName}</div>
                      <div className="text-secondary small">
                        {room.roomSize || "Size not listed"} | {room.totalRoomsLabel} rooms | Max{" "}
                        {room.maxOccupancyLabel} guest(s)
                      </div>
                    </div>
                    <div className="text-secondary small">{room.amenities || "No amenities listed"}</div>
                  </div>

                  {room.prices.length ? (
                    <div className="table-responsive">
                      <table className="table table-sm table-striped mb-0">
                        <thead>
                          <tr>
                            <th>Season start</th>
                            <th>Season end</th>
                            <th>Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {room.prices.map((price) => (
                            <tr key={price.id || `${price.seasonStart}-${price.seasonEnd}`}>
                              <td>{price.seasonStart}</td>
                              <td>{price.seasonEnd}</td>
                              <td>{price.pricePerNightLabel}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-secondary small">No seasonal prices defined for this room.</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-secondary">Hotel details are not available.</div>
      )}
    </Modal>
  );
}
