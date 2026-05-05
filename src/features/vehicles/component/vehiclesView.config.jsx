export const vehicleColumns = [
  {
    key: "vehicleName",
    header: "Vehicle",
    render: (vehicle) => (
      <div>
        <div className="fw-semibold">{vehicle.vehicleName}</div>
        <div className="text-secondary small">Vehicle ID #{vehicle.vehicleId}</div>
      </div>
    ),
  },
  {
    key: "vehicleType",
    header: "Type",
    mobileLabel: "Type",
  },
  {
    key: "totalSeatsLabel",
    header: "Seats",
    mobileLabel: "Seats",
  },
  {
    key: "routeName",
    header: "Route",
    mobileLabel: "Route",
  },
];
