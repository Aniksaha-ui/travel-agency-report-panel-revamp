export const vehicleTrackingColumns = [
  {
    key: "tripName",
    header: "Trip",
    render: (assignment) => (
      <div>
        <div className="fw-semibold">{assignment.tripName}</div>
        <div className="text-secondary small">Trip ID #{assignment.tripId}</div>
      </div>
    ),
  },
  {
    key: "vehicleName",
    header: "Vehicle",
    mobileLabel: "Vehicle",
    render: (assignment) => (
      <div>
        <div className="fw-semibold">{assignment.vehicleName}</div>
        <div className="text-secondary small">Vehicle ID #{assignment.vehicleId}</div>
      </div>
    ),
  },
  {
    key: "scheduleLabel",
    header: "Travel window",
    mobileLabel: "Window",
    render: (assignment) => (
      <div>
        <div className="fw-semibold">{assignment.scheduleLabel}</div>
        <div className="text-secondary small">{assignment.durationLabel}</div>
      </div>
    ),
  },
  {
    key: "departureAt",
    header: "Departure",
    mobileLabel: "Departure",
  },
  {
    key: "arrivalAt",
    header: "Arrival",
    mobileLabel: "Arrival",
  },
  {
    key: "durationLabel",
    header: "Duration",
    headerClassName: "text-end",
    cellClassName: "text-end fw-semibold",
  },
];

export const assignmentTrendSeries = [
  { key: "assignments", label: "Assignments", color: "#38bdf8" },
];

export const vehicleCountFormatter = (value) => `${Number(value) || 0}`;

export const vehicleAssignmentFormatter = (value) =>
  `${Number(value) || 0} assignment${Number(value) === 1 ? "" : "s"}`;
