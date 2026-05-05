import { startTransition, useState } from "react";
import { formatBoardDate } from "../../../utils/dateUtils";
import useDebouncedValue from "../../../hooks/useDebouncedValue";
import AdminLayout from "../../../layouts/AdminLayout";
import TicketsDesktopView from "../component/TicketsDesktopView";
import TicketsMobileView from "../component/TicketsMobileView";
import TicketsTableFooter from "../component/TicketsTableFooter";
import TicketWorkflowModal from "../component/TicketWorkflowModal";
import { TICKETS_COPY } from "../constants/tickets.constants";
import useTickets, { useTicketStatusMutation } from "../hooks/useTickets";

export default function TicketsPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTicketState, setSelectedTicketState] = useState(null);
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 450);
  const { data, error, isFetching, isLoading } = useTickets(page, debouncedSearchTerm);
  const ticketStatusMutation = useTicketStatusMutation();
  const copy = data?.copy ?? TICKETS_COPY;
  const metrics = data?.metrics ?? [];
  const tickets = data?.tickets ?? [];
  const pagination = data?.pagination ?? {};
  const summary = data?.summary ?? {};
  const charts = data?.charts ?? {};
  const boardDate = formatBoardDate();

  const selectedTicket =
    tickets.find((ticket) => String(ticket.id) === String(selectedTicketState?.ticketId)) ?? null;

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

  const handleOpenDetails = (ticket, actionKey = "") => {
    setSelectedTicketState({
      ticketId: ticket.id,
      actionKey,
    });
  };

  const handleCloseWorkflow = () => {
    setSelectedTicketState(null);
  };

  const handleQuickAction = async (ticket, transition, remarks = "") => {
    if (transition.requiresRemarks && !remarks.trim()) {
      handleOpenDetails(ticket, transition.key);
      return;
    }

    await ticketStatusMutation.mutateAsync({
      ticketId: ticket.id,
      status: transition.status,
      resolvedStatus: transition.resolvedStatus,
      resolvedRemarks: remarks.trim(),
    });

    if (
      selectedTicketState?.ticketId &&
      String(selectedTicketState.ticketId) === String(ticket.id)
    ) {
      handleCloseWorkflow();
    }
  };

  const tableFooter = (
    <TicketsTableFooter
      changePage={changePage}
      debouncedSearchTerm={debouncedSearchTerm}
      isFetching={isFetching}
      page={page}
      pagination={pagination}
    />
  );

  return (
    <AdminLayout>
      <TicketsMobileView
        boardDate={boardDate}
        changePage={changePage}
        charts={charts}
        copy={copy}
        error={error}
        handleSearchChange={handleSearchChange}
        isFetching={isFetching}
        isLoading={isLoading}
        metrics={metrics}
        onOpenDetails={handleOpenDetails}
        onQuickAction={handleQuickAction}
        page={page}
        pagination={pagination}
        searchTerm={searchTerm}
        summary={summary}
        tickets={tickets}
      />
      <TicketsDesktopView
        boardDate={boardDate}
        charts={charts}
        copy={copy}
        error={error}
        handleSearchChange={handleSearchChange}
        isLoading={isLoading}
        metrics={metrics}
        onOpenDetails={handleOpenDetails}
        onQuickAction={handleQuickAction}
        pagination={pagination}
        searchTerm={searchTerm}
        summary={summary}
        tableFooter={tableFooter}
        tickets={tickets}
      />
      <TicketWorkflowModal
        isOpen={Boolean(selectedTicket)}
        isSubmitting={ticketStatusMutation.isPending}
        onClose={handleCloseWorkflow}
        onQuickAction={handleQuickAction}
        preferredActionKey={selectedTicketState?.actionKey}
        ticket={selectedTicket}
      />
    </AdminLayout>
  );
}
