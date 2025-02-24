import { Action, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../store';

export interface Auth {
  token?: string;
  verificationStep: number;
  showVerificationDialog?: boolean;
}

const initialState: Auth = {
  token: null,
  verificationStep: 1,
  showVerificationDialog: true
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    logout(state, action: Action) {
      state.token = null;
    },
    setVerificationStep(state, action: PayloadAction<number>) {
      state.verificationStep = action.payload;
    },
    setShowVerificationDialog(state, action: PayloadAction<boolean>) {
      state.showVerificationDialog = action.payload;
    }
  }
});

export const authReducer = authSlice.reducer;
export const {
  setToken,
  logout,
  setVerificationStep,
  setShowVerificationDialog
} = authSlice.actions;
export const selectAuth: (state: AppState) => Auth = (state: AppState) =>
  state.auth;

export default authSlice;
