import RechartsPieChart from "../../../components/charts/RechartsPieChart";
import Badge from "../../../components/common/Badge";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import AdminLayout from "../../../layouts/AdminLayout";
import MetricsOverview from "../../dashboard/components/MetricsOverview";
import useRefundStatusReport from "../hooks/useRefundStatusReport";

const refundStatusColumns = [
  {
    key: "status",
    header: "Status",
    render: (row) => <Badge color={row.tone}>{row.status}</Badge>,
  },
  {
    key: "totalRefundsLabel",
    header: "Total refunds",
    headerClassName: "text-end",
    cellClassName: "text-end fw-semibold",
  },
  {
    key: "totalAmountLabel",
    header: "Total amount",
    headerClassName: "text-end",
    cellClassName: "text-end fw-semibold",
  },
];

export default function RefundStatusReportPage() {
  const { data, isLoading } = useRefundStatusReport();
  const copy = data?.copy;
  const metrics = data?.metrics ?? [];
  const statuses = data?.statuses ?? [];
  const summary = data?.summary ?? {};
  const charts = data?.charts ?? {};
  const boardDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date());

  return (
    <AdminLayout>
      <div className="page-header d-print-none trip-performance-page-header">
        <div className="container-xl">
          <div className="trip-performance-hero">
            <div className="trip-performance-hero__copy">
              <span className="trip-performance-hero__eyebrow">/admin/refund-status-report</span>
              <h2 className="page-title">{copy?.pageTitle ?? "Refund status report"}</h2>
              <p className="text-secondary mb-0">
                {copy?.pageSubtitle ?? "Track refund counts and disbursed value by refund status."}
              </p>
            </div>

            <div className="trip-performance-hero__meta">
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Statuses</span>
                <strong>{statuses.length}</strong>
              </div>
              <div className="trip-performance-hero__meta-item">
                <span className="trip-performance-hero__meta-label">Refund amount</span>
                <strong>{summary.totalAmountLabel ?? "BDT 0"}</strong>
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
                  title="Refund amount by status"
                  subtitle="Distribution of refunded value across current refund states."
                  className="trip-performance-card border-0 h-100"
                >
                  <RechartsPieChart
                    items={charts.amountMix ?? []}
                    height={300}
                    totalLabel="refund value"
                    valueFormatter={(value) =>
                      `BDT ${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Number(value) || 0)}`
                    }
                  />
                </Card>
              </div>

              <div className="col-12 col-xl-7">
                <Card
                  title="Refund status ledger"
                  subtitle="Summary rows returned from the refund status report API."
                  className="trip-performance-card border-0 h-100"
                  bodyClassName="p-0"
                >
                  {isLoading && !statuses.length ? (
                    <div className="p-4 text-center text-secondary">Loading refund status report...</div>
                  ) : (
                    <Table
                      columns={refundStatusColumns}
                      data={statuses}
                      emptyTitle="No refund status data"
                      emptyDescription="The API did not return any refund status rows."
                    />
                  )}
                </Card>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}
