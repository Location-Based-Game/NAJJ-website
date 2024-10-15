import { addPlayer } from "@/server-actions/addPlayer";
import createRoom from "@/server-actions/createRoom";
import setHost from "@/server-actions/setHost";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

type LogInCreate = {
  loading: boolean;
  error?: string;
  gameId: string;
  playerId: string;
  playerName: string;
};

const initialState: LogInCreate = {
  loading: false,
  gameId: "",
  playerId: "",
  playerName: ""
};

export const logInCreateSlice = createSlice({
  name: "create room",
  initialState,
  reducers: {
    resetLogInCreate: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logInCreate.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        logInCreate.fulfilled,
        (state, action: PayloadAction<LogInCreate>) => {
          return action.payload;
        },
      )
      .addCase(logInCreate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.gameId = "";
        state.playerId = "";
        state.playerName = "";
      });
  },
});

export const logInCreate = createAsyncThunk(
  "create room/create session data",
  async (playerName: string) => {
    const res = await fetch(`/api/logIn`);
    const code = await res.json();

    await createRoom({ gameId: code });

    const playerId = await addPlayer({
      gameId: code,
      playerName,
    });

    await setHost({ gameId: code, playerId });

    const sessionData: LogInCreate = {
      loading: false,
      gameId: code,
      playerId,
      playerName
    };

    return sessionData;
  },
);

export const { resetLogInCreate } = logInCreateSlice.actions;
