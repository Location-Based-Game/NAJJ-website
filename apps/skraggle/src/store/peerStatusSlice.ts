import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type PeerStatus = "pending" | "connected" | "not connected" | "error";
export type PeerStatuses = Record<string, PeerStatus>

const initialState: PeerStatuses = {};

export const peerStatusSlice = createSlice({
  name: "Peer Status",
  initialState,
  reducers: {
    setStatus: (
      state: PeerStatuses,
      action: PayloadAction<{ playerId: string; status: PeerStatus }>,
    ) => {
      const { playerId, status } = action.payload;
      state[playerId] = status;
    },
    addInitialStatus: (state: PeerStatuses, action: PayloadAction<string>) => {
      if (!state[action.payload]) {
        state[action.payload] = "not connected"
      }
    },
    removePeerStatus: (state: PeerStatuses, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
  },
});

export const {setStatus, addInitialStatus, removePeerStatus} = peerStatusSlice.actions
