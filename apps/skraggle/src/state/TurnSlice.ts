import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const turnSlice = createSlice({
  name: "Turn Number",
  initialState: 0,
  reducers: {
    setTurnNumber: (state: number, action: PayloadAction<number>) => {
      return action.payload;
    },
  },
});

export const { setTurnNumber } = turnSlice.actions;
