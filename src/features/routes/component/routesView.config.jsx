export const getRouteColumns = (onViewDetails) => [
  {
    key: "routeName",
    header: "Route",
    render: (route) => (
      <div>
        <div className="fw-semibold">{route.routeName}</div>
        <div className="text-secondary small">Route ID #{route.routeId}</div>
      </div>
    ),
  },
  {
    key: "origin",
    header: "Origin",
    mobileLabel: "Origin",
  },
  {
    key: "destination",
    header: "Destination",
    mobileLabel: "Destination",
  },
  {
    key: "updatedAtLabel",
    header: "Updated",
    render: (route) => (
      <div>
        <div className="fw-semibold">{route.updatedAtLabel}</div>
        <div className="text-secondary small">Created {route.createdAtLabel}</div>
      </div>
    ),
  },
  {
    key: "actions",
    header: "Action",
    headerClassName: "text-end",
    cellClassName: "text-end",
    render: (route) => (
      <button
        type="button"
        className="btn btn-outline-primary btn-sm"
        onClick={() => onViewDetails(route.routeId)}
      >
        View
      </button>
    ),
  },
];
