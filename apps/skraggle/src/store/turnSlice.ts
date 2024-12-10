import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TurnState = {
  currentTurn: number;
  playerTurn: number | null;
  enableWebRTCAfterFirstTurn: boolean;
};

const initialState: TurnState = {
  currentTurn: 0,
  playerTurn: null,
  enableWebRTCAfterFirstTurn: true,
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
    enableWebRTCAfterFirstTurn: (
      state: TurnState,
      action: PayloadAction<boolean>,
    ) => {
      state.enableWebRTCAfterFirstTurn = action.payload;
    },
  },
});

export const {
  setCurrentTurn,
  setPlayerTurn,
  resetTurnState,
  enableWebRTCAfterFirstTurn,
} = turnSlice.actions;
