import { Action, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../store';

export interface Auth {
  token?: string;
  session?: any;
  verificationStep: number;
  showVerificationDialog?: boolean;
}

const initialState: Auth = {
  token: null,
  session: null,
  verificationStep: 1,
  showVerificationDialog: false
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    setSession(state, action: PayloadAction<any>) {
      state.session = action.payload;
    },
    logout(state, action: Action) {
      state.token = null;
      state.session = null;
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
  setSession,
  logout,
  setVerificationStep,
  setShowVerificationDialog
} = authSlice.actions;
export const selectAuth: (state: AppState) => Auth = (state: AppState) =>
  state.auth;

export default authSlice;
