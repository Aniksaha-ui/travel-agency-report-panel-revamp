import { API_URLS } from "../../../constants/apiUrls";
import apiClient from "../../../services/apiClient";
import {
  CUSTOMER_VALUE_COPY,
  CUSTOMER_VALUE_FALLBACK_RESPONSE,
} from "../constants/customerValue.constants";

const toNumber = (value) => Number(value) || 0;

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(toNumber(value));

const formatCurrency = (value) => `BDT ${formatNumber(value)}`;
const normalizeSearch = (value) => String(value ?? "").trim().toLowerCase();
const shortenLabel = (value, maxLength = 14) =>
  String(value ?? "").length > maxLength ? `${String(value).slice(0, maxLength - 1)}...` : String(value ?? "");

const getCustomerTier = ({ netSpent, totalBookings }) => {
  if (netSpent >= 1000000) {
    return { label: "VIP", tone: "success" };
  }

  if (totalBookings >= 6) {
    return { label: "Loyal", tone: "info" };
  }

  if (totalBookings >= 3) {
    return { label: "Active", tone: "warning" };
  }

  return { label: "Emerging", tone: "neutral" };
};

export const normalizeCustomerValue = (payload) => {
  const source = payload?.data ?? {};
  const customers = (source.data ?? []).map((item) => {
    const tripBookings = toNumber(item.total_trip_bookings);
    const packageBookings = toNumber(item.total_package_bookings);
    const totalBookings = tripBookings + packageBookings;
    const totalPaid = toNumber(item.total_paid);
    const totalRefunded = toNumber(item.total_refunded);
    const netSpent = toNumber(item.net_spent);
    const averageBookingValue = totalBookings ? netSpent / totalBookings : netSpent;
    const refundRate = totalPaid ? Math.round((totalRefunded / totalPaid) * 100) : 0;
    const customerTier = getCustomerTier({ netSpent, totalBookings });

    return {
      id: item.user_id,
      userId: item.user_id,
      customerName: item.name || "Unnamed customer",
      tripBookings,
      packageBookings,
      totalBookings,
      totalPaid,
      totalRefunded,
      netSpent,
      averageBookingValue,
      refundRate,
      tripBookingsLabel: formatNumber(tripBookings),
      packageBookingsLabel: formatNumber(packageBookings),
      totalBookingsLabel: formatNumber(totalBookings),
      totalPaidLabel: formatCurrency(totalPaid),
      totalRefundedLabel: formatCurrency(totalRefunded),
      netSpentLabel: formatCurrency(netSpent),
      averageBookingValueLabel: formatCurrency(averageBookingValue),
      refundRateLabel: `${refundRate}% refunded`,
      customerTierLabel: customerTier.label,
      customerTierTone: customerTier.tone,
    };
  });

  const visibleNetSpent = customers.reduce((sum, customer) => sum + customer.netSpent, 0);
  const visibleTotalPaid = customers.reduce((sum, customer) => sum + customer.totalPaid, 0);
  const visibleRefunded = customers.reduce((sum, customer) => sum + customer.totalRefunded, 0);
  const visibleBookings = customers.reduce((sum, customer) => sum + customer.totalBookings, 0);
  const averageCustomerValue = customers.length ? visibleNetSpent / customers.length : 0;

  const rankedCustomers = customers.map((customer) => {
    const spendShare = visibleNetSpent ? Math.round((customer.netSpent / visibleNetSpent) * 100) : 0;

    return {
      ...customer,
      spendShare,
      spendShareLabel: `${spendShare}% of visible net spend`,
    };
  });

  const topCustomer =
    [...rankedCustomers].sort((first, second) => second.netSpent - first.netSpent)[0] ?? null;
  const topBookingCustomer =
    [...rankedCustomers].sort((first, second) => second.totalBookings - first.totalBookings)[0] ?? null;
  const refundCustomers = rankedCustomers.filter((customer) => customer.totalRefunded > 0).length;
  const trendCustomers = [...rankedCustomers].slice(0, 6).reverse();
  const spendLeaders = [...rankedCustomers].sort((first, second) => second.netSpent - first.netSpent).slice(0, 5);
  const bookingLeaders = [...rankedCustomers]
    .sort((first, second) => second.totalBookings - first.totalBookings)
    .slice(0, 5);

  return {
    copy: CUSTOMER_VALUE_COPY,
    metrics: [
      {
        id: "total-customers",
        label: "Total customers",
        value: formatNumber(source.total),
        change: `Page ${formatNumber(source.current_page)} of ${formatNumber(source.last_page)}`,
        changeTone: "info",
      },
      {
        id: "visible-net-spend",
        label: "Visible net spend",
        value: formatCurrency(visibleNetSpent),
        change: `${formatNumber(source.from)}-${formatNumber(source.to)} customers loaded`,
        changeTone: "success",
      },
      {
        id: "booking-volume",
        label: "Booking volume",
        value: formatNumber(visibleBookings),
        change: `${formatCurrency(averageCustomerValue)} avg customer value`,
        changeTone: "warning",
      },
      {
        id: "refund-exposure",
        label: "Refund exposure",
        value: formatCurrency(visibleRefunded),
        change: `${formatNumber(refundCustomers)} customer${refundCustomers === 1 ? "" : "s"} refunded`,
        changeTone: "danger",
      },
    ],
    customers: rankedCustomers,
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
    summary: {
      visibleNetSpent,
      visibleNetSpentLabel: formatCurrency(visibleNetSpent),
      visibleTotalPaid,
      visibleTotalPaidLabel: formatCurrency(visibleTotalPaid),
      visibleRefunded,
      visibleRefundedLabel: formatCurrency(visibleRefunded),
      visibleBookings,
      visibleBookingsLabel: formatNumber(visibleBookings),
      averageCustomerValue,
      averageCustomerValueLabel: formatCurrency(averageCustomerValue),
      totalCustomersLabel: formatNumber(source.total),
      refundCustomersLabel: formatNumber(refundCustomers),
      topCustomer,
      topBookingCustomer,
    },
    charts: {
      spendTrend: trendCustomers.map((customer) => ({
        id: customer.id,
        label: shortenLabel(customer.customerName, 12),
        paid: customer.totalPaid,
        netSpent: customer.netSpent,
      })),
      spendRanking: spendLeaders.map((customer) => ({
        id: customer.id,
        label: shortenLabel(customer.customerName, 20),
        value: customer.netSpent,
      })),
      bookingRanking: bookingLeaders.map((customer) => ({
        id: customer.id,
        label: shortenLabel(customer.customerName, 20),
        value: customer.totalBookings,
      })),
    },
  };
};

const filterFallbackCustomers = (payload, search) => {
  const normalizedSearch = normalizeSearch(search);

  if (!normalizedSearch) {
    return payload;
  }

  const filteredCustomers = (payload?.data?.data ?? []).filter((item) =>
    String(item.name ?? "").toLowerCase().includes(normalizedSearch)
  );

  return {
    ...payload,
    data: {
      ...payload.data,
      data: filteredCustomers,
      total: filteredCustomers.length,
      from: filteredCustomers.length ? 1 : 0,
      to: filteredCustomers.length,
      current_page: 1,
      last_page: 1,
      next_page_url: null,
      prev_page_url: null,
    },
  };
};

export const getCustomerValue = async ({ page = 1, search = "" } = {}) => {
  try {
    const response = await apiClient.get(API_URLS.reports.customerValue, {
      params: {
        page,
        ...(search ? { search } : {}),
      },
    });

    if (response.data) {
      return normalizeCustomerValue(response.data);
    }
  } catch {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 300);
    });
  }

  return normalizeCustomerValue(filterFallbackCustomers(CUSTOMER_VALUE_FALLBACK_RESPONSE, search));
};
