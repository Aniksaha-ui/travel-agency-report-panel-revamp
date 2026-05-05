import { startTransition, useState } from "react";
import useDebouncedValue from "../../../hooks/useDebouncedValue";
import AdminLayout from "../../../layouts/AdminLayout";
import TransactionsDesktopView from "../component/TransactionsDesktopView";
import TransactionsMobileView from "../component/TransactionsMobileView";
import TransactionsTableFooter from "../component/TransactionsTableFooter";
import { TRANSACTIONS_COPY } from "../constants/transactions.constants";
import useTransactions from "../hooks/useTransactions";
import { formatBoardDate } from "../../../utils/dateUtils";

export default function TransactionsPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 450);
  const { data, isFetching, isLoading } = useTransactions(page, debouncedSearchTerm);
  const copy = data?.copy ?? TRANSACTIONS_COPY;
  const metrics = data?.metrics ?? [];
  const transactions = data?.transactions ?? [];
  const pagination = data?.pagination ?? {};
  const summary = data?.summary ?? {};
  const charts = data?.charts ?? {};
  const boardDate = formatBoardDate();

  const changePage = (nextPage) => {
    startTransition(() => {
      setPage(nextPage);
    });
  };

  const handleSearchChange = (event) => {
    const { value } = event.target;

    startTransition(() => {
      setPage(1);
      setSearchTerm(value);
    });
  };

  const tableFooter = (
    <TransactionsTableFooter
      changePage={changePage}
      isFetching={isFetching}
      page={page}
      pagination={pagination}
    />
  );

  return (
    <AdminLayout>
      <TransactionsMobileView
        boardDate={boardDate}
        changePage={changePage}
        charts={charts}
        copy={copy}
        handleSearchChange={handleSearchChange}
        isFetching={isFetching}
        isLoading={isLoading}
        metrics={metrics}
        page={page}
        pagination={pagination}
        searchTerm={searchTerm}
        summary={summary}
        transactions={transactions}
      />
      <TransactionsDesktopView
        boardDate={boardDate}
        charts={charts}
        copy={copy}
        handleSearchChange={handleSearchChange}
        isFetching={isFetching}
        isLoading={isLoading}
        metrics={metrics}
        pagination={pagination}
        searchTerm={searchTerm}
        summary={summary}
        tableFooter={tableFooter}
        transactions={transactions}
      />
    </AdminLayout>
  );
}
