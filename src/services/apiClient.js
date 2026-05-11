import axios from "axios";
import { APP_CONFIG } from "./config";

export const AUTH_SESSION_TIMEOUT_EVENT = "travel-agency-auth-session-timeout";
export const AUTH_SESSION_TIMEOUT_MESSAGE = "Session is timeout. Please login again.";

let hasDispatchedSessionTimeout = false;

export const resetSessionTimeoutState = () => {
  hasDispatchedSessionTimeout = false;
};

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

  if (!rawSession) {
    return config;
  }

  try {
    const session = JSON.parse(rawSession);

    if (session?.token) {
      config.headers.Authorization = `Bearer ${session.token}`;
    }
  } catch {
    window.localStorage.removeItem(APP_CONFIG.authStorageKey);
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url ?? "";
    const isLoginRequest = requestUrl.endsWith("/login");
    const hasSession = Boolean(window.localStorage.getItem(APP_CONFIG.authStorageKey));

    if (error.response?.status === 401 && hasSession && !isLoginRequest && !hasDispatchedSessionTimeout) {
      hasDispatchedSessionTimeout = true;
      window.dispatchEvent(
        new CustomEvent(AUTH_SESSION_TIMEOUT_EVENT, {
          detail: {
            message: AUTH_SESSION_TIMEOUT_MESSAGE,
          },
        })
      );
    }

    return Promise.reject(error);
  }
);

export default apiClient;
