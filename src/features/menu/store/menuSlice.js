import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { APP_CONFIG } from "../../../services/config";
import { getAdminMenu } from "../services/menuService";
import { normalizeStoredMenuState } from "../utils/menuHelpers";

const defaultState = {
  mainMenuItems: [],
  bottomMenuItems: [],
  status: "idle",
  error: null,
  cachedAt: null,
};

const LEGACY_MENU_STORAGE_KEY = "menuItems";

const restoreMenuStateFromStorage = (rawValue) => {
  if (!rawValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(rawValue);
    const { mainMenuItems, bottomMenuItems } = normalizeStoredMenuState(parsedValue);
    const hasCachedMenu = mainMenuItems.length > 0 || bottomMenuItems.length > 0;

    return {
      mainMenuItems,
      bottomMenuItems,
      status: hasCachedMenu ? "succeeded" : "idle",
      error: null,
      cachedAt: parsedValue.cachedAt ?? null,
      hasCachedMenu,
    };
  } catch {
    return null;
  }
};

export const getPersistedMenuState = () => {
  const primaryStoredMenuState = restoreMenuStateFromStorage(
    window.localStorage.getItem(APP_CONFIG.menuStorageKey)
  );
  const legacyStoredMenuState = restoreMenuStateFromStorage(
    window.localStorage.getItem(LEGACY_MENU_STORAGE_KEY)
  );
  const storedMenuState = primaryStoredMenuState?.hasCachedMenu
    ? primaryStoredMenuState
    : legacyStoredMenuState?.hasCachedMenu
      ? legacyStoredMenuState
      : primaryStoredMenuState ?? legacyStoredMenuState;

  if (!storedMenuState) {
    return defaultState;
  }

  return {
    mainMenuItems: storedMenuState.mainMenuItems,
    bottomMenuItems: storedMenuState.bottomMenuItems,
    status: storedMenuState.status,
    error: null,
    cachedAt: storedMenuState.cachedAt,
  };
};

export const persistMenuState = (menuState) => {
  const hasCachedMenu = menuState.mainMenuItems.length > 0 || menuState.bottomMenuItems.length > 0;

  if (!hasCachedMenu) {
    window.localStorage.removeItem(APP_CONFIG.menuStorageKey);
    window.localStorage.removeItem(LEGACY_MENU_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(
    APP_CONFIG.menuStorageKey,
    JSON.stringify({
      mainMenuItems: menuState.mainMenuItems,
      bottomMenuItems: menuState.bottomMenuItems,
      cachedAt: menuState.cachedAt,
    })
  );
  window.localStorage.removeItem(LEGACY_MENU_STORAGE_KEY);
};

export const clearPersistedMenuState = () => {
  window.localStorage.removeItem(APP_CONFIG.menuStorageKey);
  window.localStorage.removeItem(LEGACY_MENU_STORAGE_KEY);
};

export const fetchMenu = createAsyncThunk("menu/fetchMenu", async (_, { rejectWithValue }) => {
  try {
    return await getAdminMenu();
  } catch (error) {
    return rejectWithValue(error.message || "Unable to load menu items.");
  }
});

const menuSlice = createSlice({
  name: "menu",
  initialState: getPersistedMenuState(),
  reducers: {
    clearMenu: () => defaultState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.mainMenuItems = action.payload.mainMenuItems;
        state.bottomMenuItems = action.payload.bottomMenuItems;
        state.cachedAt = Date.now();
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unable to load menu items.";
      });
  },
});

export const { clearMenu } = menuSlice.actions;
export const selectMenu = (state) => state.menu;
export default menuSlice.reducer;
