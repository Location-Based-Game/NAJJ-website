import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { UIStateSlice } from "./UIStateSlice";
import { joinCodeSlice } from "./joinCodeSlice";
import { MainMenuState } from "@/hooks/usePanelUI";
import { gameStateSlice } from "./gameStateSlice";
import { turnSlice } from "./turnSlice";
import { logInSlice } from "./logInSlice";

export const mainMenuState = new UIStateSlice<MainMenuState>("mainMenu", {
  state: "Home",
  slideFrom: "right",
});

const rootReducer = combineReducers({
  mainMenu: mainMenuState.reducer,
  joinCode: joinCodeSlice.reducer,
  gameState: gameStateSlice.reducer,
  currentTurn: turnSlice.reducer,
  logIn: logInSlice.reducer
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
