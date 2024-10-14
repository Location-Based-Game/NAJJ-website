import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { UIStateSlice } from "./UIStateSlice";
import { guestNameSlice } from "./GuestNameSlice";
import { createCodeSlice } from "./CreateCodeSlice";
import { joinCodeSlice } from "./JoinCodeSlice";
import { MainMenuState } from "@/hooks/usePanelUI";
import { gameStateSlice } from "./GameStateSlice";
import { turnSlice } from "./TurnSlice";

export const mainMenuState = new UIStateSlice<MainMenuState>("mainMenu", {
  state: "Sign In to Create",
  slideFrom: "right",
});

const rootReducer = combineReducers({
  mainMenu: mainMenuState.reducer,
  guestName: guestNameSlice.reducer,
  createCode: createCodeSlice.reducer,
  joinCode: joinCodeSlice.reducer,
  gameState: gameStateSlice.reducer,
  currentTurn: turnSlice.reducer,
});

export const setupStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
