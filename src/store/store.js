import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/store/authSlice";
import menuReducer, {
  clearPersistedMenuState,
  persistMenuState,
} from "../features/menu/store/menuSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    menu: menuReducer,
  },
});

let previousMenuState = store.getState().menu;

store.subscribe(() => {
  const nextMenuState = store.getState().menu;

  if (nextMenuState === previousMenuState) {
    return;
  }

  previousMenuState = nextMenuState;

  if (nextMenuState.mainMenuItems.length || nextMenuState.bottomMenuItems.length) {
    persistMenuState(nextMenuState);
    return;
  }

  clearPersistedMenuState();
});
