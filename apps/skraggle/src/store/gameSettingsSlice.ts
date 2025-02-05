import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GameSettings } from "@schemas/gameSettingsSchema";

const initialState: GameSettings = {
  realWordsOnly: false,
};

export const gameSettingsSlice = createSlice({
  name: "Game State",
  initialState,
  reducers: {
    setGameSettings: (_, action: PayloadAction<GameSettings>) => {
      return action.payload;
    },
  },
});

export const { setGameSettings } = gameSettingsSlice.actions;
