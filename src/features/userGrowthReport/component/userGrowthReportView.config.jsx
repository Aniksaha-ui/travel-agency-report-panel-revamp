export const growthDeltaFormatter = (value) => {
  const normalizedValue = Number(value) || 0;

  return `${normalizedValue >= 0 ? "+" : ""}${normalizedValue}`;
};

export const newUsersFormatter = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(
    Number(value) || 0,
  );

export const userGrowthColumns = [
  {
    key: "monthLabel",
    header: "Month",
    render: (row) => <span className="fw-semibold">{row.monthLabel}</span>,
  },
  {
    key: "newUsersLabel",
    header: "New users",
    headerClassName: "text-end",
    cellClassName: "text-end fw-semibold",
  },
  {
    key: "growthLabel",
    header: "Trend",
    headerClassName: "text-end",
    cellClassName: "text-end",
    render: (row) => (
      <span
        className={
          row.growthDirection === "up"
            ? "text-success fw-semibold"
            : row.growthDirection === "down"
              ? "text-danger fw-semibold"
              : "text-secondary fw-semibold"
        }
      >
        {row.growthLabel}
      </span>
    ),
  },
];

