import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PlayerData, PlayersData } from "@types";

export const playersSlice = createSlice({
  name: "players",
  initialState: {} as PlayersData,
  reducers: {
    addPlayer: (
      state: PlayersData,
      action: PayloadAction<{ key: string; value: PlayerData }>,
    ) => {
      state[action.payload.key] = action.payload.value;
    },
    removePlayer: (state: PlayersData, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    removeAllPlayers: () => {
      return {} as PlayersData;
    },
  },
});

export const { addPlayer, removePlayer, removeAllPlayers } =
  playersSlice.actions;
