import { useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import FinancialReportDesktopView from "../component/FinancialReportDesktopView";
import FinancialReportMobileView from "../component/FinancialReportMobileView";
import FinancialReportTableFooter from "../component/FinancialReportTableFooter";
import { FINANCIAL_REPORT_COPY } from "../constants/financialReport.constants";
import useFinancialReport from "../hooks/useFinancialReport";

export default function FinancialReportPage() {
  const [page] = useState(1);
  const { data, isLoading } = useFinancialReport(page);
  const copy = data?.copy ?? FINANCIAL_REPORT_COPY;
  const metrics = data?.metrics ?? [];
  const reports = data?.reports ?? [];
  const pagination = data?.pagination ?? {};
  const summary = data?.summary ?? {};
  const charts = data?.charts ?? {};
  const boardDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date());

  const tableFooter = <FinancialReportTableFooter pagination={pagination} />;

  return (
    <AdminLayout>
      <FinancialReportMobileView
        boardDate={boardDate}
        charts={charts}
        copy={copy}
        isLoading={isLoading}
        metrics={metrics}
        reports={reports}
        summary={summary}
      />
      <FinancialReportDesktopView
        boardDate={boardDate}
        charts={charts}
        copy={copy}
        isLoading={isLoading}
        metrics={metrics}
        pagination={pagination}
        reports={reports}
        summary={summary}
        tableFooter={tableFooter}
      />
    </AdminLayout>
  );
}
