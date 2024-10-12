import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface JoinCode {
  code: string;
}

export function SetDefaultCode() {
  if (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_USE_PLACEHOLDER_CODE === "true"
  ) {
    return process.env.NEXT_PUBLIC_PLACEHOLDER_CODE;
  }
  return "";
}

const initialState: JoinCode = {
  code: SetDefaultCode(),
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
