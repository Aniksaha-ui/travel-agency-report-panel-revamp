import { startTransition, useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import DailyBalanceDesktopView from "../component/DailyBalanceDesktopView";
import DailyBalanceMobileView from "../component/DailyBalanceMobileView";
import DailyBalanceReportModal from "../component/DailyBalanceReportModal";
import DailyBalanceTableFooter from "../component/DailyBalanceTableFooter";
import { DAILY_BALANCE_COPY } from "../constants/dailyBalance.constants";
import useDailyBalance from "../hooks/useDailyBalance";
import useDailyBalanceHistory from "../hooks/useDailyBalanceHistory";

export default function DailyBalancePage() {
  const [page, setPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const { data, isFetching, isLoading } = useDailyBalance(page);
  const {
    data: history,
    isFetching: isHistoryFetching,
    isLoading: isHistoryLoading,
  } = useDailyBalanceHistory(historyPage);
  const copy = data?.copy ?? DAILY_BALANCE_COPY;
  const metrics = data?.metrics ?? [];
  const days = data?.days ?? [];
  const pagination = data?.pagination ?? {};
  const summary = data?.summary ?? {};
  const charts = data?.charts ?? {};
  const latestDay = summary.latestDay;
  const boardDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date());

  const changePage = (nextPage) => {
    startTransition(() => {
      setPage(nextPage);
    });
  };

  const changeHistoryPage = (nextPage) => {
    startTransition(() => {
      setHistoryPage(nextPage);
    });
  };

  const handleSelectReport = (report) => {
    startTransition(() => {
      setSelectedReport(report);
      setIsReportModalOpen(true);
    });
  };

  const handleCloseReport = () => {
    startTransition(() => {
      setIsReportModalOpen(false);
    });
  };

  const tableFooter = (
    <DailyBalanceTableFooter
      changePage={changePage}
      isFetching={isFetching}
      page={page}
      pagination={pagination}
    />
  );

  return (
    <AdminLayout>
      <DailyBalanceMobileView
        boardDate={boardDate}
        changePage={changePage}
        charts={charts}
        changeHistoryPage={changeHistoryPage}
        copy={copy}
        days={days}
        history={history}
        isFetching={isFetching}
        isHistoryFetching={isHistoryFetching}
        isHistoryLoading={isHistoryLoading}
        isLoading={isLoading}
        latestDay={latestDay}
        metrics={metrics}
        onSelectReport={handleSelectReport}
        page={page}
        pagination={pagination}
        selectedReport={selectedReport}
        summary={summary}
      />
      <DailyBalanceDesktopView
        boardDate={boardDate}
        changeHistoryPage={changeHistoryPage}
        charts={charts}
        copy={copy}
        days={days}
        history={history}
        isHistoryFetching={isHistoryFetching}
        isHistoryLoading={isHistoryLoading}
        isLoading={isLoading}
        latestDay={latestDay}
        metrics={metrics}
        onSelectReport={handleSelectReport}
        pagination={pagination}
        selectedReport={selectedReport}
        summary={summary}
        tableFooter={tableFooter}
      />
      <DailyBalanceReportModal
        isOpen={isReportModalOpen}
        onClose={handleCloseReport}
        report={selectedReport}
      />
    </AdminLayout>
  );
}
