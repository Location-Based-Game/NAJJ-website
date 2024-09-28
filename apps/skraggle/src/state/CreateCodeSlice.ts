import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CreateCode {
  code: string | null;
}

const initialState: CreateCode = {
  code: null,
};

export const createCodeSlice = createSlice({
  name: "Join Code",
  initialState,
  reducers: {
    setCreateCode: (state: CreateCode, action: PayloadAction<string>) => {
      state.code = action.payload;
    },
  },
});

export const { setCreateCode } = createCodeSlice.actions;
