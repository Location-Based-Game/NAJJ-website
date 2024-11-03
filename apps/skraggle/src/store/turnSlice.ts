import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TurnState = {
  currentTurn:number;
  playerTurn: number | null;
}

const initialState:TurnState = {
  currentTurn: 0,
  playerTurn: null
}

export const turnSlice = createSlice({
  name: "Turn Number",
  initialState,
  reducers: {
    setCurrentTurn: (state: TurnState, action: PayloadAction<number>) => {
      state.currentTurn = action.payload;
    },
    setPlayerTurn: (state: TurnState, action: PayloadAction<number>) => {
      state.playerTurn = action.payload;
    },
  },
});

export const { setCurrentTurn, setPlayerTurn } = turnSlice.actions;
