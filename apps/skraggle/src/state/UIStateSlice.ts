import { Draft, PayloadAction, createSlice } from "@reduxjs/toolkit";

interface UIComponent<TState> {
  state: TState;
  panelWidth?: number;
  panelHeight?: number;
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
          action: PayloadAction<UIComponent<TState>>,
        ) => {
          return action.payload as Draft<UIComponent<TState>>;
        },
      },
    });

    this.updateState = slice.actions.updateState;
    this.reducer = slice.reducer;
  }
}
