import { startTransition, useState } from "react";
import useDebouncedValue from "../../../hooks/useDebouncedValue";
import AdminLayout from "../../../layouts/AdminLayout";
import { formatBoardDate } from "../../../utils/dateUtils";
import RefundsDesktopView from "../component/RefundsDesktopView";
import RefundsMobileView from "../component/RefundsMobileView";
import RefundsTableFooter from "../component/RefundsTableFooter";
import { REFUNDS_COPY } from "../constants/refunds.constants";
import useRefunds, { useRefundDisburseMutation } from "../hooks/useRefunds";

export default function RefundsPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 450);
  const { data, error, isFetching, isLoading, refetch } = useRefunds(
    page,
    debouncedSearchTerm,
  );
  const disburseMutation = useRefundDisburseMutation();
  const copy = data?.copy ?? REFUNDS_COPY;
  const metrics = data?.metrics ?? [];
  const refunds = data?.refunds ?? [];
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
      setSearchTerm(value);
      setPage(1);
    });
  };

  const handleDisburseRefund = async (refund) => {
    await disburseMutation.mutateAsync(refund.id);
    refetch();
  };

  const tableFooter = (
    <RefundsTableFooter
      changePage={changePage}
      debouncedSearchTerm={debouncedSearchTerm}
      isFetching={isFetching}
      page={page}
      pagination={pagination}
    />
  );

  return (
    <AdminLayout>
      <RefundsMobileView
        boardDate={boardDate}
        changePage={changePage}
        charts={charts}
        copy={copy}
        disbursingRefundId={String(disburseMutation.variables ?? "")}
        error={error}
        handleSearchChange={handleSearchChange}
        isDisbursing={disburseMutation.isPending}
        isFetching={isFetching}
        isLoading={isLoading}
        metrics={metrics}
        onDisburseRefund={handleDisburseRefund}
        page={page}
        pagination={pagination}
        searchTerm={searchTerm}
        summary={summary}
        refunds={refunds}
      />
      <RefundsDesktopView
        boardDate={boardDate}
        charts={charts}
        copy={copy}
        disbursingRefundId={String(disburseMutation.variables ?? "")}
        error={error}
        handleSearchChange={handleSearchChange}
        isDisbursing={disburseMutation.isPending}
        isLoading={isLoading}
        metrics={metrics}
        onDisburseRefund={handleDisburseRefund}
        pagination={pagination}
        searchTerm={searchTerm}
        summary={summary}
        tableFooter={tableFooter}
        refunds={refunds}
      />
    </AdminLayout>
  );
}
