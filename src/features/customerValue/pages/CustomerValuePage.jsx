import { startTransition, useState } from "react";
import useDebouncedValue from "../../../hooks/useDebouncedValue";
import AdminLayout from "../../../layouts/AdminLayout";
import CustomerValueDesktopView from "../component/CustomerValueDesktopView";
import CustomerValueMobileView from "../component/CustomerValueMobileView";
import CustomerValueTableFooter from "../component/CustomerValueTableFooter";
import { CUSTOMER_VALUE_COPY } from "../constants/customerValue.constants";
import useCustomerValue from "../hooks/useCustomerValue";

export default function CustomerValuePage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 450);
  const { data, isFetching, isLoading } = useCustomerValue(page, debouncedSearchTerm);
  const copy = data?.copy ?? CUSTOMER_VALUE_COPY;
  const metrics = data?.metrics ?? [];
  const customers = data?.customers ?? [];
  const pagination = data?.pagination ?? {};
  const summary = data?.summary ?? {};
  const charts = data?.charts ?? {};
  const topCustomer = summary.topCustomer;
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

  const handleSearchChange = (event) => {
    const { value } = event.target;

    startTransition(() => {
      setSearchTerm(value);
      setPage(1);
    });
  };

  const tableFooter = (
    <CustomerValueTableFooter
      changePage={changePage}
      debouncedSearchTerm={debouncedSearchTerm}
      isFetching={isFetching}
      page={page}
      pagination={pagination}
    />
  );

  return (
    <AdminLayout>
      <CustomerValueMobileView
        boardDate={boardDate}
        changePage={changePage}
        charts={charts}
        copy={copy}
        customers={customers}
        handleSearchChange={handleSearchChange}
        isFetching={isFetching}
        isLoading={isLoading}
        metrics={metrics}
        page={page}
        pagination={pagination}
        searchTerm={searchTerm}
        summary={summary}
        topCustomer={topCustomer}
      />
      <CustomerValueDesktopView
        boardDate={boardDate}
        charts={charts}
        copy={copy}
        customers={customers}
        handleSearchChange={handleSearchChange}
        isLoading={isLoading}
        metrics={metrics}
        pagination={pagination}
        searchTerm={searchTerm}
        summary={summary}
        tableFooter={tableFooter}
        topCustomer={topCustomer}
      />
    </AdminLayout>
  );
}
