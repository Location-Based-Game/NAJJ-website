import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Peer from "simple-peer";

type PeerStatus = "loading" | "error" | "connected";

export type PeerData = {
  peer: Peer.Instance;
  peerStatus: PeerStatus;
};

type PlayerPeers = {
  [playerId: string]: PeerData;
};

const initialState: PlayerPeers = {};

export const playerPeersSlice = createSlice({
  name: "Player Peers",
  initialState,
  reducers: {
    addPeer: (
      state: PlayerPeers,
      action: PayloadAction<{ playerId: string; data: PeerData }>,
    ) => {
      const { playerId, data } = action.payload;
      state[playerId] = data;
    },
    setPeerStatus: (
      state: PlayerPeers,
      action: PayloadAction<{ playerId: string; status: PeerStatus }>,
    ) => {
      const { playerId, status } = action.payload;
      state[playerId].peerStatus = status;
    },
    removePeer: (state: PlayerPeers, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
  },
});

export const {addPeer, setPeerStatus, removePeer} = playerPeersSlice.actions
