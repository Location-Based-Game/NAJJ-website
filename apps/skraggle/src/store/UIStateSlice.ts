import { Draft, PayloadAction, createSlice } from "@reduxjs/toolkit";

export class UIStateSlice<TState> {
  updateState;
  reducer;

  constructor(name: string, initialComponent: TState) {
    const slice = createSlice({
      name,
      initialState: initialComponent,
      reducers: {
        updateState: (
          state: Draft<TState>,
          action: PayloadAction<TState>,
        ) => {
          return action.payload as Draft<TState>;
        },
      },
    });

    this.updateState = slice.actions.updateState;
    this.reducer = slice.reducer;
  }
}
