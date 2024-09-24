import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GuestName {
  name: string;
}

const initialState: GuestName = {
  name: "",
};

export const guestNameSlice = createSlice({
  name: "Guest Name",
  initialState,
  reducers: {
    setGuestName: (state: GuestName, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
  },
});

export const { setGuestName } = guestNameSlice.actions;
