import { API_URLS } from "../../../constants/apiUrls";
import apiClient from "../../../services/apiClient";

const resolveAuthPayload = (payload) => {
  if (payload?.access_token && payload?.user) {
    return {
      token: payload.access_token,
      tokenType: payload.token_type ?? "Bearer",
      expiresIn: payload.expires_in ?? null,
      user: payload.user,
    };
  }

  if (payload?.data?.token && payload?.data?.user) {
    return payload.data;
  }

  if (payload?.token && payload?.user) {
    return payload;
  }

  return null;
};

export const login = async (credentials) => {
  try {
    const response = await apiClient.post(API_URLS.auth.login, {
      email: credentials.email,
      password: credentials.password,
    });
    const payload = resolveAuthPayload(response.data);

    if (payload) {
      return payload;
    }
    throw new Error("Login response was missing token or user data.");
  } catch (error) {
    const serverMessage = error.response?.data?.message;

    if (serverMessage) {
      throw new Error(serverMessage);
    }

    if (error.request) {
      throw new Error("Unable to reach the login service. Please try again.");
    }

    if (error instanceof Error) {
      throw error;
    }
  }

  throw new Error("Unable to sign in right now. Please try again.");
};
