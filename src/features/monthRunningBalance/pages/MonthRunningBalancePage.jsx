import { startTransition, useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import MonthRunningBalanceDesktopView from "../component/MonthRunningBalanceDesktopView";
import MonthRunningBalanceMobileView from "../component/MonthRunningBalanceMobileView";
import MonthRunningBalanceTableFooter from "../component/MonthRunningBalanceTableFooter";
import { MONTH_RUNNING_BALANCE_COPY } from "../constants/monthRunningBalance.constants";
import useMonthRunningBalance from "../hooks/useMonthRunningBalance";

export default function MonthRunningBalancePage() {
  const [page, setPage] = useState(1);
  const { data, isFetching, isLoading } = useMonthRunningBalance(page);
  const copy = data?.copy ?? MONTH_RUNNING_BALANCE_COPY;
  const metrics = data?.metrics ?? [];
  const months = data?.months ?? [];
  const pagination = data?.pagination ?? {};
  const summary = data?.summary ?? {};
  const charts = data?.charts ?? {};
  const latestMonth = summary.latestMonth;
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

  const tableFooter = (
    <MonthRunningBalanceTableFooter
      changePage={changePage}
      isFetching={isFetching}
      page={page}
      pagination={pagination}
    />
  );

  return (
    <AdminLayout>
      <MonthRunningBalanceMobileView
        boardDate={boardDate}
        changePage={changePage}
        charts={charts}
        copy={copy}
        isFetching={isFetching}
        isLoading={isLoading}
        latestMonth={latestMonth}
        metrics={metrics}
        months={months}
        page={page}
        pagination={pagination}
        summary={summary}
      />
      <MonthRunningBalanceDesktopView
        boardDate={boardDate}
        charts={charts}
        copy={copy}
        isLoading={isLoading}
        latestMonth={latestMonth}
        metrics={metrics}
        months={months}
        pagination={pagination}
        summary={summary}
        tableFooter={tableFooter}
      />
    </AdminLayout>
  );
}
