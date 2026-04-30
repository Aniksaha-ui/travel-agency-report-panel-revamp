import RechartsAreaChart from "../../../components/charts/RechartsAreaChart";
import RechartsBarChart from "../../../components/charts/RechartsBarChart";
import {
  compactFinancialFormatter,
  financialCompositionSegments,
  financialTrendSeries,
} from "./financialReportView.config";

export default function FinancialReportMobileView({
  boardDate,
  charts,
  copy,
  isLoading,
  metrics,
  reports,
  summary,
}) {
  const latestReport = summary.latestReport;

  return (
    <div className="d-md-none trip-performance-mobile">
      <div className="container-xl">
        <div className="trip-performance-mobile__screen">
          <section className="trip-performance-mobile__hero">
            <div className="trip-performance-mobile__hero-top">
              <div>
                <div className="trip-performance-mobile__eyebrow">/admin/financialReport</div>
                <h2 className="trip-performance-mobile__title">{copy.pageTitle}</h2>
                <p className="trip-performance-mobile__subtitle">{copy.pageSubtitle}</p>
              </div>
              <span className="trip-performance-mobile__date">{boardDate}</span>
            </div>

            <div className="trip-performance-mobile__spotlight">
              <div>
                <div className="trip-performance-mobile__spotlight-label">Retained fiscal value</div>
                <div className="trip-performance-mobile__spotlight-value">
                  {summary.totalRetainedLabel ?? "BDT 0"}
                </div>
                <div className="trip-performance-mobile__spotlight-meta">
                  {latestReport
                    ? `${latestReport.shortFiscalYearLabel} - ${latestReport.marginRateLabel}`
                    : "No financial report records yet."}
                </div>
              </div>
              <div className="trip-performance-mobile__spotlight-stack">
                <span>{summary.totalPaymentsLabel ?? "BDT 0"} paid</span>
                <span>{summary.totalCostingLabel ?? "BDT 0"} cost</span>
              </div>
            </div>

            <div className="trip-performance-mobile__metric-grid">
              {metrics.map((metric) => (
                <article key={metric.id} className="trip-performance-mobile__metric">
                  <div className="trip-performance-mobile__metric-label">{metric.label}</div>
                  <div className="trip-performance-mobile__metric-value">{metric.value}</div>
                  <div className="trip-performance-mobile__metric-meta">{metric.change}</div>
                </article>
              ))}
            </div>
          </section>

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Payments vs retained</div>
                <div className="trip-performance-mobile__card-subtle">
                  Compare gross fiscal payments against retained value
                </div>
              </div>
            </div>

            <RechartsAreaChart
              data={charts.fiscalTrend ?? []}
              series={financialTrendSeries}
              height={220}
              labelKey="label"
              valueFormatter={compactFinancialFormatter}
            />
          </section>

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Financial composition</div>
                <div className="trip-performance-mobile__card-subtle">
                  Retained amount, costing, and refunds by fiscal year
                </div>
              </div>
            </div>

            <RechartsBarChart
              items={charts.financialComposition ?? []}
              segments={financialCompositionSegments}
              labelKey="label"
              height={250}
            />
          </section>

          <section className="trip-performance-mobile__card">
            <div className="trip-performance-mobile__card-header">
              <div>
                <div className="trip-performance-mobile__card-title">Financial ledger</div>
                <div className="trip-performance-mobile__card-subtle">
                  Fiscal payments, refunds, costs, and margin
                </div>
              </div>
              <div className="trip-performance-mobile__pill">{reports.length} total</div>
            </div>

            <div className="trip-performance-mobile__list">
              {reports.length ? (
                reports.map((report) => (
                  <article key={report.id} className="trip-performance-mobile__item">
                    <div className="trip-performance-mobile__item-top">
                      <div>
                        <div className="trip-performance-mobile__item-title">{report.shortFiscalYearLabel}</div>
                        <div className="trip-performance-mobile__item-meta">{report.fiscalYearLabel}</div>
                      </div>
                      <div className="trip-performance-mobile__item-profit">{report.retainedAmountLabel}</div>
                    </div>
                    <div className="trip-performance-mobile__item-grid">
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">
                          {report.paymentAmountLabel}
                        </div>
                        <div className="trip-performance-mobile__item-grid-label">Payments</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{report.refundLabel}</div>
                        <div className="trip-performance-mobile__item-grid-label">Refund</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{report.costingLabel}</div>
                        <div className="trip-performance-mobile__item-grid-label">Costing</div>
                      </div>
                      <div>
                        <div className="trip-performance-mobile__item-grid-value">{report.marginRateLabel}</div>
                        <div className="trip-performance-mobile__item-grid-label">Margin</div>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="trip-performance-mobile__empty">
                  {isLoading ? "Loading financial report..." : "No financial report data available."}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
