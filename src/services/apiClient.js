import axios from "axios";
import { APP_CONFIG } from "./config";

const apiClient = axios.create({
  baseURL: APP_CONFIG.apiBaseUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const rawSession = window.localStorage.getItem(APP_CONFIG.authStorageKey);

  if (rawSession) {
    const session = JSON.parse(rawSession);

    if (session?.token) {
      config.headers.Authorization = `Bearer ${session.token}`;
    }
  }

  return config;
});

export default apiClient;
