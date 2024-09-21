import { configureStore } from "@reduxjs/toolkit";
import { UIStateSlice } from "./UIStateSlice";
import { MainMenuState } from "@/app/_main-menu/MainMenuPanel";

export const mainMenuState = new UIStateSlice<MainMenuState>("mainMenu", {
  state: "main",
});

export const store = configureStore({
  reducer: {
    mainMenu: mainMenuState.reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
