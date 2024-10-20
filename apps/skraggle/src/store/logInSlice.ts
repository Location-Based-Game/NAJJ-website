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
    const logIn = await fetchApi(`/api/logIn`);
    const gameId = await logIn.json();

    const params = new URLSearchParams({
      playerName,
    }).toString();
    const createRoom = await fetchApi(`/api/create-room?${params}`);
    const playerId = await createRoom.json();

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
    const logIn = await fetchApi(`/api/logIn?${logInParams}`);
    const gameId = await logIn.json();

    const params = new URLSearchParams({
      playerName,
    }).toString();
    const addPlayer = await fetchApi(`/api/add-player?${params}`);
    const playerId = await addPlayer.json();

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
