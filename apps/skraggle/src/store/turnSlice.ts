import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TurnState = {
  currentTurn: number;
  playerTurn: number | null;
  firstTurnPassed: boolean;
};

const initialState: TurnState = {
  currentTurn: 0,
  playerTurn: null,
  firstTurnPassed: false,
};

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
    resetTurnState: () => {
      return initialState;
    },
    /**
     * in order to fix board persist bugs, disable WebRTC data transfer
     * for the first turn if the player joins during GamePlay state
     */
    setFirstTurnPassed: (
      state: TurnState,
      action: PayloadAction<boolean>,
    ) => {
      state.firstTurnPassed = action.payload;
    },
  },
});

export const {
  setCurrentTurn,
  setPlayerTurn,
  resetTurnState,
  setFirstTurnPassed,
} = turnSlice.actions;
