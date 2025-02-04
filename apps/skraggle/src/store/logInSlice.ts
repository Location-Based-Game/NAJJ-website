import { fetchApi } from "@/lib/fetchApi";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GameSettings } from "@schemas/gameSettingsSchema";
import { SessionData } from "@schemas/sessionSchema";
import { z } from "zod";

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
  async (payload: { playerName: string; gameSettings: GameSettings }) => {
    const { playerName, gameSettings } = payload;

    const logInData = await fetchApi("logIn", { gameId: null });
    const { gameId } = z.object({ gameId: z.string() }).parse(logInData);

    const createRoomData = await fetchApi("createRoom", {
      playerName,
      gameSettings,
    });
    const playerId = z.string().parse(createRoomData);

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

    const logInData = await fetchApi("logIn", { gameId: joinCode });
    const { gameId } = z.object({ gameId: z.string() }).parse(logInData);

    const addPlayerData = await fetchApi("addPlayer", { playerName });
    const playerId = z.string().parse(addPlayerData);

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
