export const renderOccupancy = (trip) => (
  <div className="trip-performance-meter">
    <div className="trip-performance-meter__label">{trip.occupancyRateLabel}</div>
    <div className="trip-performance-meter__track">
      <span
        className="trip-performance-meter__fill"
        style={{ width: `${Math.min(trip.occupancyRate, 100)}%` }}
      />
    </div>
  </div>
);

export const tripColumns = [
  {
    key: "tripName",
    header: "Trip",
    render: (trip) => (
      <div>
        <div className="fw-semibold">{trip.tripName}</div>
        <div className="text-secondary small">ID #{trip.tripId}</div>
      </div>
    ),
  },
  {
    key: "scheduleLabel",
    header: "Schedule",
    render: (trip) => (
      <div>
        <div className="fw-semibold">{trip.scheduleLabel}</div>
        <div className="text-secondary small">
          Depart {trip.departureDateLabel} - Arrive {trip.arrivalDateLabel}
        </div>
      </div>
    ),
  },
  {
    key: "bookedSeatsLabel",
    header: "Seats",
    mobileLabel: "Seats",
    render: (trip) => (
      <div>
        <div className="fw-semibold">{trip.bookedSeatsLabel} booked</div>
        <div className="text-secondary small">
          {trip.availableSeatsLabel} available of {trip.capacityLabel}
        </div>
      </div>
    ),
  },
  {
    key: "occupancyRate",
    header: "Occupancy",
    render: renderOccupancy,
  },
  {
    key: "totalRevenueLabel",
    header: "Revenue",
    headerClassName: "text-end",
    cellClassName: "text-end fw-semibold",
  },
  {
    key: "totalProfitLabel",
    header: "Profit",
    headerClassName: "text-end",
    cellClassName: "text-end fw-semibold",
  },
];

export const revenueTrendSeries = [
  { key: "revenue", label: "Revenue", color: "#38bdf8" },
  { key: "profit", label: "Profit", color: "#22c55e" },
];

export const seatCompositionSegments = [
  { key: "bookedTrip", label: "Trip seats", color: "#38bdf8" },
  { key: "bookedPackage", label: "Package seats", color: "#8b5cf6" },
  { key: "available", label: "Available seats", color: "#f59e0b" },
];

export const compactRevenueFormatter = (value) => `${Math.round(Number(value) / 1000)}k`;
