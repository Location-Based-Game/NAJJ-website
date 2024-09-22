import { Draft, PayloadAction, createSlice } from "@reduxjs/toolkit";

interface UIComponent<TState> {
  state: TState;
}

export class UIStateSlice<TState> {
  updateState;
  reducer;

  constructor(name: string, initialComponent: UIComponent<TState>) {
    const slice = createSlice({
      name,
      initialState: initialComponent,
      reducers: {
        updateState: (
          state: Draft<UIComponent<TState>>,
          action: PayloadAction<TState>,
        ) => {
          state.state = action.payload as Draft<TState>;
        },
      },
    });

    this.updateState = slice.actions.updateState;
    this.reducer = slice.reducer;
  }
}
