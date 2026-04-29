import { API_URLS } from "../../../constants/apiUrls";
import apiClient from "../../../services/apiClient";
import { normalizeMenuResponse } from "../utils/menuHelpers";

export const getAdminMenu = async () => {
  const response = await apiClient.get(API_URLS.admin.menu);

  if (response.data?.isExecute === "SUCCESS" && response.data?.data) {
    return normalizeMenuResponse(response.data);
  }

  throw new Error(response.data?.message || "Unable to load menu items.");
};
