import { APP_ROUTES } from "../../../constants/routes";

const toOrderNumber = (value) => {
  const parsedValue = Number(value);

  return Number.isNaN(parsedValue) ? 0 : parsedValue;
};

export const sortMenuItems = (items = []) =>
  [...items]
    .sort((firstItem, secondItem) => toOrderNumber(firstItem.order) - toOrderNumber(secondItem.order))
    .map((item) => ({
      ...item,
      children: sortMenuItems(item.children),
    }));

export const normalizeMenuResponse = (payload) => {
  const menuData = payload?.data;

  return {
    mainMenuItems: sortMenuItems(menuData?.MAIN_MENU_ITEMS ?? []),
    bottomMenuItems: sortMenuItems(menuData?.BOTTOM_MENU_ITEMS ?? []),
  };
};

export const getSupportedRoute = (path) => {
  if (path === "/admin/account/balance") {
    return APP_ROUTES.accountBalance;
  }

  if (path === "/admin/account/history") {
    return APP_ROUTES.accountHistory;
  }

  if (path === "/admin/avg-booking-value-report") {
    return APP_ROUTES.averageBookingValueReport;
  }

  if (path === "/admin/blog-list") {
    return APP_ROUTES.blogList;
  }

  if (path === "/admin/dashboard") {
    return APP_ROUTES.dashboard;
  }

  if (path === "/admin/customerValueReport") {
    return APP_ROUTES.customerValue;
  }

  if (path === "/admin/bookings/summary") {
    return APP_ROUTES.bookingSummary;
  }

  if (path === "/admin/bookings") {
    return APP_ROUTES.bookings;
  }

  if (path === "/admin/account/daily-balance") {
    return APP_ROUTES.dailyBalance;
  }

  if (path === "/admin/financialReport") {
    return APP_ROUTES.financialReport;
  }

  if (path === "/admin/hotel" || path === "/admin/hotels") {
    return APP_ROUTES.hotel;
  }

  if (path === "/admin/high-cancellation-packages") {
    return APP_ROUTES.highCancellationPackages;
  }

  if (path === "/admin/low-occupancy-report") {
    return APP_ROUTES.lowOccupancyReport;
  }

  if (path === "/admin/low-performing-packages") {
    return APP_ROUTES.lowPerformingPackages;
  }

  if (path === "/admin/monitoring") {
    return APP_ROUTES.monitoring;
  }

  if (path === "/admin/monthRunningBalance") {
    return APP_ROUTES.monthRunningBalance;
  }

  if (path === "/admin/account/overall-sales") {
    return APP_ROUTES.overallSales;
  }

  if (path === "/admin/packages" || path === "/admin/package") {
    return APP_ROUTES.packages;
  }

  if (path === "/admin/routes") {
    return APP_ROUTES.routes;
  }

  if (path === "/admin/tickets") {
    return APP_ROUTES.tickets;
  }

  if (path === "/admin/trips" || path === "/admin/trip") {
    return APP_ROUTES.trips;
  }

  if (path === "/admin/tripPerformance") {
    return APP_ROUTES.tripPerformance;
  }

  if (path === "/admin/transactions") {
    return APP_ROUTES.transactions;
  }

  if (path === "/admin/vehicles" || path === "/admin/vehicle") {
    return APP_ROUTES.vehicles;
  }

  if (path === "/admin/vehicletrackingreport") {
    return APP_ROUTES.vehicleTrackingReport;
  }

  if (path === "/admin/vehiclewiseseatreport") {
    return APP_ROUTES.vehicleWiseSeatReport;
  }

  if (path === "/admin/user-growth-report") {
    return APP_ROUTES.userGrowthReport;
  }

  if (path === "/admin/guide") {
    return APP_ROUTES.guide;
  }

  if (path === "/admin/guideEfficency") {
    return APP_ROUTES.guideEfficiency;
  }

  if (path === "/admin/refund-status-report") {
    return APP_ROUTES.refundStatusReport;
  }

  if (path === "/admin/refund" || path === "/admin/refunds") {
    return APP_ROUTES.refund;
  }

  return null;
};

export const hasChildren = (item) => Array.isArray(item?.children) && item.children.length > 0;

export const normalizeStoredMenuState = (payload) => {
  if (!payload) {
    return {
      mainMenuItems: [],
      bottomMenuItems: [],
    };
  }

  if (Array.isArray(payload)) {
    return {
      mainMenuItems: sortMenuItems(payload),
      bottomMenuItems: [],
    };
  }

  if (Array.isArray(payload.menuItems)) {
    return {
      mainMenuItems: sortMenuItems(payload.menuItems),
      bottomMenuItems: sortMenuItems(payload.bottomMenuItems ?? []),
    };
  }

  if (payload.mainMenuItems || payload.bottomMenuItems) {
    return {
      mainMenuItems: sortMenuItems(payload.mainMenuItems ?? []),
      bottomMenuItems: sortMenuItems(payload.bottomMenuItems ?? []),
    };
  }

  if (payload.data?.MAIN_MENU_ITEMS || payload.data?.BOTTOM_MENU_ITEMS) {
    return {
      mainMenuItems: sortMenuItems(payload.data?.MAIN_MENU_ITEMS ?? []),
      bottomMenuItems: sortMenuItems(payload.data?.BOTTOM_MENU_ITEMS ?? []),
    };
  }

  if (payload.MAIN_MENU_ITEMS || payload.BOTTOM_MENU_ITEMS) {
    return {
      mainMenuItems: sortMenuItems(payload.MAIN_MENU_ITEMS ?? []),
      bottomMenuItems: sortMenuItems(payload.BOTTOM_MENU_ITEMS ?? []),
    };
  }

  return {
    mainMenuItems: [],
    bottomMenuItems: [],
  };
};

export const getNavigableMenuItems = (items = []) => {
  const seenRoutes = new Set();

  const collectItems = (menuItems) =>
    menuItems.flatMap((item) => {
      const supportedRoute = getSupportedRoute(item.path);
      const childItems = hasChildren(item) ? collectItems(item.children) : [];

      if (!supportedRoute || seenRoutes.has(supportedRoute)) {
        return childItems;
      }

      seenRoutes.add(supportedRoute);

      return [
        {
          ...item,
          supportedRoute,
        },
        ...childItems,
      ];
    });

  return collectItems(items);
};

const findMenuItemByMatcher = (items, matcher) => items.find((item) => matcher(item));

export const getBottomNavItems = ({ bottomMenuItems = [], mainMenuItems = [] }) => {
  const dashboardItem =
    findMenuItemByMatcher(mainMenuItems, (item) => item.path === "/admin/dashboard") ?? mainMenuItems[0];

  const packageItem =
    findMenuItemByMatcher(
      mainMenuItems,
      (item) => item.title?.toLowerCase().includes("package")
    ) ?? mainMenuItems[1];

  const bookingItem =
    findMenuItemByMatcher(
      bottomMenuItems,
      (item) => item.path === "/admin/bookings" || item.title?.toLowerCase().includes("booking")
    ) ??
    findMenuItemByMatcher(
      mainMenuItems,
      (item) => item.path === "/admin/bookings" || item.title?.toLowerCase().includes("booking")
    ) ?? {
      id: "mobile-booking-route",
      title: "Booking",
      path: "/admin/bookings",
      icon: "BookingManagementIcon",
    };

  const transactionsItem =
    findMenuItemByMatcher(
      bottomMenuItems,
      (item) => item.title?.toLowerCase().includes("transaction")
    ) ?? bottomMenuItems[0];

  const settingsItem =
    findMenuItemByMatcher(bottomMenuItems, (item) => item.title?.toLowerCase().includes("settings")) ??
    findMenuItemByMatcher(bottomMenuItems, (item) => item.title?.toLowerCase().includes("report")) ??
    bottomMenuItems[1];

  return [dashboardItem, packageItem, bookingItem, transactionsItem, settingsItem].filter(Boolean);
};
