import Badge from "../../../components/common/Badge";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import { formatTravelDate } from "../../../utils/dateUtils";

const STATUS_TONES = {
  confirmed: "success",
  pending: "warning",
  "awaiting-payment": "info",
};

const formatStatusLabel = (status) =>
  status
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");

const columns = [
  {
    key: "traveler",
    header: "Traveler",
    render: (row) => (
      <div>
        <div className="fw-semibold">{row.traveler}</div>
        <div className="text-secondary small">{row.id}</div>
      </div>
    ),
  },
  { key: "destination", header: "Destination" },
  {
    key: "departureDate",
    header: "Departure",
    render: (row) => formatTravelDate(row.departureDate),
  },
  { key: "agent", header: "Assigned agent" },
  {
    key: "amount",
    header: "Amount",
    headerClassName: "text-end",
    cellClassName: "text-end fw-semibold",
  },
  {
    key: "status",
    header: "Status",
    render: (row) => <Badge color={STATUS_TONES[row.status]}>{formatStatusLabel(row.status)}</Badge>,
  },
];

export default function RecentBookingsTable({ bookings }) {
  return (
    <Card
      title="Recent bookings"
      subtitle="Reusable table component with destination, amount, and status data."
      bodyClassName="p-0"
    >
      <Table
        columns={columns}
        data={bookings}
        emptyTitle="No matching bookings"
        emptyDescription="Try a different search term or status filter."
      />
    </Card>
  );
}
