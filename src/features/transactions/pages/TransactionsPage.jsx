import { startTransition, useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import TransactionsDesktopView from "../component/TransactionsDesktopView";
import TransactionsMobileView from "../component/TransactionsMobileView";
import TransactionsTableFooter from "../component/TransactionsTableFooter";
import { TRANSACTIONS_COPY } from "../constants/transactions.constants";
import useTransactions from "../hooks/useTransactions";

export default function TransactionsPage() {
  const [page, setPage] = useState(1);
  const { data, isFetching, isLoading } = useTransactions(page);
  const copy = data?.copy ?? TRANSACTIONS_COPY;
  const metrics = data?.metrics ?? [];
  const transactions = data?.transactions ?? [];
  const pagination = data?.pagination ?? {};
  const summary = data?.summary ?? {};
  const charts = data?.charts ?? {};
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
        isFetching={isFetching}
        isLoading={isLoading}
        metrics={metrics}
        page={page}
        pagination={pagination}
        summary={summary}
        transactions={transactions}
      />
      <TransactionsDesktopView
        boardDate={boardDate}
        charts={charts}
        copy={copy}
        isLoading={isLoading}
        metrics={metrics}
        pagination={pagination}
        summary={summary}
        tableFooter={tableFooter}
        transactions={transactions}
      />
    </AdminLayout>
  );
}
