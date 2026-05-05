import Modal from "../../../components/ui/Modal";

export default function PackageDetailsModal({ isLoading, isOpen, onClose, pkg }) {
  return (
    <Modal
      ariaLabel="Package details"
      isOpen={isOpen}
      onClose={onClose}
      title={pkg?.name ?? "Package details"}
      subtitle={pkg ? `Package ID #${pkg.packageId}` : "Loading package information"}
      dialogClassName="app-modal__dialog"
    >
      {isLoading && !pkg ? (
        <div className="text-secondary">Loading package details...</div>
      ) : pkg ? (
        <div className="d-grid gap-4">
          <div className="trip-performance-summary-grid">
            <div className="trip-performance-summary-grid__item">
              <span className="trip-performance-summary-grid__label">Coverage</span>
              <strong>{pkg.coverageItems.length ? pkg.coverageItems.join(", ") : "Custom"}</strong>
            </div>
            <div className="trip-performance-summary-grid__item">
              <span className="trip-performance-summary-grid__label">Lowest adult price</span>
              <strong>{pkg.lowestAdultPriceLabel}</strong>
            </div>
            <div className="trip-performance-summary-grid__item">
              <span className="trip-performance-summary-grid__label">Trip route</span>
              <strong>{pkg.trip.routeName}</strong>
            </div>
            <div className="trip-performance-summary-grid__item">
              <span className="trip-performance-summary-grid__label">Created</span>
              <strong>{pkg.createdAtLabel}</strong>
            </div>
            <div className="trip-performance-summary-grid__item">
              <span className="trip-performance-summary-grid__label">Updated</span>
              <strong>{pkg.updatedAtLabel}</strong>
            </div>
          </div>

          <div>
            <div className="fw-semibold mb-2">Description</div>
            <div className="text-secondary small">{pkg.description || "No description available."}</div>
          </div>

          <div className="row g-3">
            <div className="col-12 col-lg-6">
              <div className="fw-semibold mb-2">Inclusions</div>
              {pkg.inclusions.length ? (
                <ul className="mb-0 ps-3 text-secondary small">
                  {pkg.inclusions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <div className="text-secondary small">No inclusions listed.</div>
              )}
            </div>
            <div className="col-12 col-lg-6">
              <div className="fw-semibold mb-2">Exclusions</div>
              {pkg.exclusions.length ? (
                <ul className="mb-0 ps-3 text-secondary small">
                  {pkg.exclusions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <div className="text-secondary small">No exclusions listed.</div>
              )}
            </div>
          </div>

          <div>
            <div className="fw-semibold mb-2">Trip snapshot</div>
            <div className="trip-performance-summary-grid">
              <div className="trip-performance-summary-grid__item">
                <span className="trip-performance-summary-grid__label">Trip ID</span>
                <strong>#{pkg.trip.tripId || "N/A"}</strong>
              </div>
              <div className="trip-performance-summary-grid__item">
                <span className="trip-performance-summary-grid__label">Route ID</span>
                <strong>#{pkg.trip.routeId || "N/A"}</strong>
              </div>
              <div className="trip-performance-summary-grid__item">
                <span className="trip-performance-summary-grid__label">Vehicle ID</span>
                <strong>#{pkg.trip.vehicleId || "N/A"}</strong>
              </div>
              <div className="trip-performance-summary-grid__item">
                <span className="trip-performance-summary-grid__label">Departure</span>
                <strong>{pkg.trip.departureTimeLabel}</strong>
              </div>
              <div className="trip-performance-summary-grid__item">
                <span className="trip-performance-summary-grid__label">Arrival</span>
                <strong>{pkg.trip.arrivalTimeLabel}</strong>
              </div>
            </div>
          </div>

          <div>
            <div className="fw-semibold mb-2">Pricing</div>
            {pkg.pricing.length ? (
              <div className="table-responsive">
                <table className="table table-sm table-striped mb-0">
                  <thead>
                    <tr>
                      <th>Adult price</th>
                      <th>Child price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pkg.pricing.map((item) => (
                      <tr key={item.id}>
                        <td>{item.adultPriceLabel}</td>
                        <td>{item.childPriceLabel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-secondary small">No package pricing is available.</div>
            )}
          </div>

          <div>
            <div className="fw-semibold mb-2">Image</div>
            {pkg.imageUrl ? (
              <a href={pkg.imageUrl} target="_blank" rel="noreferrer" className="text-decoration-none">
                <img
                  src={pkg.imageUrl}
                  alt={pkg.name}
                  className="img-fluid rounded border"
                  style={{ maxHeight: 220, objectFit: "cover", width: "100%" }}
                />
              </a>
            ) : (
              <div className="text-secondary small">No image is attached to this package.</div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-secondary">Package details are not available.</div>
      )}
    </Modal>
  );
}
