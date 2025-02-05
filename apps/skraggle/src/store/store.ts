import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { UIStateSlice } from "./UIStateSlice";
import { joinCodeSlice } from "./joinCodeSlice";
import { gameStateSlice } from "./gameStateSlice";
import { turnSlice } from "./turnSlice";
import { logInSlice } from "./logInSlice";
import { peerStatusSlice } from "./peerStatusSlice";
import { playersSlice } from "./playersSlice";
import { gameSettingsSlice } from "./gameSettingsSlice";

export type MainMenuState = {
  state: MainMenuStates
  slideFrom: "left" | "right";
};

export type MainMenuStates =
  | "Home"
  | "Sign In to Create"
  | "Sign In to Join"
  | "Create Game"
  | "Enter Join Code"
  | "Join Game"
  | "Rejoining"
  | "Rejoin Failed"
  | "Set Game Settings"

export const mainMenuState = new UIStateSlice<MainMenuState>("mainMenu", {
  state: "Home",
  slideFrom: "right",
});

const rootReducer = combineReducers({
  mainMenu: mainMenuState.reducer,
  joinCode: joinCodeSlice.reducer,
  gameState: gameStateSlice.reducer,
  turnState: turnSlice.reducer,
  logIn: logInSlice.reducer,
  peerStatus: peerStatusSlice.reducer,
  players: playersSlice.reducer,
  gameSettings: gameSettingsSlice.reducer
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
