import { createSlice } from "@reduxjs/toolkit";
import { APP_CONFIG } from "../../../services/config";

const defaultState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

export const getPersistedAuthSession = () => {
  const rawValue = window.localStorage.getItem(APP_CONFIG.authStorageKey);

  if (!rawValue) {
    return defaultState;
  }

  try {
    const parsedValue = JSON.parse(rawValue);

    return {
      user: parsedValue.user ?? null,
      token: parsedValue.token ?? null,
      isAuthenticated: Boolean(parsedValue.token),
    };
  } catch {
    return defaultState;
  }
};

export const persistAuthSession = (session) => {
  window.localStorage.setItem(APP_CONFIG.authStorageKey, JSON.stringify(session));
};

export const clearPersistedAuthSession = () => {
  window.localStorage.removeItem(APP_CONFIG.authStorageKey);
};

const authSlice = createSlice({
  name: "auth",
  initialState: getPersistedAuthSession(),
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    clearCredentials: () => defaultState,
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export const selectAuth = (state) => state.auth;
export default authSlice.reducer;
