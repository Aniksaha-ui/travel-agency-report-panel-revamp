import { API_URLS } from "../../../constants/apiUrls";
import apiClient from "../../../services/apiClient";
import { formatDateTime, formatTravelDate, toDateKey, toDayjs } from "../../../utils/dateUtils";
import { REFUND_DISBURSED_STATUS, REFUNDS_COPY } from "../constants/refunds.constants";

const toNumber = (value) => {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(toNumber(value));

const formatCurrency = (value) => `BDT ${formatNumber(value)}`;

const normalizeStatus = (value) => {
  const normalizedValue = String(value ?? "").trim().toLowerCase();

  return normalizedValue || "pending";
};

const getStatusTone = (status) => {
  if (status === "disbursed") {
    return "success";
  }

  return "warning";
};

const parseSeatCount = (seatIds) => {
  if (Array.isArray(seatIds)) {
    return seatIds.length;
  }

  const normalizedValue = String(seatIds ?? "").trim();

  if (!normalizedValue) {
    return 0;
  }

  return normalizedValue
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean).length;
};

const normalizeSeatLabel = (seatIds) => {
  if (Array.isArray(seatIds)) {
    return seatIds.join(", ");
  }

  return String(seatIds ?? "").trim() || "No seats";
};

const normalizeRefund = (item) => {
  const statusKey = normalizeStatus(item?.status);
  const bookingDate = item?.booking_date ?? item?.bookingDate ?? "";
  const updatedAt = item?.updated_at ?? item?.updatedAt ?? bookingDate;
  const seatCount = parseSeatCount(item?.seat_ids);
  const amount = toNumber(item?.refund_amount ?? item?.amount ?? item?.total_amount);

  return {
    id: item?.id ?? item?.refund_id,
    refundId: item?.id ?? item?.refund_id,
    bookingDate,
    bookingDateLabel: formatTravelDate(bookingDate, "Not available"),
    bookingDateTimeLabel: formatDateTime(bookingDate, "Not available"),
    updatedAt,
    updatedAtLabel: formatDateTime(updatedAt, "Not available"),
    tripName: String(item?.trip_name ?? item?.tripName ?? "").trim() || "Unknown trip",
    seatIds: normalizeSeatLabel(item?.seat_ids),
    seatCount,
    seatCountLabel: formatNumber(seatCount),
    reason: String(item?.reason ?? "").trim() || "No reason shared",
    statusKey,
    statusLabel: REFUND_DISBURSED_STATUS[statusKey] ?? "Pending",
    tone: getStatusTone(statusKey),
    isPending: statusKey === "pending",
    amount,
    amountLabel: formatCurrency(amount),
  };
};

const buildTrend = (refunds) => {
  const grouped = refunds.reduce((accumulator, refund) => {
    const dateKey = toDateKey(refund.bookingDate);

    if (!dateKey) {
      return accumulator;
    }

    const existingItem = accumulator.get(dateKey) ?? {
      id: dateKey,
      label: refund.bookingDateLabel,
      refunds: 0,
    };

    existingItem.refunds += 1;
    accumulator.set(dateKey, existingItem);

    return accumulator;
  }, new Map());

  return [...grouped.values()].sort((first, second) => {
    const firstValue = toDayjs(first.id)?.valueOf() ?? 0;
    const secondValue = toDayjs(second.id)?.valueOf() ?? 0;

    return firstValue - secondValue;
  });
};

const buildRefundModel = ({ pagination, refunds }) => {
  const visibleRefunds = refunds ?? [];
  const pendingRefunds = visibleRefunds.filter((refund) => refund.isPending);
  const disbursedRefunds = visibleRefunds.filter((refund) => !refund.isPending);
  const totalVisibleAmount = visibleRefunds.reduce((sum, refund) => sum + refund.amount, 0);
  const pendingAmount = pendingRefunds.reduce((sum, refund) => sum + refund.amount, 0);
  const disbursedAmount = disbursedRefunds.reduce((sum, refund) => sum + refund.amount, 0);
  const totalSeats = visibleRefunds.reduce((sum, refund) => sum + refund.seatCount, 0);
  const nextPendingRefund =
    [...pendingRefunds].sort((first, second) => {
      const firstValue = toDayjs(first.bookingDate)?.valueOf() ?? 0;
      const secondValue = toDayjs(second.bookingDate)?.valueOf() ?? 0;

      return firstValue - secondValue;
    })[0] ?? null;
  const latestDisbursedRefund =
    [...disbursedRefunds].sort((first, second) => {
      const firstValue = toDayjs(first.updatedAt)?.valueOf() ?? 0;
      const secondValue = toDayjs(second.updatedAt)?.valueOf() ?? 0;

      return secondValue - firstValue;
    })[0] ?? null;

  return {
    copy: REFUNDS_COPY,
    metrics: [
      {
        id: "refund-total",
        label: "Refunds loaded",
        value: formatNumber(pagination.total),
        change: `Page ${formatNumber(pagination.currentPage)} of ${formatNumber(pagination.lastPage)}`,
        changeTone: "info",
      },
      {
        id: "refund-pending",
        label: "Pending disbursement",
        value: formatNumber(pendingRefunds.length),
        change: `${formatCurrency(pendingAmount)} waiting`,
        changeTone: "warning",
      },
      {
        id: "refund-disbursed",
        label: "Disbursed on page",
        value: formatNumber(disbursedRefunds.length),
        change: `${formatCurrency(disbursedAmount)} completed`,
        changeTone: "success",
      },
      {
        id: "refund-seats",
        label: "Refunded seats",
        value: formatNumber(totalSeats),
        change: `${formatCurrency(totalVisibleAmount)} visible value`,
        changeTone: "danger",
      },
    ],
    refunds: visibleRefunds,
    pagination,
    summary: {
      totalVisibleAmountLabel: formatCurrency(totalVisibleAmount),
      pendingCountLabel: formatNumber(pendingRefunds.length),
      pendingAmountLabel: formatCurrency(pendingAmount),
      disbursedCountLabel: formatNumber(disbursedRefunds.length),
      disbursedAmountLabel: formatCurrency(disbursedAmount),
      refundedSeatsLabel: formatNumber(totalSeats),
      nextPendingRefund,
      latestDisbursedRefund,
    },
    charts: {
      statusMix: [
        {
          id: "pending",
          label: "Pending",
          value: pendingRefunds.length,
          color: "#f59e0b",
        },
        {
          id: "disbursed",
          label: "Disbursed",
          value: disbursedRefunds.length,
          color: "#22c55e",
        },
      ].filter((item) => item.value > 0),
      bookingTrend: buildTrend(visibleRefunds).map((item) => ({
        ...item,
        bookings: item.refunds,
      })),
    },
  };
};

export const normalizeRefunds = (payload) => {
  const source = payload?.data ?? payload ?? {};
  const refunds = (source.data ?? []).map(normalizeRefund);

  return buildRefundModel({
    refunds,
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

export const patchRefundInCollection = (snapshot, refundId) => {
  if (!snapshot?.refunds?.length) {
    return snapshot;
  }

  const nextRefunds = snapshot.refunds.map((refund) =>
    String(refund.id) === String(refundId)
      ? normalizeRefund({
          ...refund,
          status: "disbursed",
          updated_at: new Date().toISOString(),
        })
      : refund,
  );

  return buildRefundModel({
    refunds: nextRefunds,
    pagination: snapshot.pagination,
  });
};

export const getRefunds = async ({ page = 1, search = "" } = {}) => {
  try {
    const response = await apiClient.get(API_URLS.reports.refunds, {
      params: {
        page,
        ...(search ? { search } : {}),
      },
    });

    if (response.data) {
      return normalizeRefunds(response.data);
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

  throw new Error("Unable to load refund data right now.");
};

export const disburseRefund = async (refundId) => {
  try {
    const response = await apiClient.post(API_URLS.reports.refundDisburse, {
      refund_id: refundId,
    });

    if (response.data) {
      return {
        message:
          response.data.message ??
          response.data.data?.message ??
          "Refund disbursed successfully.",
        status:
          response.data.status ??
          response.data.data?.status ??
          true,
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

  throw new Error("Unable to disburse this refund right now.");
};
