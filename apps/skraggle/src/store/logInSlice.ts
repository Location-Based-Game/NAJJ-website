import { fetchApi } from "@/lib/fetchApi";
import { SessionData } from "@/schemas/sessionSchema";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type LogInType = SessionData & {
  loading: boolean;
  error?: string;
};

const initialState: LogInType = {
  loading: false,
  gameId: "",
  playerId: "",
  playerName: "",
};

export const logInSlice = createSlice({
  name: "log in",
  initialState,
  reducers: {
    resetClientSessionData: () => {
      return initialState;
    },
    setLogInSession: (_: LogInType, action: PayloadAction<LogInType>) => {
      return action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logInCreate.pending, (state) => {
        state.loading = true;
      })
      .addCase(logInCreate.fulfilled, (_, action: PayloadAction<LogInType>) => {
        return action.payload;
      })
      .addCase(logInCreate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(logInJoin.pending, (state) => {
        state.loading = true;
      })
      .addCase(logInJoin.fulfilled, (_, action: PayloadAction<LogInType>) => {
        return action.payload;
      })
      .addCase(logInJoin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const logInCreate = createAsyncThunk(
  "log in/create room",
  async (playerName: string) => {
    const gameId = await fetchApi(`/api/logIn`);

    const params = new URLSearchParams({
      playerName,
    }).toString();
    const playerId = await fetchApi(`/api/create-room?${params}`);

    const sessionData: LogInType = {
      loading: false,
      gameId,
      playerId,
      playerName,
    };

    return sessionData;
  },
);

export const logInJoin = createAsyncThunk(
  "log in/join room",
  async (payload: { playerName: string; joinCode: string }) => {
    const { playerName, joinCode } = payload;

    const logInParams = new URLSearchParams({
      gameId: joinCode,
    }).toString();
    const gameId = await fetchApi(`/api/logIn?${logInParams}`);

    const params = new URLSearchParams({
      playerName,
    }).toString();
    const playerId = await fetchApi(`/api/add-player?${params}`);

    const sessionData: LogInType = {
      loading: false,
      gameId,
      playerId,
      playerName,
    };

    return sessionData;
  },
);

export const { resetClientSessionData, setLogInSession } = logInSlice.actions;
