import { API_URLS } from "../../../constants/apiUrls";
import apiClient from "../../../services/apiClient";
import { formatDateTime } from "../../../utils/dateUtils";
import { buildUrlWithQuery } from "../../../utils/urlUtils";
import { BOOKINGS_COPY } from "../constants/bookings.constants";

const toNumber = (value) => Number(value) || 0;
const normalizeString = (value, fallback = "") => String(value ?? "").trim() || fallback;

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(toNumber(value));

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(toNumber(value));

const getStatusTone = (status) => {
  const normalizedStatus = String(status ?? "").trim().toLowerCase();

  if (normalizedStatus === "paid" || normalizedStatus === "confirmed") {
    return "success";
  }

  if (normalizedStatus === "cancelled") {
    return "danger";
  }

  return "warning";
};

const getBookingTypeTone = (value) => {
  const normalizedValue = String(value ?? "").trim().toLowerCase();

  if (normalizedValue.includes("package")) {
    return "info";
  }

  if (normalizedValue.includes("hotel")) {
    return "warning";
  }

  return "success";
};

const normalizeSeats = (value) => {
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  return normalizeString(value, "No seats");
};

const normalizeBooking = (item) => ({
  id: item?.id,
  bookingId: item?.id,
  tripName: normalizeString(item?.trip_name, "N/A"),
  bookingType: normalizeString(item?.booking_type, "N/A"),
  packageName: normalizeString(item?.package_name, "N/A"),
  userName: normalizeString(item?.username, "Unknown user"),
  paymentStatus: normalizeString(item?.status, "pending"),
  paymentStatusLabel: normalizeString(item?.status, "Pending"),
  paymentTone: getStatusTone(item?.status),
  bookingTypeTone: getBookingTypeTone(item?.booking_type),
  seats: normalizeSeats(item?.seat_ids),
  seatCount: normalizeSeats(item?.seat_ids)
    .split(",")
    .map((seat) => seat.trim())
    .filter(Boolean).length,
  createdAt: item?.created_at ?? "",
  createdAtLabel: formatDateTime(item?.created_at, "Not available"),
});

export const normalizeBookings = (payload) => {
  const source = payload?.data ?? {};
  const bookings = (source.data ?? []).map(normalizeBooking);
  const paidBookings = bookings.filter(
    (booking) => booking.paymentStatus.toLowerCase() === "paid",
  );
  const tripBookings = bookings.filter(
    (booking) => booking.bookingType.toLowerCase().includes("trip"),
  );
  const packageBookings = bookings.filter(
    (booking) => booking.bookingType.toLowerCase().includes("package"),
  );
  const latestBooking = bookings[0] ?? null;

  return {
    copy: BOOKINGS_COPY,
    metrics: [
      {
        id: "booking-total",
        label: "Total bookings",
        value: formatNumber(source.total ?? bookings.length),
        change: `Page ${formatNumber(source.current_page ?? 1)} of ${formatNumber(
          source.last_page ?? 1,
        )}`,
        changeTone: "info",
      },
      {
        id: "booking-visible",
        label: "Visible rows",
        value: formatNumber(bookings.length),
        change: `${formatNumber(source.from ?? 0)}-${formatNumber(source.to ?? 0)} loaded`,
        changeTone: "success",
      },
      {
        id: "booking-paid",
        label: "Paid bookings",
        value: formatNumber(paidBookings.length),
        change: `${formatNumber(bookings.length - paidBookings.length)} still pending`,
        changeTone: "warning",
      },
      {
        id: "booking-trip",
        label: "Trip bookings",
        value: formatNumber(tripBookings.length),
        change: `${formatNumber(packageBookings.length)} package bookings`,
        changeTone: "danger",
      },
    ],
    bookings,
    pagination: {
      currentPage: toNumber(source.current_page) || 1,
      lastPage: toNumber(source.last_page) || 1,
      total: toNumber(source.total) || bookings.length,
      from: toNumber(source.from),
      to: toNumber(source.to),
      perPage: toNumber(source.per_page),
      hasPrev: Boolean(source.prev_page_url),
      hasNext: Boolean(source.next_page_url),
    },
    summary: {
      totalBookingsLabel: formatNumber(source.total ?? bookings.length),
      visibleBookingsLabel: formatNumber(bookings.length),
      paidBookingsLabel: formatNumber(paidBookings.length),
      tripBookingsLabel: formatNumber(tripBookings.length),
      packageBookingsLabel: formatNumber(packageBookings.length),
      latestBooking,
    },
  };
};

export const normalizeBookingInvoice = (payload) => {
  const source = payload?.data?.[0] ?? payload?.data ?? {};

  return {
    bookingId: source.booking_id ?? source.id ?? "",
    userName: normalizeString(source.user_name, "Unknown passenger"),
    userEmail: normalizeString(source.user_email, "No email"),
    bookingStatus: normalizeString(source.booking_status, "unknown"),
    bookingStatusTone: getStatusTone(source.booking_status),
    tripName: normalizeString(source.trip_name),
    tripId: normalizeString(source.trip_id),
    departureTimeLabel: formatDateTime(source.departure_time, "N/A"),
    arrivalTimeLabel: formatDateTime(source.arrival_time, "N/A"),
    bookingType: normalizeString(source.booking_type, "N/A"),
    packageName: normalizeString(source.package_name),
    hotelName: normalizeString(source.hotel_name),
    hotelCity: normalizeString(source.hotel_city),
    hotelCountry: normalizeString(source.hotel_country),
    seatNumbers: normalizeString(
      source.seat_numbers,
      "Since the booking is cancelled, no seat number is available",
    ),
    priceLabel: formatCurrency(source.price),
    totalPaymentAmountLabel: formatCurrency(source.total_payment_amount),
    paymentMethod: normalizeString(source.payment_method, "N/A"),
    bkash: normalizeString(source.bkash),
    nagad: normalizeString(source.nagad),
    card: normalizeString(source.card),
    transactionReference: normalizeString(source.transaction_reference, "N/A"),
  };
};

export const getBookings = async ({ page = 1, search = "" } = {}) => {
  try {
    const response = await apiClient.request({
      method: "get",
      url: buildUrlWithQuery(API_URLS.reports.bookings, { page, search: search || undefined }),
    });

    if (response.data) {
      return normalizeBookings(response.data);
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

  throw new Error("Unable to load booking information right now.");
};

export const getBookingInvoice = async (bookingId) => {
  try {
    const response = await apiClient.post(API_URLS.reports.bookingInvoice, {
      bookingId,
    });

    if (response.data) {
      return normalizeBookingInvoice(response.data);
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

  throw new Error("Unable to load booking invoice right now.");
};
