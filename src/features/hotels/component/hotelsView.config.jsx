import { Link } from "react-router-dom";
import Badge from "../../../components/common/Badge";
import { getHotelEditRoute } from "../../../constants/routes";

const getStatusColor = (isActive) => (isActive ? "success" : "neutral");

export const getHotelColumns = (onViewDetails) => [
  {
    key: "name",
    header: "Hotel",
    render: (hotel) => (
      <div>
        <div className="fw-semibold">{hotel.name}</div>
        <div className="text-secondary small">Hotel ID #{hotel.hotelId}</div>
      </div>
    ),
  },
  {
    key: "location",
    header: "Location",
    render: (hotel) => (
      <div>
        <div className="fw-semibold">{hotel.location}</div>
        <div className="text-secondary small">
          {hotel.city}, {hotel.country}
        </div>
      </div>
    ),
  },
  {
    key: "starRatingLabel",
    header: "Rating",
    mobileLabel: "Rating",
  },
  {
    key: "statusLabel",
    header: "Status",
    mobileLabel: "Status",
    render: (hotel) => <Badge color={getStatusColor(hotel.isActive)}>{hotel.statusLabel}</Badge>,
  },
  {
    key: "updatedAtLabel",
    header: "Updated",
    render: (hotel) => (
      <div>
        <div className="fw-semibold">{hotel.updatedAtLabel}</div>
        <div className="text-secondary small">Created {hotel.createdAtLabel}</div>
      </div>
    ),
  },
  {
    key: "actions",
    header: "Action",
    headerClassName: "text-end",
    cellClassName: "text-end",
    render: (hotel) => (
      <div className="d-inline-flex gap-2">
        <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          onClick={() => onViewDetails(hotel.hotelId)}
        >
          View
        </button>
        <Link
          to={getHotelEditRoute(hotel.hotelId)}
          state={{ hotel }}
          className="btn btn-outline-primary btn-sm"
        >
          Edit
        </Link>
      </div>
    ),
  },
];
