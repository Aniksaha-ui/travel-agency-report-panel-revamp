import { API_URLS } from "../../../constants/apiUrls";
import apiClient from "../../../services/apiClient";
import { normalizeMenuResponse } from "../utils/menuHelpers";

const isMenuResponseSuccessful = (payload) => {
  const executionStatus = payload?.isExecute ?? payload?.isExecture;

  if (typeof executionStatus === "boolean") {
    return executionStatus;
  }

  return String(executionStatus ?? "").trim().toLowerCase() === "success";
};

export const getAdminMenu = async () => {
  const response = await apiClient.get(API_URLS.admin.menu);

  if (isMenuResponseSuccessful(response.data) && response.data?.data) {
    return normalizeMenuResponse(response.data);
  }

  throw new Error(response.data?.message || "Unable to load menu items.");
};
