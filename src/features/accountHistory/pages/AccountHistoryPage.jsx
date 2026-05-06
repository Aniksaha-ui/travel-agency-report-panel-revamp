import dayjs from "dayjs";
import { startTransition, useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import { formatBoardDate } from "../../../utils/dateUtils";
import AccountHistoryDesktopView from "../component/AccountHistoryDesktopView";
import AccountHistoryMobileView from "../component/AccountHistoryMobileView";
import AccountHistoryTableFooter from "../component/AccountHistoryTableFooter";
import { ACCOUNT_HISTORY_COPY } from "../constants/accountHistory.constants";
import useAccountHistory from "../hooks/useAccountHistory";

const getDefaultFilters = () => ({
  startDate: dayjs().subtract(29, "day").format("YYYY-MM-DD"),
  endDate: dayjs().format("YYYY-MM-DD"),
});

export default function AccountHistoryPage() {
  const defaults = getDefaultFilters();
  const [page, setPage] = useState(1);
  const [draftFilters, setDraftFilters] = useState(defaults);
  const [appliedFilters, setAppliedFilters] = useState(defaults);
  const { data, error, isFetching, isLoading } = useAccountHistory({
    page,
    startDate: appliedFilters.startDate,
    endDate: appliedFilters.endDate,
  });
  const copy = data?.copy ?? ACCOUNT_HISTORY_COPY;
  const metrics = data?.metrics ?? [];
  const rows = data?.rows ?? [];
  const pagination = data?.pagination ?? {};
  const summary = data?.summary ?? {};
  const charts = data?.charts ?? {};
  const boardDate = formatBoardDate();

  const handleDateChange = (event) => {
    const { name, value } = event.target;

    startTransition(() => {
      setDraftFilters((current) => ({
        ...current,
        [name]: value,
      }));
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    startTransition(() => {
      setPage(1);
      setAppliedFilters(draftFilters);
    });
  };

  const changePage = (nextPage) => {
    startTransition(() => {
      setPage(nextPage);
    });
  };

  const tableFooter = (
    <AccountHistoryTableFooter
      changePage={changePage}
      isFetching={isFetching}
      page={page}
      pagination={pagination}
    />
  );

  return (
    <AdminLayout>
      <AccountHistoryMobileView
        boardDate={boardDate}
        changePage={changePage}
        charts={charts}
        copy={copy}
        draftEndDate={draftFilters.endDate}
        draftStartDate={draftFilters.startDate}
        error={error}
        handleDateChange={handleDateChange}
        handleSubmit={handleSubmit}
        isFetching={isFetching}
        isLoading={isLoading}
        metrics={metrics}
        page={page}
        pagination={pagination}
        rows={rows}
        summary={summary}
      />
      <AccountHistoryDesktopView
        boardDate={boardDate}
        charts={charts}
        copy={copy}
        draftEndDate={draftFilters.endDate}
        draftStartDate={draftFilters.startDate}
        error={error}
        handleDateChange={handleDateChange}
        handleSubmit={handleSubmit}
        isFetching={isFetching}
        isLoading={isLoading}
        metrics={metrics}
        pagination={pagination}
        rows={rows}
        summary={summary}
        tableFooter={tableFooter}
      />
    </AdminLayout>
  );
}
