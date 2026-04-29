import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { APP_CONFIG } from "../../../services/config";
import { getAdminMenu } from "../services/menuService";

const defaultState = {
  mainMenuItems: [],
  bottomMenuItems: [],
  status: "idle",
  error: null,
  cachedAt: null,
};

export const getPersistedMenuState = () => {
  const rawValue = window.localStorage.getItem(APP_CONFIG.menuStorageKey);

  if (!rawValue) {
    return defaultState;
  }

  try {
    const parsedValue = JSON.parse(rawValue);
    const mainMenuItems = parsedValue.mainMenuItems ?? [];
    const bottomMenuItems = parsedValue.bottomMenuItems ?? [];
    const hasCachedMenu = mainMenuItems.length > 0 || bottomMenuItems.length > 0;

    return {
      mainMenuItems,
      bottomMenuItems,
      status: hasCachedMenu ? "succeeded" : "idle",
      error: null,
      cachedAt: parsedValue.cachedAt ?? null,
    };
  } catch {
    return defaultState;
  }
};

export const persistMenuState = (menuState) => {
  const hasCachedMenu = menuState.mainMenuItems.length > 0 || menuState.bottomMenuItems.length > 0;

  if (!hasCachedMenu) {
    window.localStorage.removeItem(APP_CONFIG.menuStorageKey);
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
};

export const clearPersistedMenuState = () => {
  window.localStorage.removeItem(APP_CONFIG.menuStorageKey);
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
