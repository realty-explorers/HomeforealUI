import { Action, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "../store";

export interface Auth {
  token?: string;
}

const initialState: Auth = {
  token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    logout(state, action: Action) {
      state.token = null;
    },
  },
});

export const authReducer = authSlice.reducer;
export const { setToken, logout } = authSlice.actions;
export const selectAuth: (state: AppState) => Auth = (state: AppState) =>
  state.auth;

export default authSlice;
