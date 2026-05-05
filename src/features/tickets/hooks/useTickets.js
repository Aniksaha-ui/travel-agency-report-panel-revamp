import {
  keepPreviousData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";
import useApi from "../../../hooks/useApi";
import {
  getTickets,
  patchTicketInCollection,
  updateTicketStatus,
} from "../services/ticketsService";

export default function useTickets(page, search) {
  return useApi({
    placeholderData: keepPreviousData,
    queryKey: ["reports", "tickets", page, search],
    queryFn: () => getTickets({ page, search }),
  });
}

export function useTicketStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ resolvedRemarks, resolvedStatus, status, ticketId }) =>
      updateTicketStatus(ticketId, {
        resolvedRemarks,
        resolvedStatus,
        status,
      }),
    onSuccess: (response, variables) => {
      queryClient.setQueriesData({ queryKey: ["reports", "tickets"] }, (snapshot) =>
        patchTicketInCollection(snapshot, {
          ...response.ticket,
          id: response.ticket?.id ?? variables.ticketId,
          status: variables.status,
          resolved_status:
            response.ticket?.resolved_status ??
            response.ticket?.resloved_status ??
            variables.resolvedStatus,
          resolved_remarks:
            response.ticket?.resolved_remarks ?? variables.resolvedRemarks,
        }),
      );

      toast.success(response.message || "Ticket updated successfully.");
    },
    onError: (error) => {
      toast.error(error.message || "Unable to update the ticket.");
    },
  });
}

