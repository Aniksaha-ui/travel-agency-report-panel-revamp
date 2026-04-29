import { API_URLS } from "../../../constants/apiUrls";
import apiClient from "../../../services/apiClient";
import {
  DASHBOARD_COPY,
  DASHBOARD_METRICS,
  RECENT_BOOKINGS,
} from "../constants/dashboard.constants";

const fallbackDashboardOverview = {
  copy: DASHBOARD_COPY,
  metrics: DASHBOARD_METRICS,
  recentBookings: RECENT_BOOKINGS,
};

export const getDashboardOverview = async () => {
  try {
    const response = await apiClient.get(API_URLS.dashboard.overview);

    if (response.data) {
      return {
        ...fallbackDashboardOverview,
        ...response.data,
      };
    }
  } catch {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 300);
    });
  }

  return fallbackDashboardOverview;
};
