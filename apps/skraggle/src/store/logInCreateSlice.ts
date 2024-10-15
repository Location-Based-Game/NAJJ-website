import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SessionData = {
  gameId: string;
  playerId: string;
  playerName: string;
}

type LogInCreate = SessionData & {
  loading: boolean;
  error?: string;
};

const initialState: LogInCreate = {
  loading: false,
  gameId: "",
  playerId: "",
  playerName: "",
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
      });
  },
});

export const logInCreate = createAsyncThunk(
  "create room/create session data",
  async (playerName: string) => {
    const logIn = await fetch(`/api/logIn`);
    const gameId = await logIn.json();

    const params = new URLSearchParams({
      gameId,
      playerName
    }).toString()

    const createRoom = await fetch(`/api/create-room?${params}`);
    const playerId = await createRoom.json();

    const sessionData: LogInCreate = {
      loading: false,
      gameId,
      playerId,
      playerName,
    };

    return sessionData;
  },
);

export const { resetLogInCreate } = logInCreateSlice.actions;
