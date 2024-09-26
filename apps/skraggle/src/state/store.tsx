import { configureStore } from "@reduxjs/toolkit";
import { UIStateSlice } from "./UIStateSlice";
import { MainMenuState } from "@/app/_main-menu/MainMenuPanel";
import { guestNameSlice } from "./GuestNameSlice";
import { joinCodeSlice } from "./JoinCodeSlice";

export const mainMenuState = new UIStateSlice<MainMenuState>("mainMenu", {
  state: "sign in join",
});

export const store = configureStore({
  reducer: {
    mainMenu: mainMenuState.reducer,
    guestName: guestNameSlice.reducer,
    joinCode: joinCodeSlice.reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
