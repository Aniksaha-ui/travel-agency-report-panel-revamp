import { API_URLS } from "../../../constants/apiUrls";
import { APP_CONFIG } from "../../../services/config";
import apiClient from "../../../services/apiClient";
import {
  formatDateTime,
  formatShortDate,
  toDateKey,
  toDayjs,
} from "../../../utils/dateUtils";
import {
  TICKET_MAIN_STATUS,
  TICKET_RESOLVE_STATUS,
  TICKETS_COPY,
} from "../constants/tickets.constants";

const toNumber = (value) => {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(
    toNumber(value),
  );

const shortenText = (value, maxLength = 120) => {
  const normalizedValue = String(value ?? "").trim();

  if (!normalizedValue) {
    return "No description shared yet.";
  }

  return normalizedValue.length > maxLength
    ? `${normalizedValue.slice(0, maxLength - 1)}...`
    : normalizedValue;
};

const normalizePersonName = (value, fallback = "Unknown user") => {
  const normalizedValue = String(value ?? "").trim();

  return normalizedValue || fallback;
};

const toSentenceCase = (value) => {
  const normalizedValue = String(value ?? "").trim();

  return normalizedValue
    ? `${normalizedValue.charAt(0).toUpperCase()}${normalizedValue.slice(1)}`
    : "Unknown";
};

const resolveResolvedStatus = (item) => {
  const candidates = [
    item?.resolved_status,
    item?.resloved_status,
    item?.resolvedStatus,
  ];

  const matchedValue = candidates.find((value) => Number.isFinite(Number(value)));

  return toNumber(matchedValue);
};

const buildAttachmentUrl = (value) => {
  const normalizedValue = String(value ?? "").trim();

  if (!normalizedValue) {
    return "";
  }

  if (/^https?:\/\//i.test(normalizedValue)) {
    return normalizedValue;
  }

  return `${APP_CONFIG.imageBaseUrl}${normalizedValue}`;
};

const getWorkflowPresentation = (status, resolvedStatus) => {
  if (status === 2 && resolvedStatus === 2) {
    return {
      key: "declined",
      label: "Declined",
      description: "Closed without moving forward",
      tone: "danger",
      lane: "closed",
      laneIndex: 2,
    };
  }

  if (status === 2) {
    return {
      key: "resolved",
      label: "Resolved",
      description: "Closed after active follow-through",
      tone: "success",
      lane: "closed",
      laneIndex: 2,
    };
  }

  if (status === 1 && resolvedStatus === 1) {
    return {
      key: "processing",
      label: "In progress",
      description: "Accepted and currently being handled",
      tone: "info",
      lane: "processing",
      laneIndex: 1,
    };
  }

  return {
    key: "pending",
    label: "Pending review",
    description: "Waiting for the first triage decision",
    tone: "warning",
    lane: "pending",
    laneIndex: 0,
  };
};

const getAvailableTransitions = (status, resolvedStatus) => {
  if (status === 0 && resolvedStatus === 0) {
    return [
      {
        key: "start-progress",
        label: "Approve",
        helperText: "Accept this ticket and move it into active processing.",
        tone: "info",
        status: 1,
        resolvedStatus: 1,
        buttonLabel: "Approve",
        placeholder: "Optional approval note for the team",
      },
      {
        key: "decline-ticket",
        label: "Decline ticket",
        helperText: "Close this request without proceeding further.",
        tone: "danger",
        status: 2,
        resolvedStatus: 2,
        buttonLabel: "Decline",
        placeholder: "Optional decline reason for future reference",
      },
    ];
  }

  if (status === 1 && resolvedStatus === 1) {
    return [
      {
        key: "resolve-ticket",
        label: "Mark as resolved",
        helperText: "Close the ticket after work is complete and capture the final resolution note.",
        tone: "success",
        status: 2,
        resolvedStatus: 1,
        requiresRemarks: true,
        buttonLabel: "Mark as resolved",
        placeholder: "Add the resolution summary shared with the customer",
      },
    ];
  }

  return [];
};

const normalizeTicket = (item) => {
  const status = toNumber(item?.status);
  const resolvedStatus = resolveResolvedStatus(item);
  const workflow = getWorkflowPresentation(status, resolvedStatus);
  const createdAt = item?.created_at ?? item?.createdAt ?? "";
  const updatedAt = item?.updated_at ?? item?.updatedAt ?? createdAt;
  const attachmentPath = String(item?.attachment ?? item?.attachmentPath ?? "").trim();

  return {
    id: item?.id ?? item?.ticketId ?? item?.ticket_id,
    ticketId: item?.id ?? item?.ticketId ?? item?.ticket_id,
    title: String(item?.title ?? "").trim() || "Untitled ticket",
    remarks: String(item?.remarks ?? "").trim() || "No quick remarks",
    description:
      String(item?.description ?? "").trim() || "No detailed description shared yet.",
    descriptionPreview: shortenText(item?.description ?? item?.remarks, 92),
    status,
    statusLabel: TICKET_MAIN_STATUS[status] ?? "unknown",
    statusDisplayLabel: toSentenceCase(TICKET_MAIN_STATUS[status] ?? "unknown"),
    resolvedStatus,
    resolvedStatusLabel: TICKET_RESOLVE_STATUS[resolvedStatus] ?? "Unknown",
    workflowKey: workflow.key,
    workflowLabel: workflow.label,
    workflowDescription: workflow.description,
    workflowTone: workflow.tone,
    workflowLane: workflow.lane,
    workflowLaneIndex: workflow.laneIndex,
    creatorName: normalizePersonName(
      item?.generate_by_name ?? item?.creatorName,
      "Unknown reporter",
    ),
    customerName: normalizePersonName(
      item?.generate_by_name ?? item?.customerName,
      "Unknown customer",
    ),
    resolvedByName: normalizePersonName(
      item?.resolved_user_name ?? item?.resolvedByName,
      "Unassigned",
    ),
    resolvedRemarks:
      String(item?.resolved_remarks ?? item?.resolvedRemarks ?? "").trim(),
    createdAt,
    createdAtLabel: formatDateTime(createdAt, "Not available"),
    createdShortLabel: formatShortDate(createdAt, "N/A"),
    updatedAt,
    updatedAtLabel: formatDateTime(updatedAt, "Not available"),
    updatedShortLabel: formatShortDate(updatedAt, "N/A"),
    attachmentPath,
    attachmentUrl: buildAttachmentUrl(attachmentPath),
    hasAttachment: Boolean(attachmentPath),
    availableTransitions: getAvailableTransitions(status, resolvedStatus),
  };
};

const buildDailyIntake = (tickets) => {
  const grouped = tickets.reduce((accumulator, ticket) => {
    const dateKey = toDateKey(ticket.createdAt);

    if (!dateKey) {
      return accumulator;
    }

    const existingItem = accumulator.get(dateKey) ?? {
      id: dateKey,
      label: ticket.createdShortLabel,
      tickets: 0,
    };

    existingItem.tickets += 1;
    accumulator.set(dateKey, existingItem);

    return accumulator;
  }, new Map());

  return [...grouped.values()].sort((first, second) => {
    const firstValue = toDayjs(first.id)?.valueOf() ?? 0;
    const secondValue = toDayjs(second.id)?.valueOf() ?? 0;

    return firstValue - secondValue;
  });
};

const buildCreatorRanking = (tickets) => {
  const grouped = tickets.reduce((accumulator, ticket) => {
    const key = ticket.creatorName;
    const existingItem = accumulator.get(key) ?? {
      id: key,
      label: key,
      value: 0,
    };

    existingItem.value += 1;
    accumulator.set(key, existingItem);

    return accumulator;
  }, new Map());

  return [...grouped.values()]
    .sort((first, second) => second.value - first.value)
    .slice(0, 6);
};

const buildTicketsModel = ({ pagination, tickets }) => {
  const visibleTickets = tickets ?? [];
  const pendingTickets = visibleTickets.filter((ticket) => ticket.workflowKey === "pending");
  const processingTickets = visibleTickets.filter(
    (ticket) => ticket.workflowKey === "processing",
  );
  const resolvedTickets = visibleTickets.filter((ticket) => ticket.workflowKey === "resolved");
  const declinedTickets = visibleTickets.filter((ticket) => ticket.workflowKey === "declined");
  const closedTickets = [...resolvedTickets, ...declinedTickets];
  const openTickets = [...pendingTickets, ...processingTickets];
  const oldestPendingTicket =
    [...pendingTickets].sort((first, second) => {
      const firstValue = toDayjs(first.createdAt)?.valueOf() ?? 0;
      const secondValue = toDayjs(second.createdAt)?.valueOf() ?? 0;

      return firstValue - secondValue;
    })[0] ?? null;
  const latestActivity =
    [...visibleTickets].sort((first, second) => {
      const firstValue = toDayjs(first.updatedAt)?.valueOf() ?? 0;
      const secondValue = toDayjs(second.updatedAt)?.valueOf() ?? 0;

      return secondValue - firstValue;
    })[0] ?? null;
  const creatorRanking = buildCreatorRanking(visibleTickets);
  const leadReporter = creatorRanking[0] ?? null;
  const visibleTotal = visibleTickets.length;
  const resolutionRate = visibleTotal
    ? Math.round((closedTickets.length / visibleTotal) * 100)
    : 0;

  return {
    copy: TICKETS_COPY,
    metrics: [
      {
        id: "tickets-total",
        label: "Total tickets",
        value: formatNumber(pagination.total),
        change: `Page ${formatNumber(pagination.currentPage)} of ${formatNumber(
          pagination.lastPage,
        )}`,
        changeTone: "info",
      },
      {
        id: "tickets-open",
        label: "Open queue",
        value: formatNumber(openTickets.length),
        change: `${formatNumber(pendingTickets.length)} pending • ${formatNumber(
          processingTickets.length,
        )} active`,
        changeTone: "warning",
      },
      {
        id: "tickets-closed",
        label: "Closed on page",
        value: formatNumber(closedTickets.length),
        change: `${formatNumber(resolvedTickets.length)} resolved • ${formatNumber(
          declinedTickets.length,
        )} declined`,
        changeTone: "success",
      },
      {
        id: "tickets-resolution-rate",
        label: "Resolution rate",
        value: `${resolutionRate}%`,
        change: `${formatNumber(visibleTotal)} visible tickets`,
        changeTone: "danger",
      },
    ],
    tickets: visibleTickets,
    pagination,
    summary: {
      visibleTotalLabel: formatNumber(visibleTotal),
      openTicketsLabel: formatNumber(openTickets.length),
      pendingTicketsLabel: formatNumber(pendingTickets.length),
      processingTicketsLabel: formatNumber(processingTickets.length),
      resolvedTicketsLabel: formatNumber(resolvedTickets.length),
      declinedTicketsLabel: formatNumber(declinedTickets.length),
      resolutionRateLabel: `${resolutionRate}%`,
      oldestPendingTicket,
      latestActivity,
      leadReporter,
    },
    charts: {
      statusMix: [
        {
          id: "pending",
          label: "Pending",
          value: pendingTickets.length,
          color: "#f59e0b",
        },
        {
          id: "processing",
          label: "In progress",
          value: processingTickets.length,
          color: "#38bdf8",
        },
        {
          id: "resolved",
          label: "Resolved",
          value: resolvedTickets.length,
          color: "#22c55e",
        },
        {
          id: "declined",
          label: "Declined",
          value: declinedTickets.length,
          color: "#ef4444",
        },
      ].filter((item) => item.value > 0),
      creatorRanking,
      intakeTrend: buildDailyIntake(visibleTickets),
    },
  };
};

export const normalizeTickets = (payload) => {
  const source = payload?.data ?? {};
  const tickets = (source.data ?? []).map(normalizeTicket);

  return buildTicketsModel({
    tickets,
    pagination: {
      currentPage: toNumber(source.current_page) || 1,
      lastPage: toNumber(source.last_page) || 1,
      total: toNumber(source.total),
      from: toNumber(source.from),
      to: toNumber(source.to),
      perPage: toNumber(source.per_page),
      hasPrev: Boolean(source.prev_page_url),
      hasNext: Boolean(source.next_page_url),
    },
  });
};

export const patchTicketInCollection = (snapshot, patch) => {
  if (!snapshot?.tickets?.length) {
    return snapshot;
  }

  const patchId = String(patch?.id ?? patch?.ticketId ?? "");

  if (!patchId) {
    return snapshot;
  }

  const nextTickets = snapshot.tickets.map((ticket) => {
    if (String(ticket.id) !== patchId) {
      return ticket;
    }

    return normalizeTicket({
      ...ticket,
      ...patch,
      resolved_status: patch.resolved_status ?? patch.resolvedStatus ?? ticket.resolvedStatus,
      resolved_remarks:
        patch.resolved_remarks ?? patch.resolvedRemarks ?? ticket.resolvedRemarks,
      updated_at: patch.updated_at ?? patch.updatedAt ?? new Date().toISOString(),
    });
  });

  return buildTicketsModel({
    tickets: nextTickets,
    pagination: snapshot.pagination,
  });
};

export const getTickets = async ({ page = 1, search = "" } = {}) => {
  try {
    const response = await apiClient.get(API_URLS.reports.tickets, {
      params: {
        page,
        ...(search ? { search } : {}),
      },
    });

    if (response.data?.data) {
      return normalizeTickets(response.data);
    }
  } catch (error) {
    const serverMessage =
      error.response?.data?.message ?? error.response?.data?.data?.message;

    if (serverMessage) {
      throw new Error(serverMessage);
    }

    if (error instanceof Error) {
      throw error;
    }
  }

  throw new Error("Unable to load ticket data right now.");
};

export const updateTicketStatus = async (
  ticketId,
  { resolvedRemarks = "", resolvedStatus, status },
) => {
  try {
    const response = await apiClient.post(API_URLS.reports.ticketUpdate(ticketId), {
      status,
      resolved_status: resolvedStatus,
      resolved_remarks: resolvedRemarks || null,
    });

    const payload = response.data?.data ?? {};
    const payloadMessage = payload?.message ?? response.data?.message;
    const payloadStatus = payload?.status ?? response.data?.status;

    if (
      payloadStatus === true ||
      response.status === 200 ||
      response.status === 201
    ) {
      return {
        message: payloadMessage || "Ticket updated successfully.",
        ticket:
          payload?.ticket ??
          payload?.data ??
          response.data?.ticket ??
          null,
      };
    }
  } catch (error) {
    const serverMessage =
      error.response?.data?.message ?? error.response?.data?.data?.message;

    if (serverMessage) {
      throw new Error(serverMessage);
    }

    if (error instanceof Error) {
      throw error;
    }
  }

  throw new Error("Unable to update this ticket right now.");
};
