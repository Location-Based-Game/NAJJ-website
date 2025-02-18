import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GameStates } from "@types";

interface GameState {
  state: GameStates;
  isGameActive: boolean;
}

const initialState: GameState = {
  state: "Menu",
  isGameActive: false,
};

export const gameStateSlice = createSlice({
  name: "Game State",
  initialState,
  reducers: {
    setGameState: (state: GameState, action: PayloadAction<GameStates>) => {
      state.state = action.payload;
    },
    setGameActive: (state: GameState, action: PayloadAction<boolean>) => {
      state.isGameActive = action.payload;
    },
  },
});

export const { setGameState, setGameActive } = gameStateSlice.actions;
