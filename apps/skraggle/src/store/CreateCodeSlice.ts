import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SetDefaultCode } from "./JoinCodeSlice";

interface CreateCode {
  code: string;
}

const initialState: CreateCode = {
  code: SetDefaultCode(),
};

export const createCodeSlice = createSlice({
  name: "Create Code",
  initialState,
  reducers: {
    setCreateCode: (state: CreateCode, action: PayloadAction<string>) => {
      console.log(action.payload)
      state.code = action.payload;
    },
  },
});

export const { setCreateCode } = createCodeSlice.actions;
