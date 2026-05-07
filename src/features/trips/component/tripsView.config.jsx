import { Link } from "react-router-dom";
import { getTripEditRoute } from "../../../constants/routes";
import { EditIcon } from "../../../components/common/ActionIcons";
import Badge from "../../../components/common/Badge";

const getStatusColor = (isActive) => (isActive ? "success" : "neutral");

export const tripColumns = [
  {
    key: "tripName",
    header: "Trip",
    render: (trip) => (
      <div>
        <div className="fw-semibold">{trip.tripName}</div>
        <div className="text-secondary small">Trip ID #{trip.tripId}</div>
      </div>
    ),
  },
  {
    key: "routeName",
    header: "Route",
    render: (trip) => (
      <div>
        <div className="fw-semibold">{trip.routeName}</div>
        <div className="text-secondary small">{trip.vehicleName}</div>
      </div>
    ),
  },
  {
    key: "scheduleLabel",
    header: "Schedule",
    render: (trip) => (
      <div>
        <div className="fw-semibold">{trip.departureLabel}</div>
        <div className="text-secondary small">Arrives {trip.arrivalLabel}</div>
      </div>
    ),
  },
  {
    key: "statusLabel",
    header: "Status",
    mobileLabel: "Status",
    render: (trip) => <Badge color={getStatusColor(trip.isActive)}>{trip.statusLabel}</Badge>,
  },
  {
    key: "priceLabel",
    header: "Price",
    mobileLabel: "Price",
    headerClassName: "text-end",
    cellClassName: "text-end fw-semibold",
  },
  {
    key: "actions",
    header: "Action",
    headerClassName: "text-end",
    cellClassName: "text-end",
    render: (trip) => (
      <Link
        to={getTripEditRoute(trip.tripId)}
        className="btn btn-outline-primary btn-sm btn-icon"
        aria-label={`Edit ${trip.tripName}`}
        title={`Edit ${trip.tripName}`}
      >
        <EditIcon />
      </Link>
    ),
  },
];
