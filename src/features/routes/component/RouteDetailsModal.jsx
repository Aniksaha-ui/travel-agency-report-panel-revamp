import Modal from "../../../components/ui/Modal";

export default function RouteDetailsModal({ isLoading, isOpen, onClose, route }) {
  return (
    <Modal
      ariaLabel="Route details"
      isOpen={isOpen}
      onClose={onClose}
      title={route?.routeName ?? "Route details"}
      subtitle={route ? `Route ID #${route.routeId}` : "Loading route information"}
      dialogClassName="app-modal__dialog--narrow"
    >
      {isLoading && !route ? (
        <div className="text-secondary">Loading route details...</div>
      ) : route ? (
        <div className="trip-performance-summary-grid">
          <div className="trip-performance-summary-grid__item">
            <span className="trip-performance-summary-grid__label">Route name</span>
            <strong>{route.routeName}</strong>
          </div>
          <div className="trip-performance-summary-grid__item">
            <span className="trip-performance-summary-grid__label">Origin</span>
            <strong>{route.origin}</strong>
          </div>
          <div className="trip-performance-summary-grid__item">
            <span className="trip-performance-summary-grid__label">Destination</span>
            <strong>{route.destination}</strong>
          </div>
          <div className="trip-performance-summary-grid__item">
            <span className="trip-performance-summary-grid__label">Updated</span>
            <strong>{route.updatedAtLabel}</strong>
          </div>
          <div className="trip-performance-summary-grid__item">
            <span className="trip-performance-summary-grid__label">Created</span>
            <strong>{route.createdAtLabel}</strong>
          </div>
        </div>
      ) : (
        <div className="text-secondary">Route details are not available.</div>
      )}
    </Modal>
  );
}
