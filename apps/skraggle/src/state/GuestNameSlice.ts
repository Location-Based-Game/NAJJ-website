import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GuestName {
  name: string;
  key: string;
}

const initialState: GuestName = {
  name: "",
  key: ""
};

export const guestNameSlice = createSlice({
  name: "Guest Name",
  initialState,
  reducers: {
    setGuestName: (state: GuestName, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setGuestKey: (state: GuestName, action: PayloadAction<string>) => {
      state.key = action.payload;
    },
  },
});

export const { setGuestName, setGuestKey } = guestNameSlice.actions;
