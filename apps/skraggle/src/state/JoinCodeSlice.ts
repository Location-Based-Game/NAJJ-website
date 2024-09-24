import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface JoinCode {
  code: string | null;
}

const initialState: JoinCode = {
  code: null,
};

export const joinCodeSlice = createSlice({
  name: "Join Code",
  initialState,
  reducers: {
    setJoinCode: (state: JoinCode, action: PayloadAction<string>) => {
      state.code = action.payload;
    },
  },
});

export const { setJoinCode } = joinCodeSlice.actions;
