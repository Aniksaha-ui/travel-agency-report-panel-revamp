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
  if (path === "/admin/dashboard") {
    return APP_ROUTES.dashboard;
  }

  return null;
};

export const hasChildren = (item) => Array.isArray(item?.children) && item.children.length > 0;

const findMenuItemByMatcher = (items, matcher) => items.find((item) => matcher(item));

export const getBottomNavItems = ({ bottomMenuItems = [], mainMenuItems = [] }) => {
  const dashboardItem =
    findMenuItemByMatcher(mainMenuItems, (item) => item.path === "/admin/dashboard") ?? mainMenuItems[0];

  const packageItem =
    findMenuItemByMatcher(
      mainMenuItems,
      (item) => item.title?.toLowerCase().includes("package")
    ) ?? mainMenuItems[1];

  const transactionsItem =
    findMenuItemByMatcher(
      bottomMenuItems,
      (item) => item.title?.toLowerCase().includes("transaction")
    ) ?? bottomMenuItems[0];

  const settingsItem =
    findMenuItemByMatcher(bottomMenuItems, (item) => item.title?.toLowerCase().includes("settings")) ??
    findMenuItemByMatcher(bottomMenuItems, (item) => item.title?.toLowerCase().includes("report")) ??
    bottomMenuItems[1];

  return [dashboardItem, packageItem, transactionsItem, settingsItem].filter(Boolean);
};
