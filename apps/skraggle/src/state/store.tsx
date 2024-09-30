import { configureStore } from "@reduxjs/toolkit";
import { UIStateSlice } from "./UIStateSlice";
import { guestNameSlice } from "./GuestNameSlice";
import { createCodeSlice } from "./CreateCodeSlice";
import { joinCodeSlice } from "./JoinCodeSlice";
import { MainMenuState } from "@/hooks/usePanelUI";
import { gameStateSlice } from "./GameStateSlice";

export const mainMenuState = new UIStateSlice<MainMenuState>("mainMenu", {
  state: "Create Game",
  slideFrom: "right"
});

export const store = configureStore({
  reducer: {
    mainMenu: mainMenuState.reducer,
    guestName: guestNameSlice.reducer,
    createCode: createCodeSlice.reducer,
    joinCode: joinCodeSlice.reducer,
    gameState: gameStateSlice.reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
