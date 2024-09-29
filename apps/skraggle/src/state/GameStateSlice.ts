import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GameState {
  state: string;
}

const initialState: GameState = {
  state: "Menu",
};

export const gameStateSlice = createSlice({
  name: "Game State",
  initialState,
  reducers: {
    setGameState: (state: GameState, action: PayloadAction<string>) => {
      state.state = action.payload;
    },
  },
});

export const { setGameState } = gameStateSlice.actions;
