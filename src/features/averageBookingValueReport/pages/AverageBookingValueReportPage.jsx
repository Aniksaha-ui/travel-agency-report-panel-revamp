import RechartsPieChart from "../../../components/charts/RechartsPieChart";
import RechartsRankingChart from "../../../components/charts/RechartsRankingChart";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import AdminLayout from "../../../layouts/AdminLayout";
import MetricsOverview from "../../dashboard/components/MetricsOverview";
import useAverageBookingValueReport from "../hooks/useAverageBookingValueReport";
import { formatBoardDate } from "../../../utils/dateUtils";

const averageBookingValueColumns = [
  {
    key: "bookingType",
    header: "Booking type",
    render: (row) => <span className="fw-semibold">{row.bookingType}</span>,
  },
  {
    key: "averageValueLabel",
    header: "Average value",
    headerClassName: "text-end",
    cellClassName: "text-end fw-semibold",
  },
];

export default function AverageBookingValueReportPage() {
  const { data, isLoading } = useAverageBookingValueReport();
  const copy = data?.copy;
  const metrics = data?.metrics ?? [];
  const bookingTypes = data?.bookingTypes ?? [];
  const summary = data?.summary ?? {};
  const charts = data?.charts ?? {};
  const boardDate = formatBoardDate();

  return (
    <AdminLayout>
      <div className="page-header d-print-none trip-performance-page-header">
        <div className="container-xl">
          <div className="trip-performance-hero">
            <div className="trip-performance-hero__copy">
              <span className="trip-performance-hero__eyebrow">/admin/avg-booking-value-report</span>
              <h2 className="page-title">{copy?.pageTitle ?? "Average booking value report"}</h2>
              <p className="text-secondary mb-0">
                {copy?.pageSubtitle ?? "Compare the average value across booking categories returned by the report API."}
              </p>
            </div>

            <div className="trip-performance-hero__meta">
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Categories</span>
                <strong>{bookingTypes.length}</strong>
              </div>
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Top category</span>
                <strong>{summary.highestType?.bookingType ?? "No data"}</strong>
              </div>
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Board date</span>
                <strong>{boardDate}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          <section className="dashboard-section">
            <MetricsOverview metrics={metrics} />
          </section>

          <section className="dashboard-section">
            <div className="row g-3">
              <div className="col-12 col-xl-5">
                <Card
                  title="Average value mix"
                  subtitle="Relative contribution of each booking category to the returned average values."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsPieChart
                    items={charts.averageValueMix ?? []}
                    height={300}
                    totalLabel="average value"
                    valueFormatter={(value) =>
                      `BDT ${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Number(value) || 0)}`
                    }
                  />
                </Card>
              </div>

              <div className="col-12 col-xl-7">
                <Card
                  title="Average booking value ranking"
                  subtitle="Compare booking categories by their reported average value."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsRankingChart
                    items={charts.averageValueRanking ?? []}
                    labelKey="label"
                    valueKey="value"
                    tooltipLabel="Average value"
                    valueFormatter={(value) =>
                      `BDT ${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Number(value) || 0)}`
                    }
                    getCellColor={() => "#38bdf8"}
                  />
                </Card>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <Card
              title="Average booking value ledger"
              subtitle="Booking categories and average values returned by the API."
              className="trip-performance-card border-0"
              bodyClassName="p-0"
            >
              {isLoading && !bookingTypes.length ? (
                <div className="p-4 text-center text-secondary">Loading average booking value report...</div>
              ) : (
                <Table
                  columns={averageBookingValueColumns}
                  data={bookingTypes}
                  emptyTitle="No booking value data"
                  emptyDescription="The API did not return any booking value rows."
                />
              )}
            </Card>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}
