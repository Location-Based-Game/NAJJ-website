import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum ItemTypes {
  StartingDice,
  LetterBlock,
}

export type ItemType<T> = {
  type: ItemTypes;
  data: T;
};
export type Inventory = Record<string, ItemType<any>>;
export type Inventories = Record<string, Inventory>;

export type PlayerData = {
  name: string;
  color: string;
  turn: number;
};

export type PlayersData = Record<string, PlayerData>;

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
