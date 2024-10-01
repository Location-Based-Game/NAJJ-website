import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SetDefaultCode } from "./JoinCodeSlice";

interface CreateCode {
  code: string | null;
}

const initialState: CreateCode = {
  code: SetDefaultCode(),
};

export const createCodeSlice = createSlice({
  name: "Create Code",
  initialState,
  reducers: {
    setCreateCode: (state: CreateCode, action: PayloadAction<string>) => {
      state.code = action.payload;
    },
  },
});

export const { setCreateCode } = createCodeSlice.actions;
